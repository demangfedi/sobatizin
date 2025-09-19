import AdvantageCard from './AdvantageCard.jsx';

const advantages = [
  {
    title: 'Proses Cepat & Terstruktur',
    description:
      'Metode kerja digital-first dengan checklist jelas sehingga izin terbit sesuai target waktu.',
    accent: 'bg-brand-500',
  },
  {
    title: 'Tim Berpengalaman',
    description:
      'Konsultan senior dengan pengalaman lintas sektor dan akses langsung ke sistem OSS RBA.',
    accent: 'bg-brand-600',
  },
  {
    title: 'Biaya Transparan',
    description:
      'Estimasi biaya resmi dan jasa dijelaskan di awal, tanpa biaya tersembunyi di akhir proyek.',
    accent: 'bg-brand-700',
  },
  {
    title: 'Pendampingan End-to-End',
    description:
      'Mulai dari analisis kebutuhan, pengajuan, hingga pemenuhan komitmen pasca izin.',
    accent: 'bg-slate-800',
  },
];

export default function Advantages() {
  return (
    <section id="keunggulan" className="bg-cloud py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Kenapa Harus Sobat Izin?</h2>
          <p className="section-subtitle">
            Kami menggabungkan kecepatan layanan digital dengan keahlian legal agar proses perizinan
            bisnis Anda selalu terkendali.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {advantages.map((advantage) => (
            <AdvantageCard key={advantage.title} {...advantage} />
          ))}
        </div>
      </div>
    </section>
  );
}
