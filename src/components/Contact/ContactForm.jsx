import { useMemo, useRef, useState } from 'react';
import { site } from '../../config/site.js';

const initialValues = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
  honeypot: '',
};

const serviceOptions = [
  { value: '', label: 'Pilih jenis layanan' },
  { value: 'pendirian-badan-usaha', label: 'Pendirian Badan Usaha' },
  { value: 'sertifikasi-usaha', label: 'Sertifikasi (SBU/SKK/BPOM/SNI/ISO)' },
  { value: 'perizinan-khusus', label: 'Perizinan Khusus / OSS RBA / NIB' },
  { value: 'pendampingan', label: 'Pendampingan Pasca Izin & LKPM' },
  { value: 'lainnya', label: 'Kebutuhan Lainnya' },
];

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

export default function ContactForm() {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const cooldownTimer = useRef(null);

  const hasExternalIntegration = useMemo(() => {
    return Boolean(import.meta.env.VITE_FORMSPREE_ID || import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const resetCooldown = () => {
    if (cooldownTimer.current) {
      clearTimeout(cooldownTimer.current);
    }
    cooldownTimer.current = setTimeout(() => {
      setCooldown(false);
    }, 3000);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi.';
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = 'Isi email atau nomor WhatsApp.';
      newErrors.phone = 'Isi email atau nomor WhatsApp.';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid.';
    }
    if (formData.message.trim().length < 10) {
      newErrors.message = 'Pesan minimal 10 karakter.';
    }
    if (!formData.service) {
      newErrors.service = 'Pilih jenis layanan yang dibutuhkan.';
    }
    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (formData.honeypot) {
      return;
    }

    if (cooldown) {
      setStatus({ type: 'error', message: 'Tunggu beberapa detik sebelum mengirim ulang.' });
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
        timestamp: new Date().toISOString(),
      };

      const formspreeId = import.meta.env.VITE_FORMSPREE_ID;
      const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

      if (formspreeId) {
        const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Gagal mengirim ke Formspree.');
        }
      } else if (emailJsPublicKey && emailJsServiceId && emailJsTemplateId) {
        const response = await fetch(EMAILJS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: emailJsServiceId,
            template_id: emailJsTemplateId,
            user_id: emailJsPublicKey,
            template_params: payload,
          }),
        });

        if (!response.ok) {
          throw new Error('Gagal mengirim melalui EmailJS.');
        }
      } else {
        window.alert('Terima kasih! Tim Sobat Izin akan segera menghubungi Anda.');
      }

      setStatus({
        type: 'success',
        message:
          'Form berhasil dikirim. Tim Sobat Izin akan menghubungi Anda. Untuk respon cepat, lanjutkan chat via WhatsApp.',
      });
      setFormData(initialValues);
      setCooldown(true);
      resetCooldown();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Terjadi kendala saat mengirim pesan. Silakan coba lagi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name">Nama Lengkap *</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Nama Anda"
            value={formData.name}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'error-name' : undefined}
          />
          {errors.name ? (
            <p id="error-name" className="mt-2 text-sm text-red-600">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="email@perusahaan.com"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'error-email' : undefined}
          />
          {errors.email ? (
            <p id="error-email" className="mt-2 text-sm text-red-600">
              {errors.email}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="phone">Nomor WhatsApp</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Contoh: 0812xxxx"
            value={formData.phone}
            onChange={handleChange}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'error-phone' : undefined}
          />
          {errors.phone ? (
            <p id="error-phone" className="mt-2 text-sm text-red-600">
              {errors.phone}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="service">Jenis Layanan *</label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? 'error-service' : undefined}
          >
            {serviceOptions.map((option) => (
              <option key={option.value || 'placeholder'} value={option.value} disabled={option.value === ''}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.service ? (
            <p id="error-service" className="mt-2 text-sm text-red-600">
              {errors.service}
            </p>
          ) : null}
        </div>
      </div>
      <div>
        <label htmlFor="message">Pesan *</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          placeholder="Ceritakan kebutuhan perizinan Anda..."
          value={formData.message}
          onChange={handleChange}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'error-message' : undefined}
        />
        {errors.message ? (
          <p id="error-message" className="mt-2 text-sm text-red-600">
            {errors.message}
          </p>
        ) : null}
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Perusahaan</label>
        <input
          id="company"
          name="honeypot"
          type="text"
          tabIndex="-1"
          autoComplete="off"
          value={formData.honeypot}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          type="submit"
          className="btn-primary w-full justify-center sm:w-auto"
          disabled={isSubmitting || cooldown}
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim'}
        </button>
        <a
          className="btn-secondary w-full justify-center sm:w-auto"
          href={site.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Chat via WhatsApp
        </a>
      </div>
      {status ? (
        <p
          className={`text-sm ${status.type === 'success' ? 'text-brand-700' : 'text-red-600'}`}
          role={status.type === 'error' ? 'alert' : 'status'}
        >
          {status.message}{' '}
          {status.type === 'success' ? (
            <a className="underline" href={site.whatsappLink} target="_blank" rel="noopener noreferrer">
              Buka WhatsApp
            </a>
          ) : null}
        </p>
      ) : null}
      {!hasExternalIntegration ? (
        <p className="small-muted">
          Integrasi Formspree atau EmailJS belum diaktifkan. Tambahkan kredensial pada file <code>.env</code>.
        </p>
      ) : null}
    </form>
  );
}
