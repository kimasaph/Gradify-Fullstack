import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Save, Send, Loader2 } from "lucide-react"; // Import Send and Loader2 icons
import { useAuth } from "@/contexts/authentication-context";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSpreadsheetByClassId, sendColumnGrades } from "@/services/teacher/classServices"; // Import sendColumnGrades
import { updateGrades } from '@/services/teacher/spreadsheetservices'; // Import the new service
import toast from "react-hot-toast";

export function GradeEditTable({ classId }) {
  const { currentUser, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [spreadsheet, setSpreadsheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSendingGrades, setIsSendingGrades] = useState(false);
  const [sendingColumn, setSendingColumn] = useState(null);
  const excludedFields = ["Student Number", "First Name", "Last Name"];

  // Add useMutation hook for updating grades
  const updateGradesMutation = useMutation({
    mutationFn: (gradesToUpdate) => {
      // This ensures getAuthHeader() is called and passed to the service function
      return updateGrades(gradesToUpdate, getAuthHeader());
    },
    onSuccess: async (data) => {
      toast.success(data || "Grades saved successfully!");
      setSaveSuccess(true);
      
      // Refetch the data and wait for it to complete
      await queryClient.refetchQueries({ queryKey: ['spreadsheet', classId] });
      
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save grades.");
      setError("Failed to save changes");
    }
  });

  useEffect(() => {
    const fetchSpreadsheet = async () => {
      if (!classId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        console.log("Fetching spreadsheet for classId:", classId);
        const data = await getSpreadsheetByClassId(classId, getAuthHeader());
        console.log("Fetched spreadsheet data:", data);

        // The API returns an array, but we need the first item
        const spreadsheetData = Array.isArray(data) ? data[0] : data;
        setSpreadsheet(spreadsheetData);

        // Initialize editedData with current values
        const initialEditState = {};
        if (spreadsheetData && spreadsheetData.gradeRecords) {
          spreadsheetData.gradeRecords.forEach((record) => {
            if (record && record.grades && record.grades["Student Number"]) {
              const studentId = record.grades["Student Number"];
              initialEditState[studentId] = { ...record.grades };
            }
          });
        }
        setEditedData(initialEditState);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching spreadsheet:", err);
        setError("Failed to load spreadsheet data");
        setLoading(false);
      }
    };

    fetchSpreadsheet();
  }, [classId, getAuthHeader]);

  // Clear edited data when spreadsheet data changes (after successful save)
  useEffect(() => {
    if (spreadsheet && spreadsheet.gradeRecords) {
      const freshEditState = {};
      spreadsheet.gradeRecords.forEach((record) => {
        if (record && record.grades && record.grades["Student Number"]) {
          const studentId = record.grades["Student Number"];
          freshEditState[studentId] = { ...record.grades };
        }
      });
      setEditedData(freshEditState);
    }
  }, [spreadsheet]);

  const getGradeColumns = () => {
    if (!spreadsheet?.gradeRecords?.length) return [];
    const allKeys = new Set();
    spreadsheet.gradeRecords.forEach((record) => {
      if (record && record.grades) {
        Object.keys(record.grades).forEach((key) => {
          if (!excludedFields.includes(key)) {
            allKeys.add(key);
          }
        });
      }
    });
    return Array.from(allKeys).sort();
  };

  const handleGradeChange = (studentId, column, value) => {
    setEditedData((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [column]: value,
      },
    }));
  };

  const handleSendGrades = async (column) => {
    setIsSendingGrades(true);
    setSendingColumn(column);
    const toastId = toast.loading(`Sending "${column}" grades to students...`);

    try {
      await sendColumnGrades(classId, column, getAuthHeader());
      toast.success(`"${column}" grades have been sent and students notified.`, { id: toastId });
    } catch (error) {
      toast.error(`Failed to send grades for "${column}": ${error.message}`, { id: toastId });
    } finally {
      setIsSendingGrades(false);
      setSendingColumn(null);
    }
  };

  const handleSave = async () => {
    if (!spreadsheet || !spreadsheet.gradeRecords) return;

    // This logic correctly finds that changes were made.
    const hasChanges = Object.keys(editedData).some(studentId => {
      const originalRecord = spreadsheet.gradeRecords.find(
        record => record.grades && record.grades["Student Number"] === studentId
      );
      if (!originalRecord) return false;
      
      return Object.keys(editedData[studentId] || {}).some(column => {
        return editedData[studentId][column] !== originalRecord.grades[column];
      });
    });

    if (!hasChanges) {
      toast.info("No changes to save.");
      return;
    }

    const gradesToUpdate = [];
    Object.keys(editedData).forEach(studentId => {
      const originalRecord = spreadsheet.gradeRecords.find(
        record => record.grades && record.grades["Student Number"] === studentId
      );
      
      // --- THE FIX ---
      // We check for 'originalRecord.id' instead of 'originalRecord.gradeRecordId'.
      if (originalRecord && originalRecord.id) {
        gradesToUpdate.push({
          // The backend expects the field to be named 'gradeRecordId' in the request,
          // so we map the value from 'originalRecord.id' to it.
          gradeRecordId: originalRecord.id, 
          grades: editedData[studentId]
        });
      }
    });

    if (gradesToUpdate.length > 0) {
      // With the fix above, this will now run correctly.
      updateGradesMutation.mutate(gradesToUpdate);
    } else {
        // This block should no longer be reached.
    }
  };

  // Only calculate grade columns if spreadsheet exists
  const gradeColumns = spreadsheet ? getGradeColumns() : [];

  if (loading) {
    return <div className="py-8 text-center">Loading grade data...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  if (
    !spreadsheet ||
    !spreadsheet.gradeRecords ||
    spreadsheet.gradeRecords.length === 0
  ) {
    return (
      <div className="py-8 text-center">
        No grade records found for this class.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          Edit Grades for {spreadsheet.className}
        </h2>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-green-600">Changes saved successfully!</span>
          )}
          <Button
            onClick={handleSave}
            disabled={updateGradesMutation.isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {updateGradesMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#198754]/10">
              <TableHead className="font-bold">Student Number</TableHead>
              <TableHead className="font-bold">First Name</TableHead>
              <TableHead className="font-bold">Last Name</TableHead>
              {gradeColumns.map((column) => (
                <TableHead key={column} className="font-bold">
                  <div className="flex items-center justify-between">
                    <span>{column}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSendGrades(column)}
                      disabled={isSendingGrades}
                      title={`Send ${column} grades`}
                    >
                      {isSendingGrades && sendingColumn === column ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {spreadsheet.gradeRecords.map((record, index) => {
              if (!record || !record.grades) {
                return null;
              }

              const studentId =
                record.grades["Student Number"] || record.studentNumber || "";
              const uniqueKey = studentId || record.id || `student-${index}`;

              return (
                <TableRow key={uniqueKey} className="hover:bg-[#198754]/10">
                  <TableCell>{studentId}</TableCell>
                  <TableCell>{record.grades["First Name"] || ""}</TableCell>
                  <TableCell>{record.grades["Last Name"] || ""}</TableCell>
                  {gradeColumns.map((column) => (
                    <TableCell key={column}>
                      <input
                        type="text"
                        value={
                          editedData[studentId]?.[column] ||
                          record.grades[column] ||
                          ""
                        }
                        onChange={(e) =>
                          handleGradeChange(studentId, column, e.target.value)
                        }
                        className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}