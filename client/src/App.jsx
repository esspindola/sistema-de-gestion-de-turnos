import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import LoginPage from './modules/auth/LoginPage.jsx';
import RegisterPage from './modules/auth/RegisterPage.jsx';
import Layout from './components/Layout.jsx';
import AdminAppointments from './modules/appointments/AdminAppointments.jsx';
import MyAppointments from './modules/appointments/MyAppointments.jsx';
import NewAppointment from './modules/appointments/NewAppointment.jsx';
import Professionals from './modules/professionals/Professionals.jsx';
import Users from './modules/users/Users.jsx';

function Router() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState('login');
  const [page, setPage] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <span className="text-gray-500 text-sm">Cargando...</span>
      </div>
    );
  }

  if (!user) {
    return authView === 'login'
      ? <LoginPage onSwitch={() => setAuthView('register')} />
      : <RegisterPage onSwitch={() => setAuthView('login')} />;
  }

  const defaultPage = user.role === 'admin' ? 'appointments' : 'my-appointments';
  const currentPage = page || defaultPage;

  const content = {
    appointments: <AdminAppointments />,
    professionals: <Professionals />,
    users: <Users />,
    'my-appointments': <MyAppointments />,
    'new-appointment': <NewAppointment onCreated={() => setPage('my-appointments')} />,
  }[currentPage];

  return (
    <Layout page={currentPage} setPage={setPage}>
      {content}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
