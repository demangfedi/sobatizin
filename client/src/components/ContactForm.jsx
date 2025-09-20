import { useState } from 'react';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: ''
};

function ContactForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formStatus, setFormStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
    setFieldErrors((previous) => ({
      ...previous,
      [name]: undefined,
      form: undefined
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setFieldErrors({});
    setFormStatus({ type: 'idle', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const nextErrors = {};
        if (Array.isArray(payload.errors)) {
          for (const error of payload.errors) {
            if (error?.field) {
              nextErrors[error.field] = error.message;
            } else {
              nextErrors.form = error?.message ?? 'Something went wrong. Please try again.';
            }
          }
        }

        setFieldErrors(nextErrors);
        setFormStatus({
          type: 'error',
          message: payload.message ?? 'We could not submit your request. Please check the highlighted fields.'
        });
        return;
      }

      setFormData(initialFormState);
      setFormStatus({
        type: 'success',
        message: payload.message ?? 'Thank you for reaching out! Our team will contact you soon.'
      });
    } catch (error) {
      console.error('Unable to submit contact form', error);
      setFormStatus({
        type: 'error',
        message: 'We are unable to submit your request right now. Please try again shortly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={updateField}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? 'name-error' : undefined}
        />
        {fieldErrors.name ? (
          <p id="name-error" role="alert">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={updateField}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
        />
        {fieldErrors.email ? (
          <p id="email-error" role="alert">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={updateField}
          aria-invalid={Boolean(fieldErrors.phone)}
          aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
        />
        {fieldErrors.phone ? (
          <p id="phone-error" role="alert">
            {fieldErrors.phone}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="service">Service</label>
        <input
          id="service"
          name="service"
          type="text"
          value={formData.service}
          onChange={updateField}
          aria-invalid={Boolean(fieldErrors.service)}
          aria-describedby={fieldErrors.service ? 'service-error' : undefined}
        />
        {fieldErrors.service ? (
          <p id="service-error" role="alert">
            {fieldErrors.service}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={updateField}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? 'message-error' : undefined}
        />
        {fieldErrors.message ? (
          <p id="message-error" role="alert">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      {fieldErrors.form ? (
        <p role="alert">{fieldErrors.form}</p>
      ) : null}

      {formStatus.type !== 'idle' ? (
        <p role={formStatus.type === 'error' ? 'alert' : undefined}>
          {formStatus.message}
        </p>
      ) : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}

export default ContactForm;
