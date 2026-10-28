import { useState } from 'react';

export default function TemplatePreview({ template, mode = 'desktop' }) {
  const [message, setMessage] = useState('');
  const [showInquiry, setShowInquiry] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [productCategory, setProductCategory] = useState('All items');

  function submitSampleInquiry(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const date = formData.get('date');
    const selection = formData.get('selection');
    setMessage(`Sample inquiry prepared for ${date || selection || 'your selection'}. Nothing was submitted or saved.`);
  }

  return (
    <div
      className={`demo-frame demo-frame--${mode}`}
      style={{
        '--demo-accent': template.color,
        '--demo-soft': template.soft,
        '--demo-ink': template.ink,
      }}
      aria-label={`${template.name} website demonstration`}
    >
      <div className={`demo-site demo-site--${template.slug}`}>
        <div className="demo-site__notice">Original sample concept · demonstration only</div>
        <header className="demo-site__header">
          <strong>{template.brand}</strong>
          <nav aria-label={`${template.brand} sample navigation`}>
            {['Overview', 'Details', 'Contact'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (item === 'Overview') document.getElementById(`demo-${template.slug}`)?.scrollIntoView({ behavior: 'smooth' });
                  else if (item === 'Details') document.getElementById(`demo-details-${template.slug}`)?.scrollIntoView({ behavior: 'smooth' });
                  else document.getElementById(`demo-footer-${template.slug}`)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {item}
              </button>
            ))}
          </nav>
          <span className="demo-site__menu" aria-hidden="true">☰</span>
        </header>
        <section className="demo-site__hero" id={`demo-${template.slug}`}>
          <span className="demo-site__kicker">{template.category} · Sample website</span>
          <h2>{template.headline}</h2>
          <p>{template.description}</p>
          <button type="button" onClick={() => {
            if (template.slug === 'clothing-store') {
              setCartCount((count) => count + 1);
              setMessage('Sample item added to the demo cart. No order or payment was made.');
            } else {
              setShowInquiry((show) => !show);
              setMessage('');
            }
          }}>{template.action}</button>
          <div className="demo-site__art" aria-hidden="true">
            <span>{template.name.split(' ')[0]}</span>
          </div>
        </section>
        <section className="demo-site__content" id={`demo-details-${template.slug}`}>
          <div className="demo-site__content-heading">
            <p>Made for people, not placeholders</p>
            <h3>{template.sectionTitle}</h3>
            {template.slug === 'clothing-store' && (
              <p className="demo-site__cart" aria-live="polite">Sample cart: {cartCount} item{cartCount === 1 ? '' : 's'} · checkout is disabled</p>
            )}
          </div>
          <div className="demo-site__cards">
            {template.slug === 'clothing-store' && (
              <div className="demo-site__categories" role="group" aria-label="Sample product categories">
                {['All items', 'Apparel', 'Accessories'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={productCategory === item}
                    onClick={() => setProductCategory(item)}
                  >{item}</button>
                ))}
              </div>
            )}
            {template.items.filter((item) => productCategory === 'All items' || item.category === productCategory).map((item, index) => (
              <article className="demo-site__card" key={item.title}>
                <span className="demo-site__number">0{index + 1}</span>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
                {template.slug === 'clothing-store' && (
                  <button type="button" className="demo-site__item-action" onClick={() => {
                    setCartCount((count) => count + 1);
                    setMessage('Sample item added to the demo cart. No order or payment was made.');
                  }}>Add sample item</button>
                )}
              </article>
            ))}
          </div>
          {template.slug === 'clothing-store' && cartCount > 0 && (
            <button type="button" className="demo-site__checkout" onClick={() => setMessage('Checkout demonstration only. No customer data, order, or payment was collected.')}>
              Continue to sample checkout · no payment
            </button>
          )}
          <div className="demo-site__gallery" aria-label="Illustrative gallery">
            {template.items.map((item) => (
              <div className="demo-site__gallery-tile" key={item.title}>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
          {showInquiry && template.slug !== 'clothing-store' && (
            <form className="demo-site__inquiry" onSubmit={submitSampleInquiry}>
              <h4>{template.action}</h4>
              {['restaurant', 'hotel-resort', 'dental-clinic'].includes(template.slug) ? (
                <label>Sample date<input type="date" name="date" required /></label>
              ) : null}
              {template.slug === 'restaurant' && (
                <label>Guests<select name="selection" defaultValue="2 guests"><option>2 guests</option><option>4 guests</option><option>6 guests</option></select></label>
              )}
              {template.slug === 'hotel-resort' && (
                <label>Room<select name="selection" defaultValue="Garden room"><option>Garden room</option><option>Ocean suite</option></select></label>
              )}
              {template.slug === 'dental-clinic' && (
                <label>Sample service<select name="selection" defaultValue="Preventive care"><option>Preventive care</option><option>Restorative care</option></select></label>
              )}
              {template.slug === 'school' && (
                <label>Sample program<select name="selection" defaultValue="Early years"><option>Early years</option><option>Middle grades</option></select></label>
              )}
              {!['restaurant', 'hotel-resort', 'dental-clinic', 'school'].includes(template.slug) && (
                <label>Sample topic<select name="selection" defaultValue={template.items[0].title}>
                  {template.items.map((item) => <option key={item.title}>{item.title}</option>)}
                </select></label>
              )}
              <button type="submit">Show sample inquiry response</button>
              <button type="button" onClick={() => setShowInquiry(false)}>Close sample form</button>
            </form>
          )}
          <p className="demo-site__feedback" role="status" aria-live="polite">{message}</p>
        </section>
        <footer className="demo-site__footer" id={`demo-footer-${template.slug}`}>
          {template.brand} <span>Sample content for design evaluation</span>
        </footer>
      </div>
    </div>
  );
}
