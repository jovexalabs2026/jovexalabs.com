import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { products } from '../data/products.js';

export function DeveloperProjects() {
  return <>
    <Seo title="Public project guides" description="Current Jovexa Labs projects, access routes, limitations, and documentation without unsupported release or licensing claims." path="/developers/projects" />
    <section className="section">
      <p className="eyebrow">Developer hub</p><h1>Public project guides</h1>
      <p className="hero__lead">Find what is available, how to use it, and what is not yet released.</p>
      <p>Web resources on this host reflect its deployed version. The pages.dev preview and
        jovexalabs.com may run different releases. Status labels are not government or app-store approvals.</p>
      <div className="grid grid--three">
        {products.map((product) => <article className="card" key={product.slug}>
          <h2>{product.name}</h2><p>{product.description}</p>
          <p className="badge">{product.status}</p>
          <Link className="btn btn--secondary" to={product.projectPath || `/products/${product.slug}`}>Read project guide</Link>
        </article>)}
      </div>
      <p><Link to="/developers/docs">Usage, feedback, and contribution guide</Link></p>
      <p>No supported public API or SDK is currently offered. No private verification service
        is launched by these project pages.</p>
    </section>
  </>;
}

export default function DeveloperDocs() {
  return <>
    <Seo title="Documentation and contribution guide" description="Get started with Jovexa Learn, the isolated Code Lab, public Digital 2030 tools, and safe feedback." path="/developers/docs" />
    <section className="section section--narrow">
      <p className="eyebrow">Developer documentation</p><h1>Start using our public tools</h1>
      <p>These instructions describe the static public release, not an authenticated API or private backend.</p>
      <nav aria-label="Documentation sections"><ul className="list">
        <li><a href="#learning">Learning and progress</a></li>
        <li><a href="#code-lab">Code Lab</a></li>
        <li><a href="#public-tools">Digital 2030 tools</a></li>
        <li><a href="#feedback">Feedback and contributions</a></li>
        <li><a href="#licensing">Source access and licensing</a></li>
      </ul></nav>

      <h2 id="learning">Learning and progress</h2>
      <ol className="list">
        <li>Open <Link to="/learn">Jovexa Learn</Link> and choose a course.</li>
        <li>Read a lesson, work through its examples, then mark it complete when ready.</li>
        <li>Use the course quiz for practice and <Link to="/learn/my">My Learning</Link> to see this browser&apos;s progress.</li>
      </ol>
      <p>Progress uses browser storage, not an account. It does not transfer automatically between
        browsers or devices. Private browsing, blocked storage, or clearing site data may remove
        or prevent saved progress. It is not an accredited assessment or certificate.</p>

      <h2 id="code-lab">Code Lab</h2>
      <ol className="list">
        <li>Open the <Link to="/learn/playground">Code Lab</Link> in a current JavaScript-enabled browser.</li>
        <li>Choose an example or write HTML, CSS, and JavaScript in the editor.</li>
        <li>Select Run to refresh the result. Copy important work to your own file before resetting or clearing browser data.</li>
      </ol>
      <p>The result runs in an isolated frame without parent-page access or network requests.
        External libraries, remote images, form submissions, and API calls are intentionally blocked.
        Use inline CSS and JavaScript and keep previews within 50,000 characters. This is not
        a Python, SQL, Git, or Flutter runtime. Do not run code you do not understand; an
        infinite loop can still make a browser tab unresponsive.</p>
      <p>If the result does not change, select Run again or reload the page after saving your
        work elsewhere. If scripts are blocked by your browser configuration, do not disable
        security protections just to run an unfamiliar example.</p>

      <h2 id="public-tools">Digital 2030 tools</h2>
      <ul className="list">
        <li><Link to="/digital2030/cybersecurity">Online safety:</Link> remove personal details,
          paste a message or URL, then check warning signs. No submitted destination is opened.
          A lack of warnings is not a safety guarantee.</li>
        <li><Link to="/digital2030/business">Business drafts:</Link> choose a template, enter
          fictional or non-sensitive details, and generate locally. Quotation and invoice totals
          use whole quantities and PHP prices with at most two decimal places.</li>
        <li>Print a generated draft using the browser print dialog. Check its details before use.
          Drafts are not saved and are not BIR-authorized tax invoices.</li>
        <li><Link to="/digital2030/services">Public services:</Link> follow an official agency
          link and confirm current requirements there. Jovexa Labs does not collect government login credentials.</li>
      </ul>
      <p>Live AI, accounts, PHBIN issuance, private documents, and administration are not available here.</p>

      <h2 id="feedback">Feedback and contributions</h2>
      <p>Email <a href="mailto:admin@jovexalabs.com?subject=Website%20feedback">admin@jovexalabs.com</a> with:</p>
      <ul className="list">
        <li>The page URL and whether you used the preview or the main domain.</li>
        <li>Your browser and device, the steps taken, and expected versus actual results.</li>
        <li>A small fictional example or redacted screenshot, if helpful.</li>
      </ul>
      <p>For sensitive security reports, use the same email privately with subject
        &quot;Security report&quot;. Do not post credentials, OTPs, customer data, or private documents.
        Do not probe other users or production systems without explicit authorization.</p>
      <p>For lesson suggestions, include the topic and learning objective. Submit original work
        or material you have permission to share. Contact us before preparing a large contribution.
        Use GitHub issues or pull requests only if a project is publicly accessible and those
        features are enabled; private repository access is not required to send feedback.</p>

      <h2 id="licensing">Source access and licensing</h2>
      <p>Free use of a public tool does not grant permission to redistribute its source, lessons,
        branding, or assets. This corporate website retains its existing all-rights-reserved license.
        Any future open-source release needs its own explicit license. We have not changed
        repository visibility or granted a new license through this documentation.</p>
      <p><Link to="/developers/projects">See public project guides</Link> or
        visit the <a href="https://github.com/jovexalabs2026" target="_blank" rel="noopener noreferrer">official GitHub profile (new tab)</a>.
        A profile link does not guarantee that a particular repository or release is public.</p>
    </section>
  </>;
}
