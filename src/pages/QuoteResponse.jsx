import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { simulationEnabled, simulationRequest } from '../lib/simulation-api.js';

export default function QuoteResponse() {
  const { token } = useParams();
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!simulationEnabled) return undefined;
    const controller = new AbortController();
    simulationRequest(`/api/public/quotes/${encodeURIComponent(token)}`, { signal: controller.signal })
      .then(setQuote)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      });
    return () => controller.abort();
  }, [token]);

  async function respond(answer) {
    setBusy(true);
    setMessage('');
    try {
      const result = await simulationRequest(`/api/public/quotes/${encodeURIComponent(token)}`, {
        method: 'POST',
        body: { answer },
      });
      setQuote((current) => ({ ...current, status: result.status }));
      setMessage(`${result.message} No email or payment was sent.`);
    } catch (requestError) {
      setMessage(`Response not recorded: ${requestError.message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Seo title="Quotation Response" description="Review a Jovexa Labs project quotation simulation." path="/quote" />
      <section className="section section--narrow quote-response">
        <p className="eyebrow">Jovexa Labs Digital Solutions</p>
        <h1>Project quotation</h1>
        {!simulationEnabled && (
          <div className="card">
            <p>This response link works only in the local quotation simulation. No public quotation service is available.</p>
            <Link to="/website-development">Return to project inquiry</Link>
          </div>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        {quote && (
          <article className="card quote-response__card">
            <p>Prepared for {quote.customerName}{quote.business ? ` · ${quote.business}` : ''}</p>
            <p className="pricing-card__price">${quote.amountUsd.toLocaleString('en-US')} <span>USD</span></p>
            <p className="quote-response__scope">{quote.summary}</p>
            <p>Quotation status: <strong>{quote.status}</strong></p>
            <p>Valid until {new Date(quote.expiresAt).toLocaleDateString()}.</p>
            <p className="form-notice">Local simulation only. This is not a contract, invoice, or payment request. No email was delivered and no payment can be made here.</p>
            {quote.expired && <p role="alert">This quotation has expired.</p>}
            {!quote.expired && ['Quotation sent', 'Awaiting customer'].includes(quote.status) && (
              <div className="hero__actions">
                <button type="button" className="btn btn--primary" disabled={busy} onClick={() => respond('accept')}>
                  Accept quotation (simulate)
                </button>
                <button type="button" className="btn btn--secondary" disabled={busy} onClick={() => respond('changes')}>
                  Request changes (simulate)
                </button>
              </div>
            )}
          </article>
        )}
        {message && <p className="quote-form__status" role="status">{message}</p>}
      </section>
    </>
  );
}
