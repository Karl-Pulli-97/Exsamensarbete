import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AddCatchPage } from './pages/AddCatchPage';
import { CatchesPage } from './pages/CatchesPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AddCatchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/catches"
        element={
          <ProtectedRoute>
            <CatchesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;