import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { jobsApi } from '../api/jobs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { PageMotion } from '../components/ui/PageMotion';
import { initials } from '../utils/formatters';
import { useToast } from '../components/ui/Toast';

export default function MatchResults() {
  const { id } = useParams();
  const { push, loading, update } = useToast();
  const [job, setJob] = useState(null);
  const [results, setResults] = useState([]);

  const load = useCallback(async () => {
    try {
      const response = await jobsApi.getMatch(id);
      setJob(response.data.job);
      setResults(response.data.results || []);
    } catch {
      push('Something went wrong.', 'error');
    }
  }, [id, push]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const rerun = async () => {
    const toastId = loading('Running matching engine...');
    try {
      const response = await jobsApi.runMatch(id);
      setJob(response.data.job);
      setResults(response.data.results || []);
      update(toastId, {
        render: 'Matching complete! Candidates ranked.',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch {
      update(toastId, {
        render: 'Matching failed. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const shortlist = async (matchId, isShortlisted) => {
    try {
      await jobsApi.shortlist(matchId, { shortlisted: !isShortlisted });
      await load();
      if (isShortlisted) {
        push('Candidate removed from shortlist.', 'info');
      } else {
        push('Candidate added to shortlist.', 'success');
      }
    } catch {
      push('Something went wrong.', 'error');
    }
  };

  const emailMatch = async (matchId) => {
    try {
      await jobsApi.emailMatch(matchId);
      await load();
      push('Shortlist email sent', 'success');
    } catch {
      push('Something went wrong.', 'error');
    }
  };

  const emailAllShortlisted = async () => {
    try {
      const response = await jobsApi.emailAllShortlisted(id);
      await load();
      push(
        `Email process completed: ${response.data.sentCount} sent, ${response.data.failedCount} failed`,
        'info',
      );
    } catch {
      push('Something went wrong.', 'error');
    }
  };

  return (
    <PageMotion className="section-wrap space-y-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold">Match Results</h1>
          <p className="mt-1 text-sm text-muted">
            Candidates ranked by how well they match your job requirements.
          </p>
          {job?.title ? <p className="mt-1 text-xs text-muted">Role: {job.title}</p> : null}
        </div>
        <Button variant="gradient" onClick={rerun}>Run Matching Engine</Button>
      </div>

      <Card className="bg-surface/95">
        <CardHeader>
          <CardTitle>Job Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(job?.requiredSkills || []).map((skill) => <Badge key={skill}>{skill}</Badge>)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface/95">
        <CardHeader>
          <CardTitle>Ranked Candidates</CardTitle>
          <CardDescription>Sorted by match score, highest first.</CardDescription>
        </CardHeader>
        <CardContent>
          {!results.length ? (
            <div className="rounded-xl border border-dashed border-line bg-base/50 p-6 text-center">
              <p className="text-sm text-muted">Run the matching engine to see ranked results here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-muted">
                  <tr>
                    <th className="pb-2">Rank</th>
                    <th className="pb-2">Candidate</th>
                    <th className="pb-2">Match Score</th>
                    <th className="pb-2">Matched / Missing</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => {
                    const missing = (job?.requiredSkills || []).filter((skill) => !(result.matchedSkills || []).includes(skill));
                    return (
                      <tr key={result._id} className="hover-surface border-t border-line transition-colors duration-200">
                        <td className="py-3">#{index + 1}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-semibold">{initials(result.candidate?.name)}</span>
                            <span>{result.candidate?.name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="space-y-1">
                            <progress max="100" value={result.matchScore} className="h-2 w-32" />
                            <p className="text-xs text-muted">{result.matchScore}%</p>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1">
                            {(result.matchedSkills || []).slice(0, 4).map((skill) => <Badge key={skill} tone="success">{skill}</Badge>)}
                            {missing.slice(0, 4).map((skill) => <Badge key={skill} tone="danger">{skill}</Badge>)}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-2">
                            <Link to={`/candidates/${result.candidate?._id}`}><Button size="sm">View Profile</Button></Link>
                            <Button
                              size="sm"
                              variant={result.shortlisted ? 'gradient' : 'ghost'}
                              onClick={() => shortlist(result._id, result.shortlisted)}
                            >
                              {result.shortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => emailMatch(result._id)}
                            >
                              Send Email
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="gradient" onClick={emailAllShortlisted}>Email All Shortlisted Candidates</Button>
      </div>
    </PageMotion>
  );
}
