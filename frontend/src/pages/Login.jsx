import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/validators';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';
import { PageMotion } from '../components/ui/PageMotion';

export default function Login() {
  const { login, loading } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!validateEmail(form.email)) nextErrors.email = 'Please enter a valid email address.';
    if (!validatePassword(form.password)) nextErrors.password = 'Please enter a valid password.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await login(form);
      if (!remember) {
        localStorage.removeItem('authUser');
        localStorage.removeItem('user');
      }
      push('Welcome back!', 'success');
      navigate('/dashboard');
    } catch {
      push('Invalid email or password.', 'error');
    }
  };

  return (
    <PageMotion className="section-wrap grid min-h-[82vh] items-center gap-5 py-10 lg:grid-cols-2">
      <div className="clay-panel hidden h-full p-8 lg:block">
        <h1 className="text-4xl font-semibold leading-tight text-ink">Welcome Back</h1>
        <p className="mt-4 text-sm text-muted">Sign in to your recruiter account and continue your hiring pipeline.</p>
        <ul className="mt-8 space-y-4 text-body">
          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Upload resumes and parse candidate data in seconds.</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Define job requirements and run matching instantly.</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Shortlist top-ranked candidates with confidence.</li>
        </ul>
      </div>

      <Card className="mx-auto w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-ink">Welcome Back</h2>
        <p className="mt-1 text-sm text-muted">Sign in to your recruiter account.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <Input
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className={errors.email ? 'border-danger' : ''}
            />
            {errors.email ? <p className="mt-1 text-xs text-danger">{errors.email}</p> : null}
          </div>

          <div className="relative">
            <Input
              type={show ? 'text' : 'password'}
              placeholder="Min 8 characters"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className={errors.password ? 'border-danger pr-10' : 'pr-10'}
            />
            <button type="button" className="absolute right-3 top-3.5 text-muted" onClick={() => setShow((prev) => !prev)}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            {errors.password ? <p className="mt-1 text-xs text-danger">{errors.password}</p> : null}
          </div>

          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
            Remember me
          </label>

          <Button className="w-full" variant="gradient" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </PageMotion>
  );
}
