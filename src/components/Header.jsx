import { useState } from 'react';
import { site } from '../config/site.js';

const navItems = [
  { id: 'layanan', label: 'Layanan' },
  { id: 'keunggulan', label: 'Keunggulan' },
  { id: 'harga', label: 'Harga' },
  { id: 'faq', label: 'FAQ' },
  { id: 'kontak', label: 'Kontak' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <a href="#hero" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-lg font-semibold text-white shadow-soft">
            SI
          </span>
          <span className="text-lg font-semibold text-night">{site.siteName}</span>
        </a>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-600 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 md:hidden"
          aria-label="Buka navigasi"
          onClick={toggleMenu}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600 focus-visible:text-brand-600"
            >
              {item.label}
            </a>
          ))}
          <a href={site.whatsappLink} className="btn-primary hidden md:inline-flex" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </div>
      </nav>
      {menuOpen ? (
        <div className="md:hidden">
          <div className="space-y-1 border-t border-slate-100 bg-white px-4 pb-6 pt-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
            <a
              href={site.whatsappLink}
              className="btn-primary w-full justify-center"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
