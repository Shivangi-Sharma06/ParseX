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

export default function Register() {
  const { register, loading } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.username.trim()) nextErrors.username = 'Name is required';
    if (!validateEmail(form.email)) nextErrors.email = 'Enter a valid email address';
    if (!validatePassword(form.password)) nextErrors.password = 'Password must be at least 6 characters';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await register(form);
      push('Account created successfully', 'success');
      navigate('/dashboard');
    } catch (error) {
      push(error.response?.data?.message || 'Registration failed', 'error');
    }
  };

  return (
    <PageMotion className="section-wrap grid min-h-[82vh] items-center py-10 lg:grid-cols-2">
      <div className="hidden h-full rounded-2xl border border-line bg-gradient-to-br from-accentStart/25 to-accentEnd/15 p-8 lg:block">
        <h1 className="text-4xl font-extrabold">Create your ResumeIQ account</h1>
        <ul className="mt-8 space-y-4 text-muted">
          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />Resume parsing in seconds</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />AI-powered shortlist recommendations</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />Automated candidate communication</li>
        </ul>
      </div>

      <Card className="mx-auto w-full max-w-lg">
        <h2 className="text-2xl font-bold">Register</h2>
        <p className="mt-1 text-sm text-muted">Start your free recruiter workspace</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <Input
              type="text"
              placeholder="Full name"
              value={form.username}
              onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
              className={errors.username ? 'border-danger' : ''}
            />
            {errors.username ? <p className="mt-1 text-xs text-danger">{errors.username}</p> : null}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className={errors.email ? 'border-danger' : ''}
            />
            {errors.email ? <p className="mt-1 text-xs text-danger">{errors.email}</p> : null}
          </div>

          <div className="relative">
            <Input
              type={show ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className={errors.password ? 'border-danger pr-10' : 'pr-10'}
            />
            <button type="button" className="absolute right-3 top-3.5 text-muted" onClick={() => setShow((prev) => !prev)}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            {errors.password ? <p className="mt-1 text-xs text-danger">{errors.password}</p> : null}
          </div>

          <Button className="w-full" variant="gradient" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">or continue with Google</p>
        <p className="mt-4 text-center text-sm text-muted">Already have an account? <Link to="/login" className="text-accentStart">Sign in</Link></p>
      </Card>
    </PageMotion>
  );
}
