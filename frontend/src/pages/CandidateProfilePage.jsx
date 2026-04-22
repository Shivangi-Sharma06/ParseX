import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { dashboardApi } from '../services/dashboardApi';
import { skillLabel } from '../utils/format';

export default function CandidateProfilePage() {
  const { candidateId } = useParams();
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const loadProfile = useCallback(async () => {
    const response = await dashboardApi.getCandidate(candidateId);
    setProfile(response.data.candidate);
    setMatches(response.data.matches || []);
  }, [candidateId]);

  useEffect(() => {
    loadProfile().catch(() => setMessage('Candidate not found.'));
  }, [loadProfile]);

  const refreshAnalysis = async () => {
    setBusy(true);
    setMessage('');

    try {
      await dashboardApi.analyzeCandidate(candidateId, { jobDescription });
      await loadProfile();
      setMessage('AI analysis refreshed.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Analysis refresh failed.');
    } finally {
      setBusy(false);
    }
  };

  const openResume = async () => {
    try {
      const response = await dashboardApi.downloadResume(candidateId);
      const blobUrl = URL.createObjectURL(new Blob([response.data]));
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to open resume file.');
    }
  };

  if (!profile) {
    return <section className="panel"><h3>Loading profile...</h3></section>;
  }

  return (
    <div className="grid two">
      <section className="panel">
        <h2>{profile.name}</h2>
        <p>{profile.email || 'Email unavailable'}</p>
        <p>Experience: {profile.experience || 'Not specified'}</p>
        <p>Skills: {(profile.skills || []).map(skillLabel).join(', ') || 'None'}</p>

        <button className="btn" type="button" onClick={openResume}>
          Open Resume
        </button>
      </section>

      <section className="panel">
        <h3>AI Resume Analysis</h3>
        <p>{profile.aiAnalysis?.summary || 'No AI summary available yet.'}</p>
        <p>Recommendation: {profile.aiAnalysis?.recommendation || 'Not available'}</p>
        <p>Confidence: {profile.aiAnalysis?.confidence || 0}%</p>

        <label>
          Optional job description context
          <textarea
            rows="4"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
          />
        </label>

        <button className="btn dark" type="button" onClick={refreshAnalysis} disabled={busy}>
          {busy ? 'Analyzing...' : 'Refresh AI Analysis'}
        </button>

        {message ? <p className="status">{message}</p> : null}
      </section>

      <section className="panel full">
        <h3>Match History</h3>
        {matches.length === 0 ? (
          <p>No match records yet. Run matching from the matching page.</p>
        ) : (
          <div className="list">
            {matches.map((match) => (
              <article className="list-item" key={match._id}>
                <strong>Score: {match.matchScore}%</strong>
                <span>Matched skills: {(match.matchedSkills || []).map(skillLabel).join(', ') || 'None'}</span>
                <span>Shortlisted: {match.shortlisted ? 'Yes' : 'No'}</span>
              </article>
            ))}
          </div>
        )}

        <Link className="btn" to="/matching">
          Back to Matching
        </Link>
      </section>
    </div>
  );
}
