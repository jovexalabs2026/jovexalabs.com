import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { courses, totalLessons } from '../data/learn/index.js';
import { assessSafety } from '../lib/digital2030/safety.js';
import { businessPlan, documentTotal } from '../lib/digital2030/business.js';
import { publicServices } from '../lib/digital2030/services.js';

const modules = [
  ['', 'Overview', 'Practical digital skills and tools for Filipinos.'],
  ['/ai', 'AI guidance', 'Learn how to use AI responsibly. Live AI is not available in this release.'],
  ['/education', 'Education', 'Explore existing free courses and device-only learning progress.'],
  ['/services', 'Public services', 'Find official Philippine government agency websites.'],
  ['/cybersecurity', 'Online safety', 'Check message and link warning signs without opening suspicious destinations.'],
  ['/business', 'Business tools', 'Prepare business plans and quotation or invoice drafts locally.'],
  ['/impact', 'Activity', 'Understand what this release measures, and what it does not.'],
];

export function DigitalLayout() {
  return <>
    <div className="digital-notice" role="note">
      Public tools release: no login, live AI, account sync, PHBIN issuance, private documents, or administration.
    </div>
    <nav className="digital-nav" aria-label="Digital 2030">
      {modules.map(([path, label]) => <NavLink key={path} to={`/digital2030${path}`} end={path === ''}>{label}</NavLink>)}
    </nav>
    <Outlet />
    <aside className="section section--narrow fine-print">
      Jovexa Digital 2030 is an independent Jovexa Labs initiative. It is not a UN, World Bank,
      or Philippine government program. No endorsement, funding, accreditation, or partnership is implied.
      Public use is not evidence of verified social impact.
    </aside>
  </>;
}

export function DigitalHome() {
  return <>
    <Seo title="Jovexa Digital 2030" description="Independent digital education and browser-only tools for Filipinos, businesses, schools, and communities." path="/digital2030" />
    <section className="section">
      <p className="eyebrow">Jovexa Digital 2030</p>
      <h1>Practical technology. More opportunities.</h1>
      <p className="hero__lead">Accessible learning and useful digital tools, operated by
        JOVEXA SOFTWARE DEVELOPMENT SERVICES under the Jovexa Labs brand.</p>
      <p>This public release works without an account. Private business verification and account-backed
        services are not being launched here. Your existing Jovexa Labs products and learning pages remain available.</p>
      <div className="grid grid--three">
        {modules.slice(1).map(([path, title, text]) => <article className="card" key={path}>
          <h2><Link to={`/digital2030${path}`}>{title}</Link></h2><p>{text}</p>
        </article>)}
      </div>
    </section>
  </>;
}

export function DigitalAI() {
  return <>
    <Seo title="Responsible AI guidance" description="Learn safer AI practices. Live AI is unavailable in this public release." path="/digital2030/ai" />
    <section className="section section--narrow">
      <p className="eyebrow">AI literacy</p><h1>Use AI as a tool, not an authority.</h1>
      <p className="digital-notice">Live AI is unavailable. This page contains published guidance, not AI-generated answers or a simulated chat.</p>
      <h2>Ask clearly, check carefully</h2>
      <ul className="list">
        <li>State your goal, audience, and desired format. Use fictional examples instead of personal records.</li>
        <li>Never submit passwords, OTPs, personal IDs, private documents, or customer information.</li>
        <li>Models can invent facts and sources. Verify important answers independently.</li>
        <li>Confirm current requirements through <Link to="/digital2030/services">official agencies</Link>.</li>
      </ul>
      <h2>Filipino / Tagalog</h2><p lang="fil">Maaaring magkamali ang AI. Suriin ang mahalagang impormasyon
        sa opisyal na pinagmulan. Huwag ibahagi ang password, OTP, o pribadong dokumento.</p>
      <h2>Cebuano / Bisaya</h2><p lang="ceb">Mahimong masayop ang AI. Susiha ang importanteng impormasyon
        sa opisyal nga tinubdan. Ayaw ipaambit ang password, OTP, o pribadong dokumento.</p>
    </section>
  </>;
}

export function DigitalEducation() {
  return <>
    <Seo title="Digital education" description="Free Jovexa Learn courses with lessons, quizzes, and device-only progress." path="/digital2030/education" />
    <section className="section">
      <p className="eyebrow">Jovexa Learn</p><h1>Build your digital foundations.</h1>
      <p className="hero__lead">Continue with our existing free lessons, practical exercises, and quizzes.</p>
      <p>Progress is stored on this browser only. No student account, cloud sync, or authoritative
        completion certificate is available in this release. Clearing browser data may remove progress.</p>
      <div className="hero__actions"><Link className="btn btn--primary" to="/learn">Browse all learning resources</Link>
        <Link className="btn btn--secondary" to="/learn/my">My device learning</Link></div>
      <div className="grid grid--three">
        {courses.map((course) => <article className="card" key={course.slug}>
          <h2><Link to={`/learn/${course.slug}`}>{course.title}</Link></h2>
          <p>{course.description}</p><p className="fine-print">{course.lessons.length} lessons</p>
        </article>)}
      </div>
      <p>Additional AI, cybersecurity, entrepreneurship, and financial-literacy courses in the
        unified application are not published as account-backed courses here.</p>
    </section>
  </>;
}

export function DigitalServices() {
  return <>
    <Seo title="Official public services directory" description="Links to official Philippine government agency homepages, without collecting government credentials." path="/digital2030/services" />
    <section className="section">
      <p className="eyebrow">Official destinations</p><h1>Find the right public service.</h1>
      <p>These are links, not government integrations. Confirm requirements, fees, and eligibility
        directly with the agency. Never enter government passwords or OTPs on Jovexa Labs.</p>
      <div className="grid grid--two">
        {publicServices.map((service) => <article className="card" key={service.name}>
          <h2>{service.name}</h2><p>{service.description}</p>
          <a href={service.url} target="_blank" rel="noopener noreferrer">{service.url} (official site, new tab)</a>
        </article>)}
      </div>
      <p className="fine-print">Directory source review: 24 October 2026.
        Agency uptime and current service availability are not guaranteed.</p>
    </section>
  </>;
}

export function DigitalSafety() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  return <>
    <Seo title="Cybersecurity and scam awareness" description="Local text checks for warning signs, without opening suspicious links." path="/digital2030/cybersecurity" />
    <section className="section section--narrow">
      <p className="eyebrow">Online safety</p><h1>Pause. Check. Protect.</h1>
      <p>Heuristic warning signs are not proof that a message is safe or fraudulent.
        Text stays in your browser. No submitted URL is opened, resolved, or fetched.</p>
      <form className="card digital-form" onSubmit={(event) => {
        event.preventDefault();
        const text = String(new FormData(event.currentTarget).get('message') ?? '');
        try { setResult(assessSafety(text)); setError(''); }
        catch (failure) { setResult(null); setError(failure.message); }
      }}>
        <label htmlFor="safety-message">Message or URL (remove private information first)</label>
        <textarea id="safety-message" name="message" required maxLength={5000} rows={6} />
        <button className="btn btn--primary" type="submit">Check warning signs locally</button>
        {error && <p role="alert">{error}</p>}
      </form>
      {result && <section className="card" aria-live="polite">
        <h2>{result.label}</h2><ul className="list">{result.indicators.map((item) => <li key={item}>{item}</li>)}</ul>
        <p>{result.note}</p>
      </section>}
      <h2>Protect your accounts</h2>
      <ul className="list">
        <li>Use unique passwords and enable MFA wherever available.</li>
        <li>Never disclose OTPs, recovery phrases, or backup codes.</li>
        <li>Find official contact details independently rather than using an unsolicited link.</li>
        <li>If money or access is at risk, contact the bank or service through a known official channel.</li>
        <li>Preserve evidence privately; do not post personal information publicly.</li>
      </ul>
    </section>
  </>;
}

export function DigitalBusiness() {
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  return <>
    <Seo title="Digital business tools" description="Browser-only business plan, invoice, and quotation drafts with PHP calculations." path="/digital2030/business" />
    <section className="section section--narrow">
      <p className="eyebrow">Digital business center</p><h1>Turn an idea into a practical next step.</h1>
      <p>Inputs stay in this browser and are not saved. Templates are not AI, legal advice, or
        BIR-authorized tax invoices. No PHBIN is issued through these tools.</p>
      <form className="card digital-form" onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const field = (name) => String(data.get(name) ?? '');
        try {
          if (field('kind') === 'plan') setOutput(businessPlan(field('business'), field('customer'), field('offer')));
          else {
            const total = documentTotal(field('quantity'), field('price'));
            setOutput(`${field('kind') === 'invoice' ? 'INVOICE DRAFT' : 'QUOTATION DRAFT'}\n${field('business')}\nFor: ${field('customer')}\n${field('offer')}\nQuantity: ${field('quantity')}\nUnit price: PHP ${field('price')}\nTotal: ${total.formatted}\n\nPlanning document only. Not a BIR-authorized tax invoice. Confirm applicable invoicing and tax rules.`);
          }
          setError('');
        } catch (failure) { setOutput(''); setError(failure.message); }
      }}>
        <label htmlFor="business-kind">Tool</label>
        <select id="business-kind" name="kind"><option value="plan">Business plan outline (template)</option>
          <option value="invoice">Invoice draft</option><option value="quotation">Quotation draft</option></select>
        {[['business', 'Business name'], ['customer', 'Customer / target audience'], ['offer', 'Product or service']].map(([name, label]) =>
          <label key={name}>{label}<input name={name} required maxLength={500} /></label>)}
        <label>Quantity<input name="quantity" type="number" min="1" max="99999" step="1" defaultValue="1" required /></label>
        <label>Unit price (PHP)<input name="price" type="number" min="0" max="99999999.99" step="0.01" defaultValue="0" required /></label>
        <button type="submit" className="btn btn--primary">Generate locally</button>
        {error && <p role="alert">{error}</p>}
      </form>
      {output && <section className="card digital-draft" aria-live="polite"><h2>Your draft</h2><p>{output}</p>
        <button type="button" className="btn btn--secondary" onClick={() => window.print()}>Print / save as PDF</button></section>}
      <h2>Digital readiness checklist</h2>
      {['Confirm registration and tax requirements with official agencies.',
        'Secure email and business accounts with unique passwords and MFA.',
        'Describe pricing, delivery, support, and refunds clearly.',
        'Publish a privacy notice and minimize customer information.',
        'Keep business records backed up and test recovery.',
        'Make truthful marketing claims without unearned endorsements.'].map((text) =>
        <label className="digital-check" key={text}><input type="checkbox" />{text}</label>)}
      <p className="fine-print">Checklist selections are temporary. PHBIN is an independent Jovexa Labs
        identifier, not a government-issued identifier or a D-U-N-S number. Business verification is not launched in this release.</p>
      <Link to="/digital2030/services">Find official registration information</Link>
    </section>
  </>;
}

export function DigitalActivity() {
  return <>
    <Seo title="Transparent platform activity" description="Published resource counts without fabricated usage or social-impact metrics." path="/digital2030/impact" />
    <section className="section section--narrow">
      <p className="eyebrow">Transparent reporting</p><h1>Resources, not invented impact.</h1>
      <p>This release has no account system or centralized usage tracking. We cannot report
        registered learners, completed courses, issued certificates, AI usage, or businesses served.</p>
      <dl className="digital-metrics">
        <div className="card"><dt>Published course resources</dt><dd>{courses.length}</dd></div>
        <div className="card"><dt>Published lessons</dt><dd>{totalLessons()}</dd></div>
        <div className="card"><dt>Listed official agency homepages</dt><dd>{publicServices.length}</dd></div>
      </dl>
      <p>These counts are calculated from the published catalog. They are not user activity or
        verified real-world social impact. Device-only progress is not aggregated.</p>
    </section>
  </>;
}
