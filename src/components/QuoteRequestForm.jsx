import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { simulationEnabled, simulationRequest } from '../lib/simulation-api.js';
import { useServiceCatalog } from '../lib/useServiceCatalog.js';

const EMAIL = 'admin@jovexalabs.com';

export default function QuoteRequestForm() {
  const [searchParams] = useSearchParams();
  const { packages, templates, error: catalogError } = useServiceCatalog();
  const [packageId, setPackageId] = useState(searchParams.get('package') || '');
  const [templateSlug, setTemplateSlug] = useState(searchParams.get('template') || '');
  const [status, setStatus] = useState('');
  const [emailDraft, setEmailDraft] = useState('');

  async function prepareEmail(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const chosenPackage = packages.find((item) => item.id === formData.get('package'));
    const chosenTemplate = templates.find((item) => item.slug === formData.get('template'));
    const fields = [
      ['Name', formData.get('name')],
      ['Business name', formData.get('business')],
      ['Email', formData.get('email')],
      ['Country', formData.get('country')],
      ['Project category', formData.get('category')],
      ['Package', chosenPackage?.name || 'Not selected'],
      ['Template', chosenTemplate?.name || 'Not selected'],
      ['Budget', formData.get('budget')],
      ['Timeframe', formData.get('timeframe')],
      ['Desired features', formData.get('features')],
      ['Reference links', formData.get('references')],
      ['Project description', formData.get('description')],
    ];
    const body = fields.map(([label, value]) => `${label}: ${value || 'Not provided'}`).join('\n\n');
    const subject = `Website project inquiry - ${formData.get('name')}`;
    if (simulationEnabled) {
      setStatus('Submitting to the local simulation...');
      try {
        const search = new URLSearchParams(window.location.search);
        const campaign = Object.fromEntries(
          ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
            .filter((key) => search.has(key))
            .map((key) => [key, search.get(key)]),
        );
        const result = await simulationRequest('/api/quotes', {
          method: 'POST',
          body: {
            name: formData.get('name'),
            business: formData.get('business'),
            email: formData.get('email'),
            country: formData.get('country'),
            category: formData.get('category'),
            packageId: formData.get('package'),
            templateSlug: formData.get('template'),
            features: formData.get('features'),
            budget: formData.get('budget'),
            timeframe: formData.get('timeframe'),
            description: formData.get('description'),
            references: formData.get('references'),
            consent: formData.get('consent') === 'on',
            website: formData.get('website'),
            campaign,
          },
        });
        setStatus(`${result.message} Reference: ${result.reference}`);
      } catch (error) {
        setStatus(`Inquiry was not recorded: ${error.message}`);
      }
      return;
    }
    setEmailDraft(`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setStatus('Your email draft is ready. Nothing has been sent; your inquiry is received only if you open and send the draft.');
  }

  return (
    <form className="quote-form" onSubmit={prepareEmail}>
      <p className="form-notice">
        {simulationEnabled
          ? 'Local simulation: submissions are saved only in the local simulation data file. This is not a production service. No email, external analytics, or payment is sent.'
          : 'This static website prepares an email draft on your device. It does not send, store, or track your answers. Your inquiry reaches us only if you send the draft from your email app.'}
      </p>
      {catalogError && <p className="form-error" role="alert">Could not load current package options: {catalogError}</p>}
      <div className="quote-form__grid">
        <label>
          Your name <span aria-hidden="true">*</span>
          <input name="name" autoComplete="name" maxLength="100" required />
        </label>
        <label>
          Business name
          <input name="business" autoComplete="organization" maxLength="120" />
        </label>
        <label>
          Email address <span aria-hidden="true">*</span>
          <input name="email" type="email" autoComplete="email" maxLength="254" required />
        </label>
        <label>
          Country <span aria-hidden="true">*</span>
          <input name="country" autoComplete="country-name" maxLength="80" required />
        </label>
        <label>
          Project category <span aria-hidden="true">*</span>
          <select name="category" defaultValue="Business website" required>
            <option>Business website</option>
            <option>E-commerce website</option>
            <option>Web application or platform</option>
            <option>Other software project</option>
          </select>
        </label>
        <label>
          Package
          <select
            name="package"
            value={packageId}
            onChange={(event) => setPackageId(event.target.value)}
          >
            <option value="">Not sure yet</option>
            {packages.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </label>
        <label>
          Template
          <select
            name="template"
            value={templateSlug}
            onChange={(event) => {
              const nextSlug = event.target.value;
              setTemplateSlug(nextSlug);
              const nextTemplate = templates.find((template) => template.slug === nextSlug);
              if (nextTemplate) setPackageId(nextTemplate.packageId);
            }}
          >
            <option value="">No template selected</option>
            {templates.map((template) => (
              <option key={template.slug} value={template.slug}>{template.name}</option>
            ))}
          </select>
        </label>
        <label>
          Estimated budget
          <select name="budget" defaultValue="">
            <option value="">Choose if known</option>
            <option>Under $500 USD</option>
            <option>$500–$1,500 USD</option>
            <option>$1,500–$5,000 USD</option>
            <option>Over $5,000 USD</option>
            <option>Need guidance</option>
          </select>
        </label>
        <label>
          Preferred timeframe
          <select name="timeframe" defaultValue="">
            <option value="">Choose if known</option>
            <option>As soon as practical</option>
            <option>Within 1 month</option>
            <option>Within 2–3 months</option>
            <option>Flexible</option>
          </select>
        </label>
      </div>
      <label>
        Desired features
        <textarea name="features" rows="3" maxLength="2000" placeholder="For example: booking requests, product catalog, or customer portal" />
      </label>
      <label>
        Project description <span aria-hidden="true">*</span>
        <textarea name="description" rows="5" maxLength="5000" required />
      </label>
      <label>
        Reference website links (optional)
        <textarea name="references" rows="2" maxLength="1000" placeholder="Paste public URLs only. We do not visit these links automatically." />
      </label>
      <label className="quote-form__consent">
        <input type="checkbox" name="consent" required />
        <span>
          I have read the <Link to="/privacy">Privacy Policy</Link> and agree to contact Jovexa
          Labs about this project. <span aria-hidden="true">*</span>
        </span>
      </label>
      <div className="quote-form__honeypot" aria-hidden="true">
        <label>
          Leave this field blank
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button className="btn btn--primary" type="submit" disabled={Boolean(catalogError)}>
        {simulationEnabled ? 'Submit simulation inquiry' : 'Prepare email inquiry'}
      </button>
      <p className="quote-form__required">* Required fields. Do not include passwords, payment details, or sensitive personal information.</p>
      <p className="quote-form__status" role="status" aria-live="polite">{status}</p>
      {emailDraft && (
        <a className="btn btn--secondary quote-form__draft-link" href={emailDraft}>
          Open draft in your email app
        </a>
      )}
    </form>
  );
}
