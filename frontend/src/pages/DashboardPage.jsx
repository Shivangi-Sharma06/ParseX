import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../services/dashboardApi';
import EmptyState from '../components/EmptyState.jsx';
import { formatDate } from '../utils/format';

export default function DashboardPage() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    Promise.all([dashboardApi.listCandidates(), dashboardApi.listJobs()])
      .then(([candidateResponse, jobResponse]) => {
        setCandidates(candidateResponse.data.candidates || []);
        setJobs(jobResponse.data.jobs || []);
      })
      .catch(() => {});
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total Candidates', value: candidates.length },
      { label: 'Open Jobs', value: jobs.length },
      { label: 'Parsed Today', value: candidates.filter((c) => new Date(c.createdAt).toDateString() === new Date().toDateString()).length },
    ],
    [candidates, jobs],
  );

  return (
    <div className="grid two">
      <section className="panel full">
        <h2>Recruiter Dashboard</h2>
        <p>Manage candidate uploads, job requirements, match scores, and shortlisting workflow.</p>
        <div className="stat-grid">
          {stats.map((item) => (
            <article key={item.label} className="stat-card">
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Recent Candidates</h3>
        {candidates.length === 0 ? (
          <EmptyState title="No candidates yet" subtitle="Upload resumes to build your candidate pipeline." />
        ) : (
          <div className="list">
            {candidates.slice(0, 6).map((candidate) => (
              <Link className="list-item" key={candidate._id} to={`/candidates/${candidate._id}`}>
                <strong>{candidate.name}</strong>
                <span>{candidate.email || 'Email not parsed'}</span>
                <small>{formatDate(candidate.createdAt)}</small>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h3>Recent Jobs</h3>
        {jobs.length === 0 ? (
          <EmptyState title="No jobs added" subtitle="Create job requirements to run candidate matching." />
        ) : (
          <div className="list">
            {jobs.slice(0, 6).map((job) => (
              <article className="list-item" key={job._id}>
                <strong>{job.title}</strong>
                <span>{job.requiredSkills.length} required skills</span>
                <small>{formatDate(job.createdAt)}</small>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
