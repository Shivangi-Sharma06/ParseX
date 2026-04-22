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
  const { push } = useToast();
  const [job, setJob] = useState(null);
  const [results, setResults] = useState([]);

  const load = useCallback(async () => {
    const response = await jobsApi.getMatch(id);
    setJob(response.data.job);
    setResults(response.data.results || []);
  }, [id]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const rerun = async () => {
    try {
      const response = await jobsApi.runMatch(id);
      setJob(response.data.job);
      setResults(response.data.results || []);
      push('Match re-run completed', 'success');
    } catch {
      push('Failed to run matching', 'error');
    }
  };

  const shortlist = async (matchId) => {
    try {
      await jobsApi.shortlist(matchId);
      await load();
      push('Candidate shortlisted', 'success');
    } catch {
      push('Shortlist action failed', 'error');
    }
  };

  const emailMatch = async (matchId) => {
    try {
      await jobsApi.emailMatch(matchId);
      await load();
      push('Shortlist email sent', 'success');
    } catch (error) {
      push(error.response?.data?.message || 'Failed to send email', 'error');
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
    } catch (error) {
      push(error.response?.data?.message || 'Failed to send bulk emails', 'error');
    }
  };

  return (
    <PageMotion className="section-wrap space-y-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-bold">{job?.title || 'Matching Results'}</h1>
        <Button variant="gradient" onClick={rerun}>Re-run Match</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(job?.requiredSkills || []).map((skill) => <Badge key={skill}>{skill}</Badge>)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ranked Candidates</CardTitle>
          <CardDescription>Sorted by match score</CardDescription>
        </CardHeader>
        <CardContent>
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
                    <tr key={result._id} className="border-t border-line">
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
                          <Link to={`/candidates/${result.candidate?._id}`}><Button size="sm">View</Button></Link>
                          <Button
                            size="sm"
                            variant={result.shortlisted ? 'gradient' : 'ghost'}
                            onClick={() => shortlist(result._id)}
                            disabled={result.shortlisted}
                          >
                            {result.shortlisted ? 'Shortlisted' : 'Shortlist'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => emailMatch(result._id)}
                          >
                            Email
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="gradient" onClick={emailAllShortlisted}>Email All Shortlisted</Button>
      </div>
    </PageMotion>
  );
}
