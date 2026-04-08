import { useCallback, useEffect, useMemo, useState } from 'react';
import api from './services/api';
import { formatDate, prettifySkill } from './utils/format';
import './App.css';

const getStoredAuth = () => {
  const token = localStorage.getItem('auth_token');
  const storedUser = localStorage.getItem('auth_user');

  if (!token || !storedUser) {
    return { token: '', user: null };
  }

  try {
    return {
      token,
      user: JSON.parse(storedUser),
    };
  } catch {
    return { token: '', user: null };
  }
};

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [{ token, user }, setAuthState] = useState(getStoredAuth());
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const [resumeFile, setResumeFile] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requiredSkills: '',
  });

  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [matchResults, setMatchResults] = useState([]);

  const isAuthenticated = Boolean(token && user);

  const selectedJob = useMemo(
    () => jobs.find((job) => job._id === selectedJobId) || null,
    [jobs, selectedJobId],
  );

  const persistAuth = (nextToken, nextUser) => {
    localStorage.setItem('auth_token', nextToken);
    localStorage.setItem('auth_user', JSON.stringify(nextUser));
    setAuthState({ token: nextToken, user: nextUser });
  };

  const clearAuth = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setAuthState({ token: '', user: null });
    setCandidates([]);
    setJobs([]);
    setMatchResults([]);
    setSelectedJobId('');
  }, []);

  const loadDashboardData = useCallback(async () => {
    const [candidateResponse, jobResponse] = await Promise.all([
      api.get('/candidates'),
      api.get('/jobs'),
    ]);

    setCandidates(candidateResponse.data.candidates || []);
    setJobs(jobResponse.data.jobs || []);

    if ((jobResponse.data.jobs || []).length > 0 && !selectedJobId) {
      setSelectedJobId(jobResponse.data.jobs[0]._id);
    }
  }, [selectedJobId]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    loadDashboardData().catch(() => {
      setMessage('Session expired. Please login again.');
      clearAuth();
    });
  }, [clearAuth, isAuthenticated, loadDashboardData]);

  const handleAuthChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login';
      const payload =
        authMode === 'register'
          ? authForm
          : { email: authForm.email, password: authForm.password };

      const response = await api.post(endpoint, payload);

      persistAuth(response.data.token, response.data.user);
      setAuthForm({ username: '', email: '', password: '' });
      setMessage(authMode === 'register' ? 'Account created.' : 'Welcome back.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleResumeUpload = async (event) => {
    event.preventDefault();
    if (!resumeFile) {
      setMessage('Select a PDF or DOCX resume first.');
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      await api.post('/candidates/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResumeFile(null);
      await loadDashboardData();
      setMessage('Resume uploaded and parsed.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Resume upload failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleJobSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      await api.post('/jobs', jobForm);
      setJobForm({ title: '', description: '', requiredSkills: '' });
      await loadDashboardData();
      setMessage('Job profile created.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create job.');
    } finally {
      setBusy(false);
    }
  };

  const handleMatchRun = async () => {
    if (!selectedJobId) {
      setMessage('Create or select a job first.');
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const response = await api.post(`/matches/${selectedJobId}/run`);
      setMatchResults(response.data.results || []);
      setMessage('Matching completed successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Matching failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="app-shell">
      <div className="orbs" aria-hidden="true" />

      <header className="topbar">
        <h1 className="brand">ParseX Recruit</h1>
        <div className="topbar-actions">
          <span className="chip">
            {isAuthenticated ? `Logged in as ${user.username}` : 'Recruiter Console'}
          </span>
          {isAuthenticated ? (
            <button className="btn ghost" type="button" onClick={clearAuth}>
              Disconnect
            </button>
          ) : null}
        </div>
      </header>

      <section className="hero">
        <span className="eyebrow">Resume Parser and Matching Engine</span>
        <h2>Shortlist Top Candidates Faster</h2>
        <p>
          Upload resumes, extract candidate profiles, and rank applicants against job requirements
          with skill-based scoring.
        </p>
      </section>

      {message ? <p className="message">{message}</p> : null}

      {!isAuthenticated ? (
        <section className="panel auth-panel">
          <div className="tabs">
            <button
              type="button"
              className={authMode === 'login' ? 'tab active' : 'tab'}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === 'register' ? 'tab active' : 'tab'}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>
          <form className="form" onSubmit={handleAuthSubmit}>
            {authMode === 'register' ? (
              <label>
                Username
                <input
                  name="username"
                  type="text"
                  value={authForm.username}
                  onChange={handleAuthChange}
                  required
                />
              </label>
            ) : null}
            <label>
              Email
              <input
                name="email"
                type="email"
                value={authForm.email}
                onChange={handleAuthChange}
                required
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                value={authForm.password}
                onChange={handleAuthChange}
                required
              />
            </label>
            <button className="btn" disabled={busy} type="submit">
              {busy ? 'Please wait...' : authMode === 'register' ? 'Create Account' : 'Login'}
            </button>
          </form>
        </section>
      ) : (
        <section className="dashboard">
          <article className="panel">
            <h3>Upload Resume</h3>
            <form className="form" onSubmit={handleResumeUpload}>
              <label>
                PDF/DOCX file
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                  required
                />
              </label>
              <button className="btn" disabled={busy} type="submit">
                Parse Resume
              </button>
            </form>
          </article>

          <article className="panel">
            <h3>Create Job Requirement</h3>
            <form className="form" onSubmit={handleJobSubmit}>
              <label>
                Job title
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(event) => setJobForm((prev) => ({ ...prev, title: event.target.value }))}
                  required
                />
              </label>
              <label>
                Description
                <textarea
                  value={jobForm.description}
                  onChange={(event) =>
                    setJobForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  rows="3"
                  required
                />
              </label>
              <label>
                Required skills (comma-separated)
                <input
                  type="text"
                  value={jobForm.requiredSkills}
                  onChange={(event) =>
                    setJobForm((prev) => ({ ...prev, requiredSkills: event.target.value }))
                  }
                  placeholder="java, spring boot, react, sql"
                  required
                />
              </label>
              <button className="btn" disabled={busy} type="submit">
                Save Job
              </button>
            </form>
          </article>

          <article className="panel">
            <h3>Run Matching</h3>
            <label>
              Select job
              <select
                value={selectedJobId}
                onChange={(event) => setSelectedJobId(event.target.value)}
                disabled={jobs.length === 0}
              >
                {jobs.length === 0 ? <option value="">No jobs available</option> : null}
                {jobs.map((job) => (
                  <option value={job._id} key={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn" disabled={busy || !selectedJobId} type="button" onClick={handleMatchRun}>
              Generate Ranking
            </button>
            {selectedJob ? (
              <p className="hint">
                Required skills: {selectedJob.requiredSkills.map((skill) => prettifySkill(skill)).join(', ')}
              </p>
            ) : null}
          </article>

          <article className="panel list-panel">
            <h3>Candidates ({candidates.length})</h3>
            <div className="list">
              {candidates.map((candidate) => (
                <div className="list-item" key={candidate._id}>
                  <strong>{candidate.name}</strong>
                  <span>{candidate.email || 'Email not found'}</span>
                  <span>{candidate.experience || 'Experience not specified'}</span>
                  <div className="tag-row">
                    {candidate.skills.slice(0, 8).map((skill) => (
                      <span className="tag" key={`${candidate._id}-${skill}`}>
                        {prettifySkill(skill)}
                      </span>
                    ))}
                  </div>
                  <small>Parsed on {formatDate(candidate.createdAt)}</small>
                </div>
              ))}
              {candidates.length === 0 ? <p className="empty">No resumes parsed yet.</p> : null}
            </div>
          </article>

          <article className="panel list-panel">
            <h3>Ranked Matches ({matchResults.length})</h3>
            <div className="list">
              {matchResults.map((result, index) => (
                <div className="list-item" key={result._id}>
                  <strong>
                    #{index + 1} {result.candidate.name}
                  </strong>
                  <span>{result.candidate.email || 'Email not found'}</span>
                  <div className="score">
                    <div className="score-fill" style={{ width: `${result.matchScore}%` }} />
                  </div>
                  <small>{result.matchScore}% match</small>
                  <div className="tag-row">
                    {result.matchedSkills.map((skill) => (
                      <span className="tag success" key={`${result._id}-${skill}`}>
                        {prettifySkill(skill)}
                      </span>
                    ))}
                    {result.matchedSkills.length === 0 ? (
                      <span className="tag">No matched skills</span>
                    ) : null}
                  </div>
                </div>
              ))}
              {matchResults.length === 0 ? <p className="empty">Run matching to view rankings.</p> : null}
            </div>
          </article>
        </section>
      )}
    </main>
  );
}

export default App;
