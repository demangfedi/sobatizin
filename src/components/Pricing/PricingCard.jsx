import { site } from '../../config/site.js';

export default function PricingCard({ name, price, features, note, highlight }) {
  const displayPrice = price ?? 'Harga akan ditentukan';
  const isCustom = displayPrice === 'Hubungi Kami';

  return (
    <div
      className={`card-surface flex h-full flex-col gap-6 border-2 ${
        highlight ? 'border-brand-500 bg-brand-50/60' : 'border-transparent'
      }`}
    >
      <div>
        <p className="text-sm font-medium text-brand-600">Paket</p>
        <h3 className="mt-2 text-2xl font-semibold text-night">{name}</h3>
      </div>
      <div>
        <p className="text-3xl font-bold text-night">{displayPrice}</p>
        {note ? <p className="mt-2 text-sm text-slate-500">{note}</p> : null}
      </div>
      <ul className="space-y-3 text-sm text-slate-600">
        {features?.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-xs text-brand-700">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto space-y-3">
        <a
          href={site.whatsappLink}
          className={`btn-primary w-full justify-center ${highlight ? 'bg-brand-600 hover:bg-brand-500' : ''}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Konsultasi Gratis
        </a>
        {isCustom ? (
          <p className="small-muted text-center">Sesuaikan layanan sesuai kebutuhan usaha Anda.</p>
        ) : null}
      </div>
    </div>
  );
}
