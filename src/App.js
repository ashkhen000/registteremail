import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

function App() {
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState(null);
  const recaptchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);

    const token = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    try {
      const res = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
          sitekey="YOUR_RECAPTCHA_SITE_KEY"
          size="invisible"
          ref={recaptchaRef}
        />
      </form>

      {response && (
        <p style={{ color: response.type === 'error' ? 'red' : 'green' }}>
          {response.message}
        </p>
      )}
    </div>
  );
}

export default App;
