import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import api from '../../api/client';
import StatCard from '../../components/ui/StatCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function LoginPage() {
  const [email, setEmail] = useState('admin@bdl.com');
  const [password, setPassword] = useState('password123');

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('admin_token', res.data.token);
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={submit} className="w-full max-w-sm bg-slate-900 p-6 rounded-xl space-y-3">
        <h1 className="text-xl font-bold">Admin Login</h1>
        <input className="w-full p-2 rounded bg-slate-800" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 rounded bg-slate-800" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-cyan-500 text-slate-950 py-2 rounded font-semibold">Login</button>
      </form>
    </div>
  );
}

export function DashboardPage() {
  const [data, setData] = useState({ totalRevenue: 0, totalExpense: 0, profit: 0, pendingInvoices: 0, totalEstimates: 0 });
  useEffect(() => { api.get('/admin/dashboard').then((r) => setData(r.data)).catch(() => {}); }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid md:grid-cols-5 gap-3">
        <StatCard label="Revenue" value={`₹${data.totalRevenue}`} />
        <StatCard label="Expense" value={`₹${data.totalExpense}`} />
        <StatCard label="Profit" value={`₹${data.profit}`} />
        <StatCard label="Pending Invoices" value={data.pendingInvoices} />
        <StatCard label="Estimates" value={data.totalEstimates} />
      </div>
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <Bar data={{ labels: ['Revenue', 'Expense', 'Profit'], datasets: [{ label: 'Amount', data: [data.totalRevenue, data.totalExpense, data.profit], backgroundColor: ['#22d3ee', '#f43f5e', '#22c55e'] }] }} />
      </div>
    </section>
  );
}

const generic = (title) => () => <section><h2 className="text-2xl font-bold">{title}</h2><p className="mt-2 text-slate-300">CRUD module scaffold ready for API integration.</p></section>;

export const EstimatesPage = generic('Estimate Module');
export const InvoicesPage = generic('Invoice Module');
export const FinancePage = generic('Income & Expense Module');
export const DocumentsPage = generic('Document Manager');
export const AppsPage = generic('App Manager');
export const LicensesPage = generic('Girvi License Admin');
export const ProjectsPage = generic('Project Tracker');
export const TimeTrackerPage = generic('Time Tracker');
export const SettingsPage = generic('Settings');
