import { Routes, Route, Outlet } from 'react-router-dom'
import LoginPage from '@/pages/AuthenticationPages/LoginPage'
import SignupPage from '@/pages/AuthenticationPages/SignupPage'
import ForgotPassword from '@/pages/AuthenticationPages/ForgotPassword'
import VerifyCode from '@/pages/AuthenticationPages/VerificationCodePage'
import PasswordReset from './pages/AuthenticationPages/PasswordReset'
import Unauthorized from '@/pages/AuthenticationPages/Unauthorized'
import StudentDashboard from './pages/StudentPages/StudentDashboard'
import TeacherDashboard from './pages/TeacherPages/TeacherDashboard'
import OAuth2Callback from './components/OAuth2Callback'
import { useAuth } from './contexts/authentication-context'
import { Navigate } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import SpreadsheetsPage from './pages/TeacherPages/SpreadsheetsPage'
import { Loading } from './components/loading-state'
import SpreadsheetDisplayPage from './pages/TeacherPages/SpreadsheetDisplayPage'
import ClassesPage from './pages/TeacherPages/ClassesPage'
import ClassDetailPage from './pages/TeacherPages/ClassDetailPage'
import ReportsPage from './pages/TeacherPages/ReportPage'
import RoleSelection from './pages/OnBoardingPages/ChooseRole'
import TeacherOnboarding from './pages/OnBoardingPages/TeacherDetails'
import StudentOnboarding from './pages/OnBoardingPages/StudentDetails'
import { OnboardingProvider } from './contexts/onboarding-context'
import GradesPage from './pages/StudentPages/GradesPage'
import FeedbackPage from './pages/StudentPages/FeedbackPage'
import ProgressTrendsPage from './pages/StudentPages/ProgressTrendsPage'
import { Toaster } from 'react-hot-toast';
import StudentDetailsPage from './pages/TeacherPages/StudentDetailsPage'
import { setupMessageListener } from './services/notification/firebaseService'
import { useEffect } from 'react'
import NotificationsPage from './pages/NotificationPage'
import ProfilePage from './pages/ProfilePage'
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  if (loading) {
    return <Loading fullscreen variant={"spinner"} size="xl" />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if(allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet/>;
}

export const RoleBasedComponent = ({ children, allowedRoles }) => {
  const { userRole } = useAuth();
  
  if (!allowedRoles || (userRole && allowedRoles.includes(userRole))) {
    return <>{children}</>;
  }
  
  return null;
};

const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (isAuthenticated) {
    if (userRole == 'PENDING') {
      return <Navigate to="/onboarding/role" />;
    }
    if (userRole === 'TEACHER') {
      return <Navigate to="/teacher/dashboard" />;
    } else if (userRole === 'STUDENT') {
      return <Navigate to="/student/dashboard" />;
    }
  }

  return children;
};

const OnboardingRoute = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return <Loading fullscreen variant={"spinner"} size="xl" />;
  }

  return (
    <Outlet/>
  );
}

function App() {
  return (
    useEffect(() => {
      setupMessageListener()
    }, []),
    <>
    <Routes>
      <Route path="/login" element={<RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>} />
      <Route path="/signup" element={
        <RedirectIfAuthenticated>
          <SignupPage />
        </RedirectIfAuthenticated>
      }/>
      <Route path="/oauth2/callback" element={<OAuth2Callback />} />
      <Route path="/forgot-password" element={<RedirectIfAuthenticated><ForgotPassword /></RedirectIfAuthenticated>} />
      <Route path="/verify-code" element={<RedirectIfAuthenticated><VerifyCode /></RedirectIfAuthenticated>} />
      <Route path="/reset-password" element={<RedirectIfAuthenticated><PasswordReset /></RedirectIfAuthenticated>} />
      <Route path="/unauthorized" element={<Unauthorized/>} />
      <Route path="/" element={<RedirectIfAuthenticated><LandingPage /></RedirectIfAuthenticated>} />
      
      <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
        <Route path="/teacher/*" element={<TeacherDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/spreadsheets" element={<SpreadsheetsPage />} />
        <Route path="/teacher/spreadsheets/display/:id" element={<SpreadsheetDisplayPage />} />
        <Route path="/teacher/classes/:tab?" element={<ClassesPage />} />
        <Route path="/teacher/classes/classdetail/:id?" element={<ClassDetailPage />} />    
        <Route path="/teacher/reports/:tab?" element={<ReportsPage/>} />
        <Route path="/teacher/student-detais/:studentId" element={<StudentDetailsPage />} />   
        <Route path="/teacher/profile" element={<ProfilePage />} />
      </Route>
          
      <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
        <Route path="/student/*" element={<StudentDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/grades" element={<GradesPage />} />
        <Route path="/student/feedback/:feedbackId?" element={<FeedbackPage />} />
        <Route path="/student/progress-trends" element={<ProgressTrendsPage />} />
        <Route path="/student/profile" element={<ProfilePage />} />
      </Route>
      
      <Route element={<OnboardingRoute />}>
        <Route path='/onboarding/role' element={<RoleSelection/>}/>
        <Route path='/onboarding/student' element={<StudentOnboarding/>}/>
        <Route path='/onboarding/teacher' element={<TeacherOnboarding/>}/>
      </Route>
      <Route path="/notifications" element={<NotificationsPage />} />
      {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
    </Routes>
    <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#fff',
              color: '#000',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </>
  )
}

export default App