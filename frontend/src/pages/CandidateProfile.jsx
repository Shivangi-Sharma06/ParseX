import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download, Mail, Star } from 'lucide-react';
import { candidatesApi } from '../api/candidates';
import { jobsApi } from '../api/jobs';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ScoreRing } from '../components/ui/ScoreRing';
import { PageMotion } from '../components/ui/PageMotion';
import { initials } from '../utils/formatters';
import { useToast } from '../components/ui/Toast';

const tabs = ['Overview', 'Skills', 'Experience', 'Education', 'AI Analysis'];

export default function CandidateProfile() {
  const { id } = useParams();
  const { push } = useToast();
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    const response = await candidatesApi.getById(id);
    setData(response.data);
  }, [id]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const openResume = async () => {
    try {
      const response = await candidatesApi.resume(id);
      const url = URL.createObjectURL(new Blob([response.data]));
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      push('Unable to download resume', 'error');
    }
  };

  const runAnalysis = async () => {
    try {
      await candidatesApi.analyze(id, {});
      push('AI analysis refreshed', 'success');
      await load();
    } catch {
      push('AI analysis failed', 'error');
    }
  };

  const candidate = data?.candidate;
  const matches = data?.matches || [];
  const topMatch = matches[0];

  const shortlistTopMatch = async () => {
    if (!topMatch?._id) {
      push('No match available yet. Run matching first.', 'info');
      return;
    }

    try {
      await jobsApi.shortlist(topMatch._id);
      await load();
      push('Candidate shortlisted for top matched job', 'success');
    } catch (error) {
      push(error.response?.data?.message || 'Failed to shortlist candidate', 'error');
    }
  };

  const emailTopMatch = async () => {
    if (!topMatch?._id) {
      push('No match available yet. Run matching first.', 'info');
      return;
    }

    try {
      await jobsApi.emailMatch(topMatch._id);
      await load();
      push('Shortlist email sent for top matched job', 'success');
    } catch (error) {
      push(error.response?.data?.message || 'Failed to send email', 'error');
    }
  };

  if (!candidate) {
    return <PageMotion className="section-wrap py-8"><Card><CardContent>Loading profile...</CardContent></Card></PageMotion>;
  }

  const score = Math.max(...matches.map((m) => m.matchScore), 0);

  return (
    <PageMotion className="section-wrap space-y-6 py-8">
      <Link to="/candidates" className="text-sm text-accentStart">← Candidates</Link>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-white/10 text-xl font-bold">{initials(candidate.name)}</div>
            <div className="grow">
              <h1 className="text-2xl font-bold">{candidate.name}</h1>
              <p className="text-sm text-muted">{candidate.email || 'N/A'} · {candidate.phone || 'N/A'} · {candidate.location || 'N/A'}</p>
            </div>
            <ScoreRing score={score} size="lg" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="gradient" onClick={shortlistTopMatch}><Star className="h-4 w-4" />Shortlist</Button>
            <Button className="w-full" onClick={emailTopMatch}><Mail className="h-4 w-4" />Send Email</Button>
            <Button className="w-full" variant="ghost" onClick={openResume}><Download className="h-4 w-4" />Download Resume</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Button key={tab} variant={activeTab === tab ? 'gradient' : 'ghost'} onClick={() => setActiveTab(tab)}>
                {tab}
              </Button>
            ))}
          </div>

          {activeTab === 'Overview' ? (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Card><CardContent><p className="text-xs text-muted">Total Experience</p><p className="font-semibold">{candidate.experience || 'N/A'}</p></CardContent></Card>
              <Card><CardContent><p className="text-xs text-muted">Education Level</p><p className="font-semibold">{candidate.education?.[0] || 'N/A'}</p></CardContent></Card>
              <Card><CardContent><p className="text-xs text-muted">Last Active</p><p className="font-semibold">Recently</p></CardContent></Card>
            </div>
          ) : null}

          {activeTab === 'Skills' ? (
            <div className="mt-4 space-y-3">
              <CardDescription>Technical Skills</CardDescription>
              <div className="flex flex-wrap gap-2">
                {(candidate.skills || []).map((skill) => <Badge key={skill}>{skill}</Badge>)}
              </div>
            </div>
          ) : null}

          {activeTab === 'Experience' ? (
            <div className="mt-4 space-y-3">
              <div className="border-l border-line pl-4 text-sm text-muted">{candidate.experience || 'No timeline details parsed yet.'}</div>
            </div>
          ) : null}

          {activeTab === 'Education' ? (
            <div className="mt-4 space-y-2 text-sm text-muted">
              {(candidate.education || []).length
                ? candidate.education.map((edu) => <p key={edu}>{edu}</p>)
                : <p>No education information parsed.</p>}
            </div>
          ) : null}

          {activeTab === 'AI Analysis' ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-muted">{candidate.aiAnalysis?.summary || 'No AI summary available.'}</p>
              <div className="grid gap-3 md:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle>Strengths</CardTitle></CardHeader>
                  <CardContent className="text-sm text-muted">
                    {(candidate.aiAnalysis?.strengths || []).map((item) => <p key={item}>• {item}</p>)}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Gaps / Concerns</CardTitle></CardHeader>
                  <CardContent className="text-sm text-muted">
                    {(candidate.aiAnalysis?.concerns || []).map((item) => <p key={item}>• {item}</p>)}
                  </CardContent>
                </Card>
              </div>
              <Button onClick={runAnalysis}>Refresh AI Analysis</Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Matched Jobs</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {matches.map((match) => (
            <div key={match._id} className="flex items-center justify-between rounded-lg border border-line bg-base/60 px-3 py-2">
              <span>{match.jobId?.title || 'Job'}</span>
              <Badge tone="accent">{match.matchScore}%</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageMotion>
  );
}
