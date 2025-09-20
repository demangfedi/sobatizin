import { site } from '../config/site.js';

export default function FloatingWhatsAppButton() {
  return (
    <a
      href={site.whatsappLink}
      className="fixed bottom-6 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buka WhatsApp Sobat Izin"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path
          d="M20.5 12a8.5 8.5 0 0 1-13 7.06L4 20l.94-3.5A8.5 8.5 0 1 1 20.5 12Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.75 9.5h1.5a1.25 1.25 0 0 1 0 2.5h-.75a1.25 1.25 0 1 0 0 2.5h1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      WhatsApp
    </a>
  );
}
