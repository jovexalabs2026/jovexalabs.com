import Seo from '../components/Seo.jsx';

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description="Jovexa Labs is an independent software development business focused on building useful, accessible, and reliable digital products."
        path="/about"
      />

      <section className="section section--narrow">
        <p className="eyebrow">About</p>
        <h1>About Jovexa Labs</h1>
        <p>
          Jovexa Labs is an independent software development business focused on building useful,
          accessible, and reliable digital products.
        </p>
        <p>
          We work across mobile applications, games, web platforms, educational technology,
          open-source projects, and developer tools.
        </p>
        <p>
          Our goal is simple: take ideas, build them carefully, and turn them into software that
          people can actually use.
        </p>

        <h2>Areas of work</h2>
        <ul className="list">
          <li>Mobile Apps</li>
          <li>Games</li>
          <li>Web Platforms</li>
          <li>Educational Technology</li>
          <li>Open Source</li>
          <li>Developer Tools</li>
        </ul>

        <h2>Brand principles</h2>
        <ul className="list">
          <li>Build useful software</li>
          <li>Keep technology accessible</li>
          <li>Respect user privacy</li>
          <li>Ship responsibly</li>
          <li>Improve continuously</li>
          <li>Support open development where appropriate</li>
          <li>Build for real users</li>
          <li>Keep products simple, reliable, and maintainable</li>
        </ul>
      </section>
    </>
  );
}
