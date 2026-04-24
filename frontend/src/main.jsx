import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import { AboutPage, ContactPage, DownloadsPage, HomePage, ProductsPage, ServicesPage } from './pages/public/PublicPages';
import { AppsPage, DashboardPage, DocumentsPage, EstimatesPage, FinancePage, InvoicesPage, LicensesPage, LoginPage, ProjectsPage, SettingsPage, TimeTrackerPage } from './pages/admin/AdminPages';

function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<Protected><AdminLayout /></Protected>}>
            <Route index element={<DashboardPage />} />
            <Route path="estimates" element={<EstimatesPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="apps" element={<AppsPage />} />
            <Route path="licenses" element={<LicensesPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="time-tracker" element={<TimeTrackerPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('root')).render(<App />);
