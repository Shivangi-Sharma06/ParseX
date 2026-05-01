import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Download, Mail, Star, Trash2 } from 'lucide-react';
import { candidatesApi } from '../api/candidates';
import { jobsApi } from '../api/jobs';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ScoreRing } from '../components/ui/ScoreRing';
import { PageMotion } from '../components/ui/PageMotion';
import { initials } from '../utils/formatters';
import { useToast } from '../components/ui/Toast';
import { getDemoCandidates, getDemoJobs } from '../utils/demoData';
import { stableScore } from '../utils/score';

const tabs = ['Overview', 'Skills', 'Experience', 'Education', 'AI Analysis'];

const buildDemoMatches = (candidate) => {
  const jobs = getDemoJobs();
  const candidateSkills = (candidate.skills || []).map((skill) => skill.toLowerCase());

  return jobs
    .map((job) => {
      const required = (job.requiredSkills || []).map((skill) => skill.toLowerCase());
      const matchedSkills = (job.requiredSkills || []).filter((skill) =>
        candidateSkills.some((candidateSkill) => candidateSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(candidateSkill)),
      );
      const score = required.length ? Math.round((matchedSkills.length / required.length) * 100) : stableScore(job._id);

      return {
        _id: `demo-match-${candidate._id}-${job._id}`,
        matchScore: score,
        matchedSkills,
        shortlisted: false,
        jobId: job,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};

export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [isGeneratingMatches, setIsGeneratingMatches] = useState(false);
  const isDemoProfile = String(id || '').startsWith('demo-candidate-');

  const load = useCallback(async () => {
    if (isDemoProfile) {
      const demoCandidate = getDemoCandidates().find((candidate) => candidate._id === id);

      if (demoCandidate) {
        setData({
          candidate: demoCandidate,
          matches: buildDemoMatches(demoCandidate),
        });
        return;
      }
    }

    try {
      const response = await candidatesApi.getById(id);
      setData(response.data);
    } catch {
      const demoCandidate = getDemoCandidates().find((candidate) => candidate._id === id);
      if (demoCandidate) {
        setData({
          candidate: demoCandidate,
          matches: buildDemoMatches(demoCandidate),
        });
      } else {
        push('Something went wrong.', 'error');
      }
    }
  }, [id, isDemoProfile, push]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const openResume = async () => {
    if (isDemoProfile) {
      push('Demo profile loaded. Resume file is not available in demo mode.', 'info');
      return;
    }

    try {
      const response = await candidatesApi.resume(id);
      const url = URL.createObjectURL(new Blob([response.data]));
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      push('Something went wrong.', 'error');
    }
  };

  const runAnalysis = async () => {
    if (isDemoProfile) {
      push('Demo analysis is already available.', 'info');
      return;
    }

    try {
      await candidatesApi.analyze(id, {});
      push('AI analysis refreshed', 'success');
      await load();
    } catch {
      push('Something went wrong.', 'error');
    }
  };

  const candidate = data?.candidate;
  const matches = data?.matches || [];
  const topMatch = matches[0];

  const ensureTopMatch = useCallback(async () => {
    if (topMatch?._id) {
      return topMatch;
    }

    if (isDemoProfile && candidate) {
      const demoMatches = buildDemoMatches(candidate);
      setData((prev) => ({
        ...(prev || {}),
        candidate,
        matches: demoMatches,
      }));
      return demoMatches[0] || null;
    }

    setIsGeneratingMatches(true);
    try {
      let jobs = [];
      try {
        const jobsResponse = await jobsApi.list();
        jobs = jobsResponse.data?.jobs || [];
      } catch {
        jobs = [];
      }

      if (!jobs.length) {
        for (const job of getDemoJobs().map((item) => ({
          title: item.title,
          description: item.description,
          requiredSkills: item.requiredSkills,
        }))) {
          await jobsApi.create(job);
        }

        const refreshedJobs = await jobsApi.list();
        jobs = refreshedJobs.data?.jobs || [];
      }

      await Promise.all(
        jobs.map((job) => jobsApi.runMatch(job._id).catch(() => null)),
      );

      const refreshedProfile = await candidatesApi.getById(id);
      setData(refreshedProfile.data);
      return refreshedProfile.data?.matches?.[0] || null;
    } catch {
      push('Unable to generate matches automatically.', 'error');
      return null;
    } finally {
      setIsGeneratingMatches(false);
    }
  }, [candidate, id, isDemoProfile, push, topMatch]);

  const shortlistTopMatch = async () => {
    const matchToUse = topMatch?._id ? topMatch : await ensureTopMatch();

    if (!matchToUse?._id) {
      push('No match available yet.', 'info');
      return;
    }

    if (isDemoProfile) {
      push('Demo candidate added to shortlist.', 'success');
      return;
    }

    try {
      await jobsApi.shortlist(matchToUse._id, { shortlisted: true });
      await load();
      push('Candidate added to shortlist.', 'success');
    } catch {
      push('Something went wrong.', 'error');
    }
  };

  const emailTopMatch = async () => {
    const matchToUse = topMatch?._id ? topMatch : await ensureTopMatch();

    if (!matchToUse?._id) {
      push('No match available yet.', 'info');
      return;
    }

    if (isDemoProfile) {
      push('Demo shortlist email sent.', 'success');
      return;
    }

    try {
      await jobsApi.emailMatch(matchToUse._id);
      await load();
      push('Shortlist email sent for top matched job', 'success');
    } catch {
      push('Something went wrong.', 'error');
    }
  };

  const deleteCandidate = async () => {
    if (isDemoProfile) {
      push('Demo candidate cannot be deleted.', 'info');
      return;
    }

    try {
      await candidatesApi.remove(id);
      push('Candidate removed.', 'info');
      navigate('/candidates');
    } catch {
      push('Something went wrong.', 'error');
    }
  };

  if (!candidate) {
    return <PageMotion className="section-wrap py-8"><Card><CardContent>Loading candidate profile...</CardContent></Card></PageMotion>;
  }

  const score = Math.max(...matches.map((m) => m.matchScore), 0);

  return (
    <PageMotion className="section-wrap space-y-6 py-8">
      <Link to="/candidates" className="text-sm text-primary">← Back to Candidate Pool</Link>

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
            <Button className="w-full" variant="gradient" onClick={shortlistTopMatch} disabled={isGeneratingMatches}>
              <Star className="h-4 w-4" />
              {isGeneratingMatches ? 'Generating Matches...' : 'Add to Shortlist'}
            </Button>
            <Button className="w-full" onClick={emailTopMatch} disabled={isGeneratingMatches}>
              <Mail className="h-4 w-4" />
              {isGeneratingMatches ? 'Generating Matches...' : 'Send Intro Email'}
            </Button>
            <Button className="w-full" variant="ghost" onClick={openResume}><Download className="h-4 w-4" />Download Original Resume</Button>
            <Button className="w-full" variant="danger" onClick={deleteCandidate}>
              <Trash2 className="h-4 w-4" />
              Delete Candidate
            </Button>
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
          {!matches.length && isGeneratingMatches ? (
            <p className="text-sm text-muted">Generating job matches for this candidate...</p>
          ) : !matches.length ? (
            <p className="text-sm text-muted">No match results yet. Use shortlist/email to auto-generate hardcoded job matches.</p>
          ) : (
            matches.map((match) => (
              <div key={match._id} className="space-y-2 rounded-lg border border-line bg-base/60 px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{match.jobId?.title || 'Job Requirement'}</span>
                  <Badge tone="accent">{match.matchScore}%</Badge>
                </div>
                <p className="text-xs text-muted">
                  {match.jobId?.description || 'Job profile description is not available for this match yet.'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(match.jobId?.requiredSkills || []).slice(0, 6).map((skill) => (
                    <Badge key={`${match._id}-${skill}`}>{skill}</Badge>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </PageMotion>
  );
}
