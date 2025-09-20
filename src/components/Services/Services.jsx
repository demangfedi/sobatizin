import ServiceCard from './ServiceCard.jsx';

const services = [
  {
    title: 'Pendirian Badan Usaha',
    description:
      'CV, PT, Yayasan, Perkumpulan, hingga Koperasi dengan pendampingan dokumen lengkap.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path
          d="M4 19.5V5.4c0-.84.682-1.522 1.523-1.522h4.954c.841 0 1.523.682 1.523 1.523v14.1"
          strokeLinecap="round"
        />
        <path d="M6.5 9.5h3" strokeLinecap="round" />
        <path d="M19.5 19.5H4" strokeLinecap="round" />
        <path d="M14 11h4v8.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Perizinan Khusus',
    description: 'Perizinan sektor, OSS RBA, NIB, hingga Izin Operasional terintegrasi.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 12h14" strokeLinecap="round" />
        <path d="M12 5v14" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    title: 'Sertifikasi Usaha',
    description: 'Pengurusan SBU, SKK, BPOM, SNI, dan ISO dengan update progres berkala.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 7h10v10H7z" />
        <path d="M9.5 3h5" strokeLinecap="round" />
        <path d="M12 10v4" strokeLinecap="round" />
        <path d="M10 12h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Layanan Konsultasi',
    description: 'Assessment kepatuhan usaha, audit dokumen, dan perencanaan perizinan jangka panjang.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 20s-6-3.5-6-9a6 6 0 1 1 12 0c0 5.5-6 9-6 9Z" strokeLinecap="round" />
        <circle cx="12" cy="11" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Pelatihan & Workshop',
    description: 'Pembekalan tim internal mengenai OSS, pelaporan berkala, dan pemutakhiran izin.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 7h14" strokeLinecap="round" />
        <path d="M5 12h14" strokeLinecap="round" />
        <path d="M5 17h8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Pendampingan Pasca Izin',
    description: 'Bantuan update komitmen, pelaporan LKPM, dan pembaruan izin tahunan.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 12.5 9 17l11-11" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="layanan" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Layanan Unggulan Sobat Izin</h2>
          <p className="section-subtitle">
            Pilihan layanan lengkap untuk kebutuhan pendirian usaha, sertifikasi, hingga perizinan
            khusus yang menyesuaikan sektor bisnis Anda.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
