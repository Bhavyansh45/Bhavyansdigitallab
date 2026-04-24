import { useState } from 'react';
import api from '../../api/client';

export const HomePage = () => <section><h1 className="text-4xl font-bold">Bhavyansh Digital Lab</h1><p className="mt-3 text-slate-300">Automation-first development studio.</p></section>;
export const AboutPage = () => <section><h2 className="text-3xl font-semibold">About</h2><p className="mt-2">Developer-focused business systems specialist.</p></section>;
export const ServicesPage = () => <section><h2 className="text-3xl font-semibold">Services</h2><ul className="list-disc ml-6 mt-3"><li>Web App Development</li><li>Finance Systems</li><li>Jewelry Girvi System</li><li>Custom Software</li></ul></section>;
export const ProductsPage = () => <section><h2 className="text-3xl font-semibold">Products</h2><p className="mt-2">Showcase of apps and internal tools.</p></section>;
export const DownloadsPage = () => <section><h2 className="text-3xl font-semibold">App Downloads</h2><p className="mt-2">Version history, links, and release notes.</p></section>;

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/public/inquiries', form);
    setDone(true);
  };

  return (
    <section>
      <h2 className="text-3xl font-semibold">Contact</h2>
      <form onSubmit={submit} className="grid gap-3 mt-4 max-w-xl">
        {['name', 'email', 'phone'].map((f) => <input key={f} className="bg-slate-900 border border-slate-700 p-2 rounded" placeholder={f} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />)}
        <textarea className="bg-slate-900 border border-slate-700 p-2 rounded" rows="5" placeholder="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button className="bg-cyan-500 text-slate-950 py-2 rounded font-semibold">Send Inquiry</button>
      </form>
      {done && <p className="text-emerald-400 mt-2">Inquiry sent successfully.</p>}
    </section>
  );
}
