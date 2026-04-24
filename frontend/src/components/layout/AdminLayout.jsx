import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const nav = [
  ['dashboard', '/admin'],
  ['estimates', '/admin/estimates'],
  ['invoices', '/admin/invoices'],
  ['finance', '/admin/finance'],
  ['documents', '/admin/documents'],
  ['apps', '/admin/apps'],
  ['licenses', '/admin/licenses'],
  ['projects', '/admin/projects'],
  ['time tracker', '/admin/time-tracker'],
  ['settings', '/admin/settings']
];

export default function AdminLayout() {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <aside className="bg-slate-900 p-4 border-r border-slate-800 space-y-2">
        <h1 className="font-bold text-cyan-300">Business OS</h1>
        {nav.map(([label, path]) => (
          <Link key={path} to={path} className="block p-2 rounded hover:bg-slate-800 text-sm">{label}</Link>
        ))}
        <button onClick={logout} className="mt-4 w-full bg-rose-600 px-3 py-2 rounded">Logout</button>
      </aside>
      <main className="p-6"><Outlet /></main>
    </div>
  );
}
