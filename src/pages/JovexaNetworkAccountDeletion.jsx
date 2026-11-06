import Seo from '../components/Seo.jsx';

const CONTACT_EMAIL = 'admin@jovexalabs.com';

function openDeletionEmail(event) {
  event.preventDefault();
  const emailValue = new FormData(event.currentTarget).get('accountEmail');
  const accountEmail = typeof emailValue === 'string' ? emailValue.trim() : '';
  const subject = 'Jovexa Network account deletion request';
  const body = [
    'Please delete my Jovexa Network account and associated app data.',
    '',
    `Account email: ${accountEmail}`,
    '',
    'I understand Jovexa may need to verify account ownership before completing this request.',
  ].join('\n');

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function JovexaNetworkAccountDeletion() {
  return (
    <>
      <Seo
        title="Jovexa Network Account Deletion"
        description="Request deletion of your Jovexa Network account and associated app data."
        path="/apps/jovexa-network/account-deletion"
      />

      <section className="section section--narrow legal">
        <p className="eyebrow">Jovexa Network</p>
        <h1>Request account deletion</h1>
        <p>
          You can delete your account in the Jovexa Network app. If you cannot access the app,
          use the form below to prepare an email request. We will verify that you control the
          account before processing the request.
        </p>

        <form className="digital-form" onSubmit={openDeletionEmail}>
          <label htmlFor="accountEmail">Email address used for your Jovexa Network account</label>
          <input
            id="accountEmail"
            name="accountEmail"
            type="email"
            autoComplete="email"
            required
          />
          <button className="btn btn--primary" type="submit">
            Prepare deletion request
          </button>
        </form>

        <p>
          This static page does not send or store your request. Submitting asks your browser to
          open a draft in your email app; review it and send it to us to make the request. If no
          email app opens, send an email to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the subject
          "Jovexa Network account deletion request" and the account email address. Do not include
          passwords, sign-in links, identity documents, or other sensitive information.
        </p>

        <h2>What is deleted</h2>
        <p>
          After account ownership is verified, deletion removes the user's Supabase Auth account
          and associated Jovexa Network records, including participation sessions, point history,
          and cosmetic reward records. The request does not delete information Google or other
          independent providers retain under their own policies, or records that must be retained
          by law. Provider backups and logs may remain until their normal deletion cycles.
        </p>

        <h2>Questions</h2>
        <p>
          Read the <a href="/apps/jovexa-network/privacy">Privacy Notice</a> or contact{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </>
  );
}
