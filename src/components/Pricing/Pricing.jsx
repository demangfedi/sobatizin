import { packages } from '../../config/pricing.js';
import PricingCard from './PricingCard.jsx';

export default function Pricing() {
  return (
    <section id="harga" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Paket Layanan</h2>
          <p className="section-subtitle">
            Pilihan paket fleksibel sesuai kebutuhan legalitas usaha Anda. Konsultasikan terlebih
            dahulu untuk mendapatkan estimasi biaya resmi dan jasa.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => (
            <PricingCard key={pkg.id} {...pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
