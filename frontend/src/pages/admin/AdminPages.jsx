import { useEffect, useMemo, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../../api/client';
import StatCard from '../../components/ui/StatCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const useFetch = (url, deps = []) => {
  const [state, setState] = useState({ data: [], loading: true, error: '' });
  useEffect(() => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    api.get(url)
      .then((r) => setState({ data: r.data.data || [], loading: false, error: '' }))
      .catch((e) => setState({ data: [], loading: false, error: e.response?.data?.message || 'Failed to load' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
};

export function LoginPage() {
  const [email, setEmail] = useState('admin@bdl.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('admin_token', res.data.data.token);
      window.location.href = '/admin';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={submit} className="w-full max-w-sm bg-slate-900 p-6 rounded-xl space-y-3 border border-slate-800">
        <h1 className="text-xl font-bold">Admin Login</h1>
        <input className="w-full p-2 rounded bg-slate-800" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 rounded bg-slate-800" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-rose-400 text-sm">{error}</p>}
        <button className="w-full bg-cyan-500 text-slate-950 py-2 rounded font-semibold">Login</button>
      </form>
    </div>
  );
}

export function DashboardPage() {
  const [data, setData] = useState({ totalRevenue: 0, totalExpense: 0, profit: 0, pendingInvoices: 0, totalEstimates: 0 });
  const monthly = useFetch('/admin/analytics/monthly-summary', []);

  useEffect(() => { api.get('/admin/dashboard').then((r) => setData(r.data.data)).catch(() => {}); }, []);

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
        <Bar data={{ labels: (monthly.data || []).map((m) => m.month), datasets: [{ label: 'Income', data: (monthly.data || []).map((m) => m.income), backgroundColor: '#22d3ee' }, { label: 'Expense', data: (monthly.data || []).map((m) => m.expense), backgroundColor: '#f43f5e' }] }} />
      </div>
    </section>
  );
}

export function EstimatesPage() {
  const [refresh, setRefresh] = useState(0);
  const estimates = useFetch('/admin/estimates', [refresh]);
  const [form, setForm] = useState({ title: '', status: 'Draft', items: [{ name: '', qty: 1, price: 0 }] });

  const total = useMemo(() => form.items.reduce((s, i) => s + Number(i.qty || 0) * Number(i.price || 0), 0), [form.items]);

  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, { name: '', qty: 1, price: 0 }] }));
  const rmItem = (index) => setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== index) }));

  const save = async (e) => {
    e.preventDefault();
    await api.post('/admin/estimates', form);
    setForm({ title: '', status: 'Draft', items: [{ name: '', qty: 1, price: 0 }] });
    setRefresh((r) => r + 1);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Estimate Module</h2>
      <form onSubmit={save} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="grid md:grid-cols-3 gap-3">
          <input className="bg-slate-800 rounded p-2" placeholder="Estimate Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select className="bg-slate-800 rounded p-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {['Draft', 'Sent', 'Approved'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="bg-slate-800 rounded p-2"><option>Standard Template</option><option>Minimal Template</option></select>
        </div>
        {form.items.map((item, index) => (
          <div key={index} className="grid md:grid-cols-4 gap-2">
            <input className="bg-slate-800 rounded p-2" placeholder="Item" value={item.name} onChange={(e) => setForm({ ...form, items: form.items.map((x, i) => i === index ? { ...x, name: e.target.value } : x) })} />
            <input className="bg-slate-800 rounded p-2" type="number" placeholder="Qty" value={item.qty} onChange={(e) => setForm({ ...form, items: form.items.map((x, i) => i === index ? { ...x, qty: Number(e.target.value) } : x) })} />
            <input className="bg-slate-800 rounded p-2" type="number" placeholder="Price" value={item.price} onChange={(e) => setForm({ ...form, items: form.items.map((x, i) => i === index ? { ...x, price: Number(e.target.value) } : x) })} />
            <button type="button" onClick={() => rmItem(index)} className="bg-rose-600 rounded p-2">Remove</button>
          </div>
        ))}
        <div className="flex items-center gap-3">
          <button type="button" onClick={addItem} className="bg-slate-700 px-4 py-2 rounded">+ Add Item</button>
          <span className="text-cyan-300 font-semibold">Total: ₹{total.toFixed(2)}</span>
          <button className="ml-auto bg-cyan-500 text-slate-950 px-4 py-2 rounded font-semibold">Create Estimate</button>
        </div>
      </form>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <h3 className="font-semibold mb-2">Existing Estimates</h3>
        <div className="space-y-2 text-sm">
          {(estimates.data || []).map((e) => (
            <div key={e.id} className="flex gap-2 items-center justify-between border border-slate-700 rounded p-2">
              <div>{e.title} - ₹{e.total_amount} ({e.status})</div>
              <div className="flex gap-2">
                <button onClick={() => api.post(`/admin/estimates/${e.id}/duplicate`).then(() => setRefresh((r) => r + 1))} className="px-2 py-1 bg-slate-700 rounded">Duplicate</button>
                <button onClick={() => window.open(`${api.defaults.baseURL}/admin/estimates/${e.id}/pdf`, '_blank')} className="px-2 py-1 bg-cyan-600 rounded">PDF</button>
                <button onClick={() => api.delete(`/admin/estimates/${e.id}`).then(() => setRefresh((r) => r + 1))} className="px-2 py-1 bg-rose-600 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InvoicesPage() {
  const [refresh, setRefresh] = useState(0);
  const invoices = useFetch('/admin/invoices', [refresh]);
  const [estimateId, setEstimateId] = useState('');

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Invoice Module</h2>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-2">
        <input className="bg-slate-800 rounded p-2" placeholder="Estimate ID" value={estimateId} onChange={(e) => setEstimateId(e.target.value)} />
        <button onClick={() => api.post('/admin/invoices/convert-estimate', { estimate_id: Number(estimateId), gst_percent: 18 }).then(() => setRefresh((r) => r + 1))} className="bg-cyan-500 text-slate-950 px-3 rounded">Convert to Invoice</button>
      </div>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
        {(invoices.data || []).map((inv) => (
          <div key={inv.id} className="border border-slate-700 rounded p-2 flex justify-between items-center">
            <div>{inv.invoice_number} | ₹{inv.total_amount} | Paid: ₹{inv.paid_amount || 0} | {inv.payment_status}</div>
            <button onClick={() => api.patch(`/admin/invoices/${inv.id}/payment`, { paid_amount: inv.total_amount }).then(() => setRefresh((r) => r + 1))} className="bg-emerald-600 px-2 py-1 rounded">Mark Paid</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FinancePage() {
  const [refresh, setRefresh] = useState(0);
  const monthly = useFetch('/admin/analytics/monthly-summary', [refresh]);
  const income = useFetch('/admin/analytics/categories/income', [refresh]);
  const expense = useFetch('/admin/analytics/categories/expense', [refresh]);
  const [form, setForm] = useState({ type: 'income', category: '', amount: '', txn_date: '' });

  const addTxn = async (e) => {
    e.preventDefault();
    await api.post('/admin/transactions', form);
    setForm({ type: 'income', category: '', amount: '', txn_date: '' });
    setRefresh((r) => r + 1);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Income & Expense</h2>
      <form onSubmit={addTxn} className="grid md:grid-cols-5 gap-2 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <select className="bg-slate-800 rounded p-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="income">Income</option><option value="expense">Expense</option></select>
        <input className="bg-slate-800 rounded p-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="bg-slate-800 rounded p-2" type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input className="bg-slate-800 rounded p-2" type="date" value={form.txn_date} onChange={(e) => setForm({ ...form, txn_date: e.target.value })} />
        <button className="bg-cyan-500 text-slate-950 rounded">Add</button>
      </form>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl"><Bar data={{ labels: (monthly.data || []).map((m) => m.month), datasets: [{ label: 'Income', data: (monthly.data || []).map((m) => m.income), backgroundColor: '#22d3ee' }, { label: 'Expense', data: (monthly.data || []).map((m) => m.expense), backgroundColor: '#f43f5e' }] }} /></div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl"><Pie data={{ labels: (expense.data || []).map((c) => c.category), datasets: [{ data: (expense.data || []).map((c) => c.amount), backgroundColor: ['#22d3ee', '#f43f5e', '#22c55e', '#f59e0b', '#a855f7'] }] }} /></div>
      </div>
      <div className="text-sm text-slate-300">Income categories tracked: {(income.data || []).length}</div>
    </section>
  );
}

export function DocumentsPage() {
  const [refresh, setRefresh] = useState(0);
  const docs = useFetch('/admin/documents', [refresh]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const upload = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('file', file);
    await api.post('/admin/documents/upload', fd);
    setTitle(''); setFile(null); setRefresh((r) => r + 1);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Document Manager</h2>
      <form onSubmit={upload} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-2">
        <input className="bg-slate-800 rounded p-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="bg-slate-800 rounded p-2" type="file" onChange={(e) => setFile(e.target.files?.[0])} />
        <button className="bg-cyan-500 text-slate-950 px-3 rounded">Upload</button>
      </form>
      <div className="space-y-2">{(docs.data || []).map((d) => <a key={d.id} className="block bg-slate-900 border border-slate-800 rounded p-2" href={`${api.defaults.baseURL}/admin/documents/${d.id}/download`}>{d.title}</a>)}</div>
    </section>
  );
}

export function AppsPage() {
  const [refresh, setRefresh] = useState(0);
  const apps = useFetch('/admin/apps', [refresh]);
  const [form, setForm] = useState({ app_name: '', version_name: '', download_url: '', description: '' });

  const create = async (e) => {
    e.preventDefault();
    await api.post('/admin/apps', form);
    setForm({ app_name: '', version_name: '', download_url: '', description: '' });
    setRefresh((r) => r + 1);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">App Manager</h2>
      <form onSubmit={create} className="grid md:grid-cols-5 gap-2 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <input className="bg-slate-800 rounded p-2" placeholder="App" value={form.app_name} onChange={(e) => setForm({ ...form, app_name: e.target.value })} />
        <input className="bg-slate-800 rounded p-2" placeholder="Version" value={form.version_name} onChange={(e) => setForm({ ...form, version_name: e.target.value })} />
        <input className="bg-slate-800 rounded p-2" placeholder="Download URL" value={form.download_url} onChange={(e) => setForm({ ...form, download_url: e.target.value })} />
        <input className="bg-slate-800 rounded p-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="bg-cyan-500 text-slate-950 rounded">Save</button>
      </form>
      <div className="space-y-2">{(apps.data || []).map((a) => <div key={a.id} className="bg-slate-900 border border-slate-800 rounded p-2 flex justify-between"><span>{a.app_name} {a.version_name}</span><button onClick={() => api.delete(`/admin/apps/${a.id}`).then(() => setRefresh((r) => r + 1))} className="bg-rose-600 px-2 rounded">Delete</button></div>)}</div>
    </section>
  );
}

export function LicensesPage() {
  const [refresh, setRefresh] = useState(0);
  const licenses = useFetch('/admin/licenses', [refresh]);
  const [productName, setProductName] = useState('Girvi Pro');

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Girvi License Admin</h2>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-2">
        <input className="bg-slate-800 rounded p-2" value={productName} onChange={(e) => setProductName(e.target.value)} />
        <button onClick={() => api.post('/admin/licenses/generate', { product_name: productName }).then(() => setRefresh((r) => r + 1))} className="bg-cyan-500 text-slate-950 px-3 rounded">Generate</button>
        <button onClick={() => api.post('/admin/licenses/mark-expired').then(() => setRefresh((r) => r + 1))} className="bg-slate-700 px-3 rounded">Mark Expired</button>
      </div>
      <div className="space-y-2">{(licenses.data || []).map((l) => <div key={l.id} className="bg-slate-900 border border-slate-800 rounded p-2">{l.license_key} | {l.status} | {l.machine_id || 'unbound'}</div>)}</div>
    </section>
  );
}

export function ProjectsPage() {
  const [refresh, setRefresh] = useState(0);
  const projects = useFetch('/admin/projects', [refresh]);
  const [name, setName] = useState('');

  const create = async (e) => {
    e.preventDefault();
    await api.post('/admin/projects', { name });
    setName(''); setRefresh((r) => r + 1);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Project Tracker</h2>
      <form onSubmit={create} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-2">
        <input className="bg-slate-800 rounded p-2" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="bg-cyan-500 text-slate-950 px-3 rounded">Add</button>
      </form>
      <div className="space-y-2">{(projects.data || []).map((p) => <div key={p.id} className="bg-slate-900 border border-slate-800 rounded p-2">{p.name} - {p.status}</div>)}</div>
    </section>
  );
}

export function TimeTrackerPage() {
  const [refresh, setRefresh] = useState(0);
  const summary = useFetch('/admin/time-entries/summary', [refresh]);
  const [form, setForm] = useState({ project_id: '', hours: '', entry_date: '', notes: '' });

  const add = async (e) => {
    e.preventDefault();
    await api.post('/admin/time-entries', form);
    setForm({ project_id: '', hours: '', entry_date: '', notes: '' });
    setRefresh((r) => r + 1);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Time Tracker</h2>
      <form onSubmit={add} className="grid md:grid-cols-5 gap-2 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <input className="bg-slate-800 rounded p-2" placeholder="Project ID" value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })} />
        <input className="bg-slate-800 rounded p-2" type="number" placeholder="Hours" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
        <input className="bg-slate-800 rounded p-2" type="date" value={form.entry_date} onChange={(e) => setForm({ ...form, entry_date: e.target.value })} />
        <input className="bg-slate-800 rounded p-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button className="bg-cyan-500 text-slate-950 rounded">Add Entry</button>
      </form>
      <div className="space-y-2">{(summary.data || []).map((s) => <div key={s.project_id} className="bg-slate-900 border border-slate-800 rounded p-2">{s.project_name}: {s.total_hours} hrs</div>)}</div>
    </section>
  );
}

export function SettingsPage() {
  const [settings, setSettings] = useState({ company_name: '', logo_url: '', gst_number: '', address: '', phone: '', email: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => { api.get('/admin/settings').then((r) => setSettings((s) => ({ ...s, ...r.data.data }))); }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.post('/admin/settings', settings);
    setSaved(true);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Settings</h2>
      <form onSubmit={save} className="grid md:grid-cols-2 gap-2 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        {Object.keys(settings).map((k) => <input key={k} className="bg-slate-800 rounded p-2" placeholder={k} value={settings[k] || ''} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })} />)}
        <button className="md:col-span-2 bg-cyan-500 text-slate-950 rounded py-2">Save Settings</button>
      </form>
      {saved && <p className="text-emerald-400">Saved. New PDFs will use latest company details.</p>}
    </section>
  );
}
