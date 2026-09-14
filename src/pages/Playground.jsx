import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

const STARTER = `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: system-ui, sans-serif;
        background: #05060f;
        color: #e7e9f5;
        text-align: center;
        padding-top: 60px;
      }
      h1 { color: #22d3ee; }
      button {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to Jovexa Code Lab</h1>
    <p>Edit the code on the left, then press Run.</p>
    <button onclick="alert('It works!')">Click me</button>
  </body>
</html>`;

export default function Playground() {
  const [code, setCode] = useState(STARTER);
  const [output, setOutput] = useState(STARTER);
  const editorRef = useRef(null);

  const run = () => setOutput(code);
  const reset = () => {
    setCode(STARTER);
    setOutput(STARTER);
    editorRef.current?.focus();
  };

  return (
    <>
      <Seo
        title="Code Lab: Live HTML, CSS & JavaScript Playground"
        description="Write and run HTML, CSS, and JavaScript directly in your browser with the free Jovexa Code Lab. No account, no setup."
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
          Write HTML, CSS, and JavaScript on the left and see the result on the right. Everything
          runs in your browser. Nothing is uploaded or saved.
        </p>

        <div className="playground">
          <div className="playground__pane">
            <div className="playground__toolbar">
              <span className="playground__label">Editor</span>
              <div className="playground__buttons">
                <button type="button" className="btn btn--primary btn--small" onClick={run}>
                  ▶ Run
                </button>
                <button type="button" className="btn btn--secondary btn--small" onClick={reset}>
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

          <div className="playground__pane">
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
          Tip: work through the <Link to="/learn/html-basics">HTML Basics</Link> course and test
          every example here as you go.
        </p>
      </section>
    </>
  );
}
