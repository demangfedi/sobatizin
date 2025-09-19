export default function ServiceCard({ icon, title, description }) {
  return (
    <div className="card-surface h-full">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-night">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
