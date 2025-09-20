import { site } from '../config/site.js';

export default function Hero() {
  return (
    <section id="hero" className="bg-gradient-to-b from-white via-cloud to-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 text-center md:flex-row md:items-start md:gap-14 md:py-24 md:text-left">
        <div className="w-full md:w-3/5">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-4 py-1 text-sm font-medium text-brand-700">
            Solusi Perizinan Bisnis
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-night md:text-5xl">
            Urus Perizinan Usaha Jadi Mudah.
          </h1>
          <p className="mt-6 text-lg text-slate-600 md:text-xl">
            Tim ahli Sobat Izin mendampingi pengurusan OSS RBA, penerbitan NIB, hingga Sertifikat
            Standar agar bisnis Anda melaju tanpa hambatan.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href={site.whatsappLink}
              className="btn-primary w-full justify-center sm:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              Konsultasi Gratis via WhatsApp
            </a>
            <a href="#kontak" className="btn-secondary w-full justify-center sm:w-auto">
              Kirim Pertanyaan
            </a>
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-6 text-left sm:grid-cols-3">
            <div className="rounded-2xl bg-white/80 p-4 shadow-soft">
              <dt className="text-sm font-medium text-slate-500">Bisnis Dibantu</dt>
              <dd className="mt-2 text-2xl font-semibold text-night">500+</dd>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 shadow-soft">
              <dt className="text-sm font-medium text-slate-500">Rata-rata Penyelesaian</dt>
              <dd className="mt-2 text-2xl font-semibold text-night">7 Hari</dd>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 shadow-soft sm:col-span-1">
              <dt className="text-sm font-medium text-slate-500">Kepuasan Klien</dt>
              <dd className="mt-2 text-2xl font-semibold text-night">4.9/5</dd>
            </div>
          </dl>
        </div>
        <div className="relative w-full md:w-2/5">
          <div className="relative mx-auto max-w-md rounded-3xl bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Progress OSS RBA</p>
                <p className="mt-2 text-2xl font-semibold text-night">Sedang Diproses</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path
                    d="M12 6v6l3 3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-start gap-4">
                  <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                    {step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-night">
                      {step === 1 && 'Analisis Kebutuhan & Checklist Dokumen'}
                      {step === 2 && 'Submit OSS RBA & Koordinasi Instansi'}
                      {step === 3 && 'Terbit NIB / Sertifikat Standar'}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {step === 1 && 'Tim Sobat Izin mengulas profil usaha untuk menentukan izin yang dibutuhkan.'}
                      {step === 2 && 'Pengajuan daring dipantau dengan update berkala ke pemilik usaha.'}
                      {step === 3 && 'Dokumen resmi dikirimkan beserta panduan kelanjutan kewajiban usaha.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-8 -left-6 hidden h-24 w-24 rounded-3xl bg-brand-200 blur-3xl md:block" aria-hidden="true" />
          <div className="absolute -top-8 -right-6 hidden h-28 w-28 rounded-full bg-brand-300 blur-3xl md:block" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
