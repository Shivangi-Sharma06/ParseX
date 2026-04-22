import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../services/dashboardApi';
import { skillLabel } from '../utils/format';

export default function MatchingPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const selectedJob = useMemo(() => jobs.find((job) => job._id === selectedJobId), [jobs, selectedJobId]);

  useEffect(() => {
    dashboardApi
      .listJobs()
      .then((response) => {
        const items = response.data.jobs || [];
        setJobs(items);
        if (items[0]) {
          setSelectedJobId(items[0]._id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;
    dashboardApi
      .getMatches(selectedJobId)
      .then((response) => setResults(response.data.results || []))
      .catch(() => setResults([]));
  }, [selectedJobId]);

  const runMatch = async () => {
    if (!selectedJobId) {
      setMessage('Please create/select a job first.');
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const response = await dashboardApi.runMatch(selectedJobId);
      setResults(response.data.results || []);
      setMessage('Matching complete. Rankings updated.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Match failed.');
    } finally {
      setBusy(false);
    }
  };

  const shortlist = async (matchId) => {
    setBusy(true);
    setMessage('');

    try {
      await dashboardApi.shortlistCandidate(matchId);
      const response = await dashboardApi.getMatches(selectedJobId);
      setResults(response.data.results || []);
      setMessage('Candidate shortlisted. Email trigger attempted.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Shortlist failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel">
      <h2>Candidate Matching Engine</h2>
      <p>Compare parsed candidate skills with required job skills and generate ranking scores.</p>

      <div className="row">
        <label>
          Select job
          <select value={selectedJobId} onChange={(event) => setSelectedJobId(event.target.value)}>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </select>
        </label>

        <button className="btn dark" type="button" onClick={runMatch} disabled={busy || !selectedJobId}>
          {busy ? 'Processing...' : 'Run Matching'}
        </button>
      </div>

      {selectedJob ? <p className="status">Required: {selectedJob.requiredSkills.map(skillLabel).join(', ')}</p> : null}
      {message ? <p className="status">{message}</p> : null}

      <div className="list">
        {results.map((result, index) => (
          <article className="list-item" key={result._id}>
            <div className="result-head">
              <strong>
                #{index + 1} {result.candidate?.name || 'Unknown Candidate'}
              </strong>
              <span className="score">{result.matchScore}%</span>
            </div>

            <span>Matched skills: {(result.matchedSkills || []).map(skillLabel).join(', ') || 'None'}</span>
            <span>Email status: {result.shortlistEmailStatus || 'not_sent'}</span>

            <div className="result-actions">
              <Link className="btn" to={`/candidates/${result.candidate?._id}`}>
                View Profile
              </Link>
              <button
                className="btn dark"
                type="button"
                onClick={() => shortlist(result._id)}
                disabled={busy || result.shortlisted}
              >
                {result.shortlisted ? 'Shortlisted' : 'Shortlist + Email'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
