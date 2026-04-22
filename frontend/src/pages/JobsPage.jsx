import { useEffect, useState } from 'react';
import { dashboardApi } from '../services/dashboardApi';
import { parseSkillInput } from '../utils/format';
import EmptyState from '../components/EmptyState.jsx';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', requiredSkills: '' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const loadJobs = async () => {
    const response = await dashboardApi.listJobs();
    setJobs(response.data.jobs || []);
  };

  useEffect(() => {
    loadJobs().catch(() => {});
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      await dashboardApi.createJob({
        title: form.title,
        description: form.description,
        requiredSkills: parseSkillInput(form.requiredSkills),
      });
      setForm({ title: '', description: '', requiredSkills: '' });
      await loadJobs();
      setMessage('Job created successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create job.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid two">
      <section className="panel">
        <h2>Create Job Requirement</h2>
        <form className="form" onSubmit={onSubmit}>
          <label>
            Job title
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </label>

          <label>
            Job description
            <textarea
              rows="5"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              required
            />
          </label>

          <label>
            Required skills (comma-separated)
            <input
              value={form.requiredSkills}
              onChange={(event) => setForm((prev) => ({ ...prev, requiredSkills: event.target.value }))}
              placeholder="react, nodejs, mongodb, jwt"
              required
            />
          </label>

          <button className="btn dark" type="submit" disabled={busy}>
            {busy ? 'Saving...' : 'Create Job'}
          </button>
        </form>

        {message ? <p className="status">{message}</p> : null}
      </section>

      <section className="panel">
        <h3>Saved Jobs</h3>
        {jobs.length === 0 ? (
          <EmptyState title="No jobs available" subtitle="Add your first role to start matching." />
        ) : (
          <div className="list">
            {jobs.map((job) => (
              <article className="list-item" key={job._id}>
                <strong>{job.title}</strong>
                <span>{job.description}</span>
                <small>{job.requiredSkills.join(', ')}</small>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
