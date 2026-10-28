import { useCallback, useEffect, useState } from 'react';
import Seo from '../components/Seo.jsx';
import { simulationEnabled, simulationRequest } from '../lib/simulation-api.js';

const TABS = ['Overview', 'Inquiries', 'Packages', 'Templates', 'Projects & invoices', 'Portfolio', 'Notifications', 'Audit log'];
function useAdminState(authenticated) {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState('');
  const fetchAdminState = useCallback(() => Promise.all([
    simulationRequest('/api/admin/state'),
    simulationRequest('/api/admin/analytics'),
    simulationRequest('/api/admin/notifications'),
  ]), []);
  const applyAdminState = useCallback(([nextData, nextAnalytics, nextNotification]) => {
      setData(nextData);
      setAnalytics(nextAnalytics);
      setNotification(nextNotification);
      setError('');
  }, []);
  const reload = useCallback(async () => {
    if (!authenticated) return;
    try {
      applyAdminState(await fetchAdminState());
    } catch (requestError) {
      setError(requestError.message);
    }
  }, [authenticated, applyAdminState, fetchAdminState]);
  useEffect(() => {
    if (!authenticated) return undefined;
    let active = true;
    fetchAdminState()
      .then((result) => {
        if (active) applyAdminState(result);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => { active = false; };
  }, [authenticated, applyAdminState, fetchAdminState]);
  return { data, analytics, notification, error, reload, setError };
}

export default function Admin() {
  const [auth, setAuth] = useState(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [tab, setTab] = useState('Overview');
  const [csrfToken, setCsrfToken] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);
  const { data, analytics, notification, error, reload, setError } =
    useAdminState(auth?.authenticated === true);

  useEffect(() => {
    if (!simulationEnabled) return undefined;
    const controller = new AbortController();
    simulationRequest('/api/auth/me', { signal: controller.signal })
      .then((result) => {
        setSetupComplete(!result.setupRequired);
        if (result.authenticated) {
          setAuth({ authenticated: true, email: result.email });
          setCsrfToken(result.csrfToken);
        }
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setAuthMessage(requestError.message);
      });
    return () => controller.abort();
  }, []);

  async function submitSetup(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setAuthBusy(true);
    setAuthMessage('');
    try {
      await simulationRequest('/api/setup', {
        method: 'POST',
        body: {
          setupToken: formData.get('setupToken'),
          email: formData.get('email'),
          password: formData.get('password'),
        },
      });
      setSetupComplete(true);
      setAuthMessage('Administrator created. Sign in with the email and password you chose.');
      form.reset();
    } catch (requestError) {
      setAuthMessage(requestError.message);
    } finally {
      setAuthBusy(false);
    }
  }

  async function submitLogin(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setAuthBusy(true);
    setAuthMessage('');
    try {
      const result = await simulationRequest('/api/auth/login', {
        method: 'POST',
        body: { email: formData.get('email'), password: formData.get('password') },
      });
      setAuth({ authenticated: true, email: result.email });
      setCsrfToken(result.csrfToken);
      form.reset();
    } catch (requestError) {
      setAuthMessage(requestError.message);
    } finally {
      setAuthBusy(false);
    }
  }

  async function mutate(path, method, body, successMessage) {
    setError('');
    setAuthMessage('');
    try {
      await simulationRequest(path, { method, body, csrfToken });
      if (successMessage) setAuthMessage(successMessage);
      await reload();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function logout() {
    try {
      await simulationRequest('/api/auth/logout', { method: 'POST', body: {}, csrfToken });
      setAuth(null);
      setCsrfToken('');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <Seo title="Local Administration Simulation" description="Local-only Jovexa Labs services simulation workspace." path="/admin" />
      <section className="section admin-shell">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">Private local simulator</p>
            <h1>Services workspace</h1>
          </div>
          {auth?.authenticated && (
            <div className="admin-user">
              <span>{auth.email}</span>
              <button type="button" className="btn btn--secondary" onClick={logout}>Sign out</button>
            </div>
          )}
        </div>
        {!simulationEnabled ? (
          <div className="card">
            <h2>Simulation is disabled</h2>
            <p>This static website does not expose an administrator API. Start the repository with <code>npm run simulate</code> to use this local-only workspace.</p>
          </div>
        ) : !auth?.authenticated ? (
          <div className="card admin-auth-card">
            <p className="form-notice">
              This localhost-only simulator stores test inquiries in a local JSON file. Do not
              enter real customer information. It is not a production admin service.
            </p>
            {!setupComplete ? (
              <>
                <h2>Set up the local admin</h2>
                <p>Use the one-time setup token printed in the simulation server terminal. Choose a unique password with at least 14 characters.</p>
                <form className="quote-form" onSubmit={submitSetup}>
                  <label>One-time setup token<input name="setupToken" autoComplete="off" required /></label>
                  <label>Administrator email<input name="email" type="email" autoComplete="email" required /></label>
                  <label>Password<input name="password" type="password" minLength="14" maxLength="256" autoComplete="new-password" required /></label>
                  <button className="btn btn--primary" type="submit" disabled={authBusy}>Create local administrator</button>
                </form>
              </>
            ) : (
              <>
                <h2>Administrator sign in</h2>
                <form className="quote-form" onSubmit={submitLogin}>
                  <label>Email<input name="email" type="email" autoComplete="username" required /></label>
                  <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
                  <button className="btn btn--primary" type="submit" disabled={authBusy}>Sign in</button>
                </form>
              </>
            )}
            {authMessage && <p className="quote-form__status" role="status">{authMessage}</p>}
          </div>
        ) : (
          <>
            <p className="form-notice">
              Local simulation mode: admin data stays in the local state file. Email delivery and
              external analytics are disabled. The payment controls create fictional sandbox ledger
              events only; no processor or card details are used.
            </p>
            <nav className="admin-tabs" aria-label="Administration sections">
              {TABS.map((item) => (
                <button key={item} type="button" aria-pressed={tab === item} onClick={() => setTab(item)}>{item}</button>
              ))}
            </nav>
            {error && <p className="form-error" role="alert">{error}</p>}
            {authMessage && <p className="quote-form__status" role="status">{authMessage}</p>}
            {data && tab === 'Overview' && (
              <Overview analytics={analytics} data={data} />
            )}
            {data && tab === 'Inquiries' && (
              <InquiryList data={data} mutate={mutate} />
            )}
            {data && tab === 'Packages' && (
              <PackageSettings data={data} mutate={mutate} />
            )}
            {data && tab === 'Templates' && (
              <TemplateSettings data={data} mutate={mutate} />
            )}
            {data && tab === 'Projects & invoices' && (
              <ProjectList data={data} mutate={mutate} />
            )}
            {data && tab === 'Portfolio' && (
              <PortfolioSettings data={data} mutate={mutate} />
            )}
            {data && tab === 'Notifications' && (
              <NotificationList notification={notification} />
            )}
            {data && tab === 'Audit log' && (
              <AuditList entries={data.auditLog} />
            )}
            {!data && <p role="status">Loading local administration records…</p>}
          </>
        )}
      </section>
    </>
  );
}

function Overview({ analytics, data }) {
  if (!analytics) return <p role="status">Loading local counts…</p>;
  return (
    <>
      <div className="admin-metrics">
        {[
          ['Inquiries', analytics.totalInquiries],
          ['New inquiries', analytics.newInquiries],
          ['Active projects', analytics.activeProjects],
          ['Quotations', analytics.quotations],
        ].map(([label, value]) => (
          <article className="card" key={label}><p>{label}</p><strong>{value}</strong></article>
        ))}
      </div>
      <p className="fine-print">{analytics.tracking}</p>
      <h2>Latest inquiries</h2>
      <div className="admin-list">
        {data.inquiries.slice(0, 5).map((item) => (
          <article className="card admin-record" key={item.id}>
            <div><h3>{item.name} · {item.category}</h3><p>{item.country} · {item.email}</p></div>
            <span className="badge">{item.status}</span>
          </article>
        ))}
        {!data.inquiries.length && <p>No simulation inquiries yet.</p>}
      </div>
    </>
  );
}

function InquiryList({ data, mutate }) {
  const allowedNext = {
    'New inquiry': ['Under review', 'Cancelled'],
    'Under review': ['Quotation sent', 'Cancelled'],
    'Quotation sent': ['Awaiting customer', 'Accepted', 'Under review', 'Cancelled'],
    'Awaiting customer': ['Accepted', 'Under review', 'Cancelled'],
    Accepted: ['In development', 'Cancelled'],
    'In development': ['Awaiting approval', 'Cancelled'],
    'Awaiting approval': ['Completed', 'In development', 'Cancelled'],
    Completed: [],
    Cancelled: [],
  };
  return (
    <div className="admin-list">
      {data.inquiries.map((item) => {
        const quote = data.quotations.find((entry) => entry.inquiryId === item.id);
        const project = data.projects.find((entry) => entry.inquiryId === item.id);
        return (
          <article className="card admin-record admin-inquiry" key={item.id}>
            <div className="admin-record__header">
              <div>
                <p className="eyebrow">{item.category} · {new Date(item.createdAt).toLocaleString()}</p>
                <h2>{item.name}{item.business ? ` · ${item.business}` : ''}</h2>
                <p><a href={`mailto:${encodeURIComponent(item.email)}`}>{item.email}</a> · {item.country}</p>
              </div>
              <label>Status
                <select
                  aria-label={`Status for ${item.name}`}
                  value={item.status}
                  onChange={(event) => mutate(`/api/admin/inquiries/${item.id}/status`, 'PATCH', { status: event.target.value }, 'Inquiry status updated.')}
                >
                  <option>{item.status}</option>
                  {(allowedNext[item.status] || []).map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
            </div>
            <p><strong>Package:</strong> {data.packages.find((entry) => entry.id === item.packageId)?.name || 'Not selected'}</p>
            <p><strong>Demo:</strong> {data.templates.find((entry) => entry.slug === item.templateSlug)?.name || 'Not selected'}</p>
            <p><strong>Budget / timing:</strong> {item.budget || 'Not provided'} · {item.timeframe || 'Flexible / not provided'}</p>
            <p><strong>Features:</strong> {item.features || 'Not provided'}</p>
            <p className="admin-inquiry__description">{item.description}</p>
            {item.references && <p><strong>Reference links (not fetched):</strong> {item.references}</p>}
            {!!Object.keys(item.campaign || {}).length && (
              <p><strong>Submitted campaign parameters:</strong> {Object.entries(item.campaign).map(([key, value]) => `${key}=${value}`).join(' · ')}</p>
            )}
            {(!quote || quote.status === 'Changes requested') && ['New inquiry', 'Under review'].includes(item.status) && (
              <QuotationComposer inquiry={item} mutate={mutate} />
            )}
            {quote && (
              <p>
                <strong>Quotation:</strong> ${quote.amountUsd} USD · {quote.status} ·{' '}
                <a href={`/quote/${quote.acceptToken}`} target="_blank" rel="noreferrer">Open customer response page</a>
                <span className="admin-inline-note"> (simulation link; no email sent)</span>
              </p>
            )}
            {project && <p><strong>Project record:</strong> {project.status}</p>}
          </article>
        );
      })}
      {!data.inquiries.length && <div className="card"><p>No inquiries recorded yet.</p></div>}
    </div>
  );
}

function QuotationComposer({ inquiry, mutate }) {
  return (
    <form
      className="admin-quote-form"
      onSubmit={(event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        mutate(
          `/api/admin/inquiries/${inquiry.id}/quotations`,
          'POST',
          { amountUsd: Number(values.get('amountUsd')), summary: values.get('summary'), expiryDays: Number(values.get('expiryDays')) },
          'Quotation prepared in local simulation. No email was sent.',
        );
      }}
    >
      <h3>Prepare a project quotation</h3>
      <label>Amount (USD)<input name="amountUsd" type="number" min="1" max="200000" step="1" defaultValue="399" required /></label>
      <label>Scope summary<textarea name="summary" maxLength="3000" rows="3" required defaultValue="Scope, deliverables, exclusions, timeline, and third-party costs to be confirmed in a signed project agreement." /></label>
      <label>Valid for (days)<input name="expiryDays" type="number" min="1" max="90" defaultValue="30" required /></label>
      <button className="btn btn--primary" type="submit">Prepare quotation (simulation)</button>
    </form>
  );
}

function PackageSettings({ data, mutate }) {
  return (
    <div className="admin-list">
      <p className="form-notice">Saving a price creates an audit entry and increments the configuration version. Changes affect only this local simulation; no production price is changed.</p>
      {data.packages.map((item) => (
        <form
          className="card admin-config-form"
          key={item.id}
          onSubmit={(event) => {
            event.preventDefault();
            const values = new FormData(event.currentTarget);
            mutate(`/api/admin/packages/${item.id}`, 'PUT', {
              expectedVersion: data.pricingVersion,
              priceUsd: Number(values.get('priceUsd')),
              summary: values.get('summary'),
            }, `${item.name} updated in local configuration.`);
          }}
        >
          <h2>{item.name}</h2>
          <label>Price (whole USD)<input name="priceUsd" type="number" min="1" max="200000" step="1" defaultValue={item.priceUsd} required /></label>
          <label>Summary<input name="summary" maxLength="300" defaultValue={item.summary} required /></label>
          <button className="btn btn--secondary" type="submit">Save local package</button>
        </form>
      ))}
      <article className="card">
        <form className="admin-config-form" onSubmit={(event) => {
          event.preventDefault();
          const values = new FormData(event.currentTarget);
          mutate('/api/admin/maintenance', 'PUT', {
            expectedVersion: data.pricingVersion,
            priceUsd: Number(values.get('priceUsd')),
          }, 'Maintenance price updated in local configuration.');
        }}>
          <h2>Maintenance package configuration</h2>
          <label>Monthly USD price<input name="priceUsd" type="number" min="1" max="10000" step="1" defaultValue={data.maintenance.priceUsd} required /></label>
          <p>{data.maintenance.includes.join(' · ')}</p>
          <p>Saving creates an audit entry and changes only the local simulation configuration.</p>
          <button className="btn btn--secondary" type="submit">Save maintenance price</button>
        </form>
      </article>
    </div>
  );
}

function TemplateSettings({ data, mutate }) {
  return (
    <div className="admin-list">
      <p className="form-notice">Demo changes update only the local simulation catalog. This does not publish to the static website.</p>
      {data.templates.map((item) => (
        <form
          className="card admin-config-form"
          key={item.slug}
          onSubmit={(event) => {
            event.preventDefault();
            const values = new FormData(event.currentTarget);
            mutate(`/api/admin/templates/${item.slug}`, 'PUT', {
              name: values.get('name'),
              description: values.get('description'),
              published: values.get('published') === 'on',
            }, `${item.name} updated in local catalog.`);
          }}
        >
          <h2>{item.name}</h2>
          <label>Demo title<input name="name" maxLength="100" defaultValue={item.name} required /></label>
          <label>Description<textarea name="description" rows="2" maxLength="400" defaultValue={item.description} required /></label>
          <label className="quote-form__consent"><input name="published" type="checkbox" defaultChecked={item.published !== false} /><span>Visible in local demo marketplace</span></label>
          <button className="btn btn--secondary" type="submit">Save local demo</button>
        </form>
      ))}
    </div>
  );
}

function ProjectList({ data, mutate }) {
  const [amounts, setAmounts] = useState({});
  const nextProjectStatus = {
    Accepted: ['In development', 'Cancelled'],
    'In development': ['Awaiting approval', 'Cancelled'],
    'Awaiting approval': ['Completed', 'In development', 'Cancelled'],
    Completed: [],
    Cancelled: [],
  };
  return (
    <div className="admin-list">
      {data.projects.map((project) => {
        const projectInvoices = data.invoices.filter((item) => item.projectId === project.id);
        const latestInvoice = projectInvoices[0];
        const invoice = latestInvoice?.status === 'Refunded' ? null : latestInvoice;
        return (
          <article className="card admin-record" key={project.id}>
            <div className="admin-record__header">
              <div><p className="eyebrow">Project · {project.customerName}</p><h2>{project.title}</h2></div>
              <label>Project status
                <select
                  aria-label={`Project status for ${project.customerName}`}
                  value={project.status}
                  onChange={(event) => mutate(`/api/admin/projects/${project.id}`, 'PATCH', { status: event.target.value }, 'Project status updated.')}
                >
                  <option>{project.status}</option>
                  {(nextProjectStatus[project.status] || []).map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
            </div>
            {!invoice && ['Accepted', 'In development'].includes(project.status) && (
              <form className="admin-inline-form" onSubmit={(event) => {
                event.preventDefault();
                mutate(`/api/admin/projects/${project.id}/invoices`, 'POST', { amountUsd: Number(amounts[project.id] || 399) }, 'Local sandbox invoice created. No payment requested externally.');
              }}>
                <label>Invoice amount (USD)
                  <input type="number" min="1" max="200000" step="1" value={amounts[project.id] || 399} onChange={(event) => setAmounts((current) => ({ ...current, [project.id]: event.target.value }))} />
                </label>
                <button className="btn btn--secondary" type="submit">Create sandbox invoice</button>
              </form>
            )}
            {invoice && <InvoiceControls invoice={invoice} mutate={mutate} />}
          </article>
        );
      })}
      {!data.projects.length && <div className="card"><p>Accepted quotations create project records. No project exists yet.</p></div>}
      <div className="card">
        <h2>All invoices</h2>
        {data.invoices.map((invoice) => (
          <p key={invoice.id}>{invoice.currency} {(invoice.amountCents / 100).toFixed(2)} · {invoice.status} · {invoice.provider}</p>
        ))}
        {!data.invoices.length && <p>No invoices. Only local-sandbox invoices can be created.</p>}
      </div>
    </div>
  );
}

function PortfolioSettings({ data, mutate }) {
  const completedProjects = data.projects.filter((project) =>
    project.status === 'Completed' && !data.portfolio.some((entry) => entry.projectId === project.id));
  return (
    <div className="admin-list">
      <p className="form-notice">Only completed work with explicit customer permission may be published. Never add fictional client projects, results, metrics, or testimonials.</p>
      {completedProjects.map((project) => (
        <form className="card admin-config-form" key={project.id} onSubmit={(event) => {
          event.preventDefault();
          const values = new FormData(event.currentTarget);
          mutate('/api/admin/portfolio', 'POST', {
            projectId: project.id,
            title: values.get('title'),
            summary: values.get('summary'),
            permissionConfirmed: values.get('permissionConfirmed') === 'on',
            published: values.get('published') === 'on',
          }, 'Portfolio entry saved locally.');
        }}>
          <p className="eyebrow">Completed project · {project.customerName}</p>
          <label>Public title<input name="title" maxLength="120" defaultValue={project.title} required /></label>
          <label>Summary<textarea name="summary" maxLength="1000" rows="3" required /></label>
          <label className="quote-form__consent"><input type="checkbox" name="permissionConfirmed" required /><span>I have documented customer permission for this public entry.</span></label>
          <label className="quote-form__consent"><input type="checkbox" name="published" /><span>Publish on the portfolio page now.</span></label>
          <button className="btn btn--secondary" type="submit">Save portfolio entry</button>
        </form>
      ))}
      {data.portfolio.map((entry) => (
        <form className="card admin-config-form" key={entry.id} onSubmit={(event) => {
          event.preventDefault();
          const values = new FormData(event.currentTarget);
          mutate(`/api/admin/portfolio/${entry.id}`, 'PATCH', {
            title: values.get('title'),
            summary: values.get('summary'),
            published: values.get('published') === 'on',
            permissionConfirmed: values.get('permissionConfirmed') === 'on',
          }, 'Portfolio entry updated locally.');
        }}>
          <p className="eyebrow">Customer permission confirmed</p>
          <label>Public title<input name="title" maxLength="120" defaultValue={entry.title} required /></label>
          <label>Summary<textarea name="summary" maxLength="1000" rows="3" defaultValue={entry.summary} required /></label>
          <label className="quote-form__consent"><input type="checkbox" name="permissionConfirmed" required defaultChecked /><span>Customer permission remains confirmed.</span></label>
          <label className="quote-form__consent"><input type="checkbox" name="published" defaultChecked={entry.published} /><span>Published on public portfolio</span></label>
          <button className="btn btn--secondary" type="submit">Update portfolio entry</button>
        </form>
      ))}
      {!completedProjects.length && !data.portfolio.length && (
        <div className="card"><p>No completed project with confirmed permission is available for portfolio publishing.</p></div>
      )}
    </div>
  );
}

function InvoiceControls({ invoice, mutate }) {
  const action = (type) => ({
    eventId: `sim_${crypto.randomUUID()}`,
    type,
  });
  return (
    <div className="admin-invoice">
      <h3>Sandbox invoice · {invoice.currency} {(invoice.amountCents / 100).toFixed(2)}</h3>
      <p>Status: <strong>{invoice.status}</strong> · Paid {invoice.currency} {(invoice.paidCents / 100).toFixed(2)}</p>
      <p>Deposit: {invoice.currency} {(invoice.depositCents / 100).toFixed(2)} · Balance: {invoice.currency} {(invoice.balanceCents / 100).toFixed(2)}</p>
      <p className="fine-print">Provider: local-sandbox. No card data, live provider, or money transfer is involved.</p>
      <div className="admin-inline-actions">
        {invoice.status === 'Deposit requested' && (
          <button className="btn btn--secondary" type="button" onClick={() => mutate(`/api/admin/invoices/${invoice.id}/sandbox-events`, 'POST', action('deposit_paid'), 'Deposit event simulated and recorded.')}>Simulate deposit paid</button>
        )}
        {invoice.status === 'Balance due' && (
          <button className="btn btn--secondary" type="button" onClick={() => mutate(`/api/admin/invoices/${invoice.id}/sandbox-events`, 'POST', action('balance_paid'), 'Balance event simulated and recorded.')}>Simulate balance paid</button>
        )}
        {invoice.paidCents > 0 && !['Refunded', 'Disputed'].includes(invoice.status) && (
          <button className="btn btn--secondary" type="button" onClick={() => mutate(`/api/admin/invoices/${invoice.id}/sandbox-events`, 'POST', action('refund'), 'Refund event simulated.')}>Simulate refund</button>
        )}
        {invoice.paidCents > 0 && !['Refunded', 'Disputed'].includes(invoice.status) && (
          <button className="btn btn--secondary" type="button" onClick={() => mutate(`/api/admin/invoices/${invoice.id}/sandbox-events`, 'POST', action('dispute'), 'Dispute event simulated.')}>Simulate dispute</button>
        )}
      </div>
    </div>
  );
}

function NotificationList({ notification }) {
  return (
    <div className="card">
      <p className="eyebrow">Email notifications</p>
      <h2>Delivery disabled</h2>
      <p>{notification?.message || 'Email delivery is disabled in this local simulation.'}</p>
      <p>No SMTP credentials, email provider, or delivery claims are configured.</p>
      <div className="admin-list">
        {notification?.outbox?.map((item) => (
          <article className="admin-record" key={item.id}>
            <div><strong>{item.type}</strong><p>{item.message}</p><small>{item.to} · {new Date(item.createdAt).toLocaleString()}</small></div>
            <span className="badge">{item.status}</span>
          </article>
        ))}
        {!notification?.outbox?.length && <p>Local outbox is empty.</p>}
      </div>
    </div>
  );
}

function AuditList({ entries }) {
  return (
    <div className="admin-list">
      {entries.map((entry) => (
        <article className="card admin-record" key={entry.id}>
          <div><strong>{entry.action}</strong><p>{entry.entity} · {entry.entityId}</p><small>{entry.actor} · {new Date(entry.at).toLocaleString()}</small><pre>{JSON.stringify(entry.details, null, 2)}</pre></div>
        </article>
      ))}
      {!entries.length && <div className="card"><p>No administrative actions recorded.</p></div>}
    </div>
  );
}
