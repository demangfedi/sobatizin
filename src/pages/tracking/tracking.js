import { fetchTracking } from '../../api.js';

function renderHistory(history = []) {
  if (!history.length) {
    return '<p class="tracking__empty">Belum ada riwayat.</p>';
  }

  const items = history
    .map((item) => {
      if (typeof item === 'string') {
        return `<li class="tracking__history-item">${item}</li>`;
      }

      const { status, date, note } = item;
      const parts = [status, date, note].filter(Boolean).join(' • ');
      return `<li class="tracking__history-item">${parts}</li>`;
    })
    .join('');

  return `<ol class="tracking__history">${items}</ol>`;
}

function renderAttachments(attachments = []) {
  if (!attachments.length) {
    return '';
  }

  const items = attachments
    .map((file, index) => {
      if (typeof file === 'string') {
        return `<li class="tracking__attachment-item"><a href="${file}" target="_blank" rel="noopener noreferrer">Lampiran ${index + 1}</a></li>`;
      }

      const { name = `Lampiran ${index + 1}`, url = '#' } = file || {};
      return `<li class="tracking__attachment-item"><a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a></li>`;
    })
    .join('');

  return `
    <section class="tracking__attachments">
      <h3 class="tracking__section-title">Berkas Terkait</h3>
      <ul class="tracking__attachment-list">${items}</ul>
    </section>
  `;
}

export class TrackingPage {
  constructor(root, options = {}) {
    this.root = root;
    this.options = options;
    this.state = {
      loading: false,
      error: null,
      data: null
    };
    this.initialReference = options.initialReference || '';
    this.hasPrefetched = false;
  }

  setState(patch) {
    this.state = { ...this.state, ...patch };
    this.render();
  }

  async performLookup(reference) {
    const normalized = String(reference || '').trim();
    if (!normalized) {
      this.setState({ loading: false, error: 'Nomor referensi diperlukan.' });
      return;
    }

    this.initialReference = normalized;

    this.setState({ loading: true, error: null });

    try {
      const data = await fetchTracking(normalized, this.options.apiOptions || {});
      this.setState({ loading: false, data });
    } catch (error) {
      this.setState({ loading: false, error: error.message || 'Terjadi kesalahan.' });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const input = form.querySelector('input[name="reference"]');
    const reference = input ? input.value : '';

    await this.performLookup(reference);
  }

  renderContent() {
    const { loading, error, data } = this.state;

    if (loading) {
      return '<p class="tracking__loading">Mengambil data...</p>';
    }

    if (error) {
      return `<p class="tracking__error" role="alert">${error}</p>`;
    }

    if (!data) {
      return '<p class="tracking__hint">Masukkan kode tracking untuk melihat status order Anda.</p>';
    }

    const { reference, status, history = [], attachments = [] } = data;

    return `
      <section class="tracking__result" aria-live="polite">
        <h2 class="tracking__status">Status: ${status || 'Tidak tersedia'}</h2>
        <p class="tracking__reference">Kode Tracking: <strong>${reference}</strong></p>
        <section class="tracking__history-wrapper">
          <h3 class="tracking__section-title">Riwayat</h3>
          ${renderHistory(history)}
        </section>
        ${renderAttachments(attachments)}
      </section>
    `;
  }

  render() {
    if (!this.root) {
      return;
    }

    this.root.innerHTML = `
      <section class="tracking">
        <form class="tracking__form">
          <label class="tracking__label" for="tracking-reference">Nomor Order / Kode Tracking</label>
          <div class="tracking__input-group">
            <input
              id="tracking-reference"
              name="reference"
              class="tracking__input"
              placeholder="Contoh: ABC123"
              required
            />
            <button class="tracking__button" type="submit">Lacak</button>
          </div>
        </form>
        <div class="tracking__body">${this.renderContent()}</div>
      </section>
    `;

    const form = this.root.querySelector('.tracking__form');
    if (form) {
      form.addEventListener('submit', (event) => this.handleSubmit(event));
      const input = form.querySelector('input[name="reference"]');
      if (input && this.initialReference && !this.hasPrefetched) {
        input.value = this.initialReference;
        const shouldAutoFetch = this.options.autoFetch !== false;
        if (shouldAutoFetch) {
          this.hasPrefetched = true;
          this.performLookup(this.initialReference);
        }
      }
    }
  }
}

export default TrackingPage;
