import { Link, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  const links = ['/', '/about', '/services', '/products', '/downloads', '/contact'];
  return (
    <div>
      <header className="border-b border-slate-800 p-4 flex gap-4">
        {links.map((l) => <Link key={l} to={l} className="text-slate-200 hover:text-cyan-300">{l === '/' ? 'home' : l.slice(1)}</Link>)}
        <Link to="/admin/login" className="ml-auto text-cyan-300">Admin</Link>
      </header>
      <main className="max-w-6xl mx-auto p-6"><Outlet /></main>
    </div>
  );
}
