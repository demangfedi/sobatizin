import ContactForm from './ContactForm.jsx';
import { site } from '../../config/site.js';

export default function Contact() {
  return (
    <section id="kontak" className="bg-cloud py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-[1fr,1.1fr]">
          <div>
            <h2 className="section-title">Hubungi Konsultan Kami</h2>
            <p className="section-subtitle">
              Isi formulir berikut atau hubungi langsung tim Sobat Izin untuk diskusi kebutuhan
              perizinan Anda.
            </p>
            <div className="mt-8 space-y-4 text-sm text-slate-600">
              <p>
                <strong className="font-semibold text-night">Nomor WhatsApp:</strong>{' '}
                <a href={site.whatsappLink} className="underline" target="_blank" rel="noopener noreferrer">
                  {site.whatsappNumber}
                </a>
              </p>
              <p>
                <strong className="font-semibold text-night">Jam Operasional:</strong> Senin - Jumat,
                09.00 - 18.00 WIB
              </p>
              <p>
                <strong className="font-semibold text-night">Alamat:</strong> Jakarta, Indonesia (layanan
                seluruh Indonesia)
              </p>
            </div>
          </div>
          <div className="card-surface">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
