import { useState } from 'react';
import FaqItem from './FaqItem.jsx';

const faqItems = [
  {
    id: 'durasi-proses',
    question: 'Berapa lama proses perizinan selesai?',
    answer:
      'Durasi tergantung jenis izin dan kelengkapan dokumen. Rata-rata penyelesaian OSS RBA/NIB 5-10 hari kerja setelah dokumen lengkap.',
  },
  {
    id: 'dokumen',
    question: 'Dokumen apa saja yang perlu disiapkan?',
    answer:
      'Kami akan memberikan checklist spesifik sesuai jenis usaha. Umumnya meliputi data pemilik, akta pendirian, NPWP, dan dokumen pendukung lainnya.',
  },
  {
    id: 'biaya',
    question: 'Bagaimana rincian biaya resmi dan jasa?',
    answer:
      'Tim kami akan menjelaskan estimasi biaya resmi pemerintah dan jasa konsultasi sebelum pekerjaan dimulai, sehingga Anda bisa menyiapkan anggaran dengan jelas.',
  },
  {
    id: 'pendampingan',
    question: 'Apakah ada pendampingan setelah izin terbit?',
    answer:
      'Ya. Kami membantu pemenuhan komitmen, pelaporan LKPM, dan pembaruan izin berkala agar bisnis tetap patuh.',
  },
];

export default function Faq() {
  const [openId, setOpenId] = useState(faqItems[0].id);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center">
          <h2 className="section-title">Pertanyaan yang Sering Diajukan</h2>
          <p className="section-subtitle">
            Temukan jawaban cepat terkait layanan Sobat Izin. Masih bingung? Hubungi kami untuk
            konsultasi gratis.
          </p>
        </div>
        <div className="mt-10 space-y-4">
          {faqItems.map((item) => (
            <FaqItem key={item.id} {...item} isOpen={openId === item.id} onToggle={handleToggle} />
          ))}
        </div>
      </div>
    </section>
  );
}
