import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../services/dashboardApi';
import { useAuth } from '../context/useAuth.js';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      const payload =
        mode === 'register'
          ? form
          : {
              email: form.email,
              password: form.password,
            };

      const response =
        mode === 'register' ? await dashboardApi.register(payload) : await dashboardApi.login(payload);

      login(response.data);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Authentication failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="hero-card">
        <p className="kicker">MERN + JWT + AI</p>
        <h1>Recruit smarter with ParseX.</h1>
        <p>
          Upload resumes, parse key details, compare against jobs, and shortlist candidates with
          one dashboard.
        </p>
      </section>

      <section className="panel auth-panel">
        <div className="tabs">
          <button className={mode === 'login' ? 'tab active' : 'tab'} type="button" onClick={() => setMode('login')}>
            Login
          </button>
          <button className={mode === 'register' ? 'tab active' : 'tab'} type="button" onClick={() => setMode('register')}>
            Register
          </button>
        </div>

        <form className="form" onSubmit={onSubmit}>
          {mode === 'register' ? (
            <label>
              Recruiter Name
              <input name="username" value={form.username} onChange={onChange} required />
            </label>
          ) : null}

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              minLength={6}
              value={form.password}
              onChange={onChange}
              required
            />
          </label>

          <button className="btn dark" type="submit" disabled={busy}>
            {busy ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Login'}
          </button>
        </form>

        {message ? <p className="status error">{message}</p> : null}
      </section>
    </div>
  );
}
