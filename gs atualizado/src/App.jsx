import React from 'react';
    import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
    import { Toaster } from '@/components/ui/toaster';
    import { ThemeProvider } from '@/components/theme-provider';
    import Layout from '@/components/Layout';
    import HomePage from '@/pages/HomePage';
    import ClientsPage from '@/pages/ClientsPage';
    import AppointmentsPage from '@/pages/AppointmentsPage';
    import SettingsPage from '@/pages/SettingsPage';
    import LoginPage from '@/pages/LoginPage';
    import AppointmentCardPrintPage from '@/pages/AppointmentCardPrintPage';
    import AgendaPrintPage from '@/pages/AgendaPrintPage';

    const isAuthenticated = () => {
      return localStorage.getItem('authToken') === 'GSMEGA_AUTH_TOKEN_4846';
    };

    const ProtectedRoute = ({ children }) => {
      if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
      }
      return children;
    };
    
    const PublicRoute = ({ children }) => {
      if (isAuthenticated()) {
        return <Navigate to="/" replace />;
      }
      return children;
    };

    function App() {
      return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Router>
            <Routes>
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route 
                path="/print/appointment/:appointmentId" 
                element={
                  <ProtectedRoute>
                    <AppointmentCardPrintPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/print/agenda" 
                element={
                  <ProtectedRoute>
                    <AgendaPrintPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/*" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/clients" element={<ClientsPage />} />
                        <Route path="/appointments" element={<AppointmentsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
          <Toaster />
        </ThemeProvider>
      );
    }

    export default App;