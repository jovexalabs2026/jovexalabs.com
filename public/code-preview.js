// This response is sandboxed without allow-same-origin; code never reaches the parent DOM.
try {
  const code = decodeURIComponent(location.hash.slice(1));
  if (window.parent === window) {
    document.body.textContent = 'Open this preview from the Jovexa Code Lab.';
  } else if (!code || code.length > 50000) {
    document.body.textContent = 'Enter 1-50,000 characters of preview code.';
  } else {
    document.open();
    document.write(code);
    document.close();
  }
} catch {
  document.body.textContent = 'The code preview could not be read. Reset the editor and try again.';
}
