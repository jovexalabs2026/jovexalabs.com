import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

const SAVE_KEY = 'jovexa-codelab-v1';

const PRESETS = {
  starter: {
    label: 'Starter page',
    code: `<!DOCTYPE html>\n<html>\n  <head>\n    <style>\n      body {\n        font-family: system-ui, sans-serif;\n        background: #05060f;\n        color: #e7e9f5;\n        text-align: center;\n        padding-top: 60px;\n      }\n      h1 { color: #22d3ee; }\n      button {\n        background: #3b82f6;\n        color: white;\n        border: none;\n        padding: 10px 24px;\n        border-radius: 8px;\n        font-size: 16px;\n        cursor: pointer;\n      }\n    </style>\n  </head>\n  <body>\n    <h1>Welcome to Jovexa Code Lab</h1>\n    <p>Edit the code, then press Run.</p>\n    <button onclick="alert('It works!')">Click me</button>\n  </body>\n</html>`,
  },
  flexbox: {
    label: 'CSS flexbox cards',
    code: `<!DOCTYPE html>\n<html>\n  <head>\n    <style>\n      body { font-family: sans-serif; margin: 20px; }\n      .row { display: flex; gap: 12px; flex-wrap: wrap; }\n      .card {\n        flex: 1 1 120px;\n        background: #eef2ff;\n        border: 1px solid #c7d2fe;\n        border-radius: 10px;\n        padding: 16px;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="row">\n      <div class="card">One</div>\n      <div class="card">Two</div>\n      <div class="card">Three</div>\n    </div>\n  </body>\n</html>`,
  },
  counter: {
    label: 'JavaScript counter',
    code: `<!DOCTYPE html>\n<html>\n  <body style="font-family: sans-serif; text-align: center; padding-top: 40px;">\n    <h1 id="count">0</h1>\n    <button id="add">+1</button>\n    <script>\n      let value = 0;\n      const label = document.querySelector('#count');\n      document.querySelector('#add').addEventListener('click', () => {\n        value = value + 1;\n        label.textContent = value;\n      });\n    <\/script>\n  </body>\n</html>`,
  },
  form: {
    label: 'HTML form',
    code: `<!DOCTYPE html>\n<html>\n  <body style="font-family: sans-serif; padding: 24px;">\n    <form onsubmit="event.preventDefault(); alert('Sent!');">\n      <label for="name">Name</label><br />\n      <input id="name" required /><br /><br />\n      <label for="email">Email</label><br />\n      <input id="email" type="email" required /><br /><br />\n      <button type="submit">Send</button>\n    </form>\n  </body>\n</html>`,
  },
};

export default function Playground() {
  const [code, setCode] = useState(() => {
    try {
      return localStorage.getItem(SAVE_KEY) || PRESETS.starter.code;
    } catch {
      return PRESETS.starter.code;
    }
  });
  const [output, setOutput] = useState(code);
  const [tab, setTab] = useState('editor');
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(SAVE_KEY, code);
      } catch {
        // storage unavailable; autosave is best-effort
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [code]);

  const run = () => {
    setOutput(code);
    setTab('preview');
  };

  const loadPreset = (key) => {
    const preset = PRESETS[key];
    if (!preset) return;
    setCode(preset.code);
    setOutput(preset.code);
    setTab('editor');
    editorRef.current?.focus();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <>
      <Seo
        title="Code Lab: Live HTML, CSS & JavaScript Playground"
        description="Write and run HTML, CSS, and JavaScript directly in your browser with the free Jovexa Code Lab. Presets, autosave, no account, no setup."
        path="/learn/playground"
      />

      <section className="section">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/learn">Jovexa Learn</Link> <span aria-hidden="true">/</span>{' '}
          <span>Code Lab</span>
        </nav>
        <p className="eyebrow">Jovexa Code Lab</p>
        <h1>Try it yourself</h1>
        <p className="section__lead">
          Write HTML, CSS, and JavaScript and see the result instantly. Your code autosaves on
          this device only. Nothing is uploaded.
        </p>

        <div className="playground__controls">
          <label htmlFor="preset" className="playground__label">
            Example
          </label>
          <select id="preset" defaultValue="starter" onChange={(e) => loadPreset(e.target.value)}>
            {Object.entries(PRESETS).map(([key, preset]) => (
              <option key={key} value={key}>
                {preset.label}
              </option>
            ))}
          </select>
          <div className="playground__tabs" role="tablist" aria-label="Editor or preview">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'editor'}
              className={tab === 'editor' ? 'is-active' : ''}
              onClick={() => setTab('editor')}
            >
              Editor
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'preview'}
              className={tab === 'preview' ? 'is-active' : ''}
              onClick={() => setTab('preview')}
            >
              Preview
            </button>
          </div>
        </div>

        <div className={`playground playground--tab-${tab}`}>
          <div className="playground__pane playground__pane--editor">
            <div className="playground__toolbar">
              <span className="playground__label">Editor</span>
              <div className="playground__buttons">
                <button type="button" className="btn btn--primary btn--small" onClick={run}>
                  ▶ Run
                </button>
                <button type="button" className="btn btn--secondary btn--small" onClick={copy}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  className="btn btn--secondary btn--small"
                  onClick={() => loadPreset('starter')}
                >
                  Reset
                </button>
              </div>
            </div>
            <textarea
              ref={editorRef}
              className="playground__editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              aria-label="Code editor"
            />
          </div>

          <div className="playground__pane playground__pane--preview">
            <div className="playground__toolbar">
              <span className="playground__label">Result</span>
            </div>
            <iframe
              className="playground__result"
              title="Code result"
              sandbox="allow-scripts allow-modals"
              srcDoc={output}
            />
          </div>
        </div>

        <p className="fine-print">
          Tip: every HTML, CSS, and JavaScript lesson has examples you can paste here. Start with{' '}
          <Link to="/learn/html">the HTML course</Link>.
        </p>
      </section>
    </>
  );
}
