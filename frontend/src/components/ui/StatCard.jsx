export default function StatCard({ label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
