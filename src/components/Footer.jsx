import { site } from '../config/site.js';

export default function Footer() {
  return (
    <footer className="bg-night py-10 text-cloud">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold">{site.siteName}</p>
          <p className="mt-2 text-sm text-slate-300">
            Konsultan perizinan usaha Indonesia. Kami siap membantu Anda dari awal hingga izin terbit.
          </p>
        </div>
        <div className="space-y-2 text-sm text-slate-300">
          <a href="#layanan" className="block hover:text-brand-200">
            Layanan
          </a>
          <a href="#harga" className="block hover:text-brand-200">
            Harga
          </a>
          <a href="#kontak" className="block hover:text-brand-200">
            Hubungi Kami
          </a>
          <a href="#" className="block hover:text-brand-200">
            Kebijakan Privasi (segera hadir)
          </a>
        </div>
      </div>
      <div className="mt-8 border-t border-slate-700 pt-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} {site.siteName}. Semua hak dilindungi.
      </div>
    </footer>
  );
}
