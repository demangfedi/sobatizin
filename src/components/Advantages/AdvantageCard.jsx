export default function AdvantageCard({ title, description, accent }) {
  return (
    <div className="card-surface h-full">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${accent}`}>
          ✓
        </span>
        <h3 className="text-lg font-semibold text-night">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-slate-600">{description}</p>
    </div>
  );
}
