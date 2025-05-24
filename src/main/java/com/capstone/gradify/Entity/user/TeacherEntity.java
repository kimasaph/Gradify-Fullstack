package com.capstone.gradify.Entity.user;

import com.capstone.gradify.Entity.ReportEntity;
import com.capstone.gradify.Entity.records.ClassEntity;
import com.capstone.gradify.Entity.records.ClassSpreadsheet;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.Setter;
import net.minidev.json.annotate.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "user_id")
public class TeacherEntity extends UserEntity {
    private String institution;
    private String department;

    @OneToMany(mappedBy = "uploadedBy", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ClassSpreadsheet> classesRecord = new ArrayList<>();

    @OneToMany(mappedBy = "teacher")
    @JsonManagedReference(value = "teacher-class")
    private List<ClassEntity> classes = new ArrayList<>();

    @OneToMany(mappedBy = "teacher")
    @JsonManagedReference(value = "teacher-report")
    private List<ReportEntity> sentReports = new ArrayList<>();

    public TeacherEntity() {
        super(); // Call parent constructor which initializes version
        // Additional initialization if needed
        this.classesRecord = new ArrayList<>();
        this.classes = new ArrayList<>();
        this.sentReports = new ArrayList<>();
    }
    
    // Alternative constructor for OAuth scenarios
    public TeacherEntity(String email, String name) {
        super(); // Call parent constructor which initializes version
        this.setEmail(email);
        this.setFirstName(name);
        this.classesRecord = new ArrayList<>();
        this.classes = new ArrayList<>();
        this.sentReports = new ArrayList<>();
    }
    
    // Override to ensure proper initialization
    @Override
    @PrePersist
    @PreUpdate
    protected void ensureVersionInitialized() {
        super.ensureVersionInitialized(); // Call parent method
    }
}