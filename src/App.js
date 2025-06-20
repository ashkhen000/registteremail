import React, { useState, useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

function App() {
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState(null);
  const [backendReady, setBackendReady] = useState(false);
  const recaptchaRef = useRef(null);

  // Ping backend once on mount to "warm it up"
  useEffect(() => {
    fetch('https://pythonapi-4-evt9.onrender.com/ping')
      .then(() => setBackendReady(true))
      .catch((err) => {
        console.error('Backend cold or unreachable:', err);
        // Optional: Retry or let it hang here if backend is down
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);

    try {
      const token = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();

      const res = await fetch('https://pythonapi-4-evt9.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-secret': 'KeyOfSecure448877!!!', // Optional
        },
        body: JSON.stringify({ email, recaptcha_token: token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail);
      }

      setResponse({ type: 'success', message: data.message });
    } catch (err) {
      setResponse({ type: 'error', message: err.message });
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Register Email</h2>

      {!backendReady ? (
        <p>Waking up server...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
          <button type="submit">Submit</button>
          <ReCAPTCHA
            style={{ display: 'none' }}
            sitekey="6Lfm3mMrAAAAAM-dS0qBEl3Bi0Cfrdt77iisKe5E"
            size="invisible"
            ref={recaptchaRef}
          />
        </form>
      )}

      {response && (
        <p style={{ color: response.type === 'error' ? 'red' : 'green' }}>
          {response.message}
        </p>
      )}
    </div>
  );
}

export default App;
