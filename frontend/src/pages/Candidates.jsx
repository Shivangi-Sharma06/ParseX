import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, List, Search, Plus } from 'lucide-react';
import { useCandidates } from '../hooks/useCandidates';
import { candidatesApi } from '../api/candidates';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ScoreRing } from '../components/ui/ScoreRing';
import { initials, formatDate } from '../utils/formatters';
import { PageMotion } from '../components/ui/PageMotion';
import { stableScore } from '../utils/score';
import { useToast } from '../components/ui/Toast';
import { getDemoCandidates } from '../utils/demoData';

export default function Candidates() {
  const { candidates, loading, refetch } = useCandidates();
  const { push } = useToast();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [minScore, setMinScore] = useState(0);
  const [experience, setExperience] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return candidates.filter((candidate) => {
      const score = candidate.mockScore || stableScore(candidate._id);
      const matchesSearch = candidate.name?.toLowerCase().includes(search.toLowerCase());
      const matchesScore = score >= minScore;
      const matchesExperience =
        experience === 'all' ? true : (candidate.experience || '').toLowerCase().includes(experience.toLowerCase());
      return matchesSearch && matchesScore && matchesExperience;
    });
  }, [candidates, search, minScore, experience]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPageData = filtered.slice((page - 1) * pageSize, page * pageSize);
  const sampleCandidates = getDemoCandidates().map((candidate) => ({
    name: candidate.name,
    email: candidate.email,
    skills: candidate.skills,
    education: candidate.education,
    experience: candidate.experience,
  }));

  const addSampleCandidates = async () => {
    try {
      if (candidates.some((candidate) => candidate.isDemo)) {
        push('Demo candidates are already loaded.', 'info');
        return;
      }

      for (const candidate of sampleCandidates) {
        await candidatesApi.create(candidate);
      }
      push('Sample candidates added successfully!', 'success');
      await refetch();
    } catch (error) {
      push(error.response?.data?.message || 'Backend not reachable. Showing demo candidates.', 'info');
    }
  };

  if (!loading && candidates.length === 0) {
    return (
      <PageMotion className="section-wrap py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Candidate Pool</h1>
            <p className="mt-1 text-sm text-muted">
              All parsed candidates with extracted skills and experience.
            </p>
          </div>
          <Card className="border border-dashed">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted mb-4">No candidates yet. Upload resumes or load sample candidates to get started.</p>
              <div className="flex gap-2 justify-center">
                <Button variant="gradient" onClick={() => (window.location.href = '/upload')}>
                  Upload Resumes
                </Button>
                <Button variant="ghost" onClick={addSampleCandidates}>
                  Load Sample Candidates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageMotion>
    );
  }

  return (
    <PageMotion className="section-wrap space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold">Candidate Pool</h1>
        <p className="mt-1 text-sm text-muted">
          All parsed candidates with extracted skills and experience.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Candidate Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
              <Input
                className="pl-9"
                placeholder="Search by candidate name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          <Input
            type="number"
            min="0"
            max="100"
            value={minScore}
            onChange={(event) => setMinScore(Number(event.target.value))}
            placeholder="Minimum match score"
          />
          <select
            className="field-surface"
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
          >
            <option value="all">All Experience</option>
            <option value="0">Entry</option>
            <option value="1">1+ years</option>
            <option value="2">2+ years</option>
          </select>
          <div className="flex items-center gap-2">
            <Button variant={view === 'grid' ? 'gradient' : 'ghost'} onClick={() => setView('grid')}><LayoutGrid className="h-4 w-4" />Grid</Button>
            <Button variant={view === 'table' ? 'gradient' : 'ghost'} onClick={() => setView('table')}><List className="h-4 w-4" />Table</Button>
          </div>
        </CardContent>
      </Card>

      {view === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {currentPageData.map((candidate) => {
            const score = candidate.mockScore || stableScore(candidate._id);
            return (
              <Card key={candidate._id} className="bg-surface/95 hover:shadow-glow">
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 font-semibold">{initials(candidate.name)}</div>
                    <ScoreRing score={score} size="sm" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{candidate.name}</h3>
                    <p className="text-xs text-muted">{candidate.email || 'No email'}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(candidate.skills || []).slice(0, 3).map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                  <Link to={`/candidates/${candidate._id}`}><Button className="w-full">View Profile</Button></Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-muted">
                  <tr>
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Skills</th>
                    <th className="pb-2">Experience</th>
                    <th className="pb-2">Score</th>
                    <th className="pb-2">Date Added</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.map((candidate) => {
                    const score = candidate.mockScore || stableScore(candidate._id);
                    return (
                      <tr key={candidate._id} className="hover-surface border-t border-line transition-colors duration-200">
                        <td className="py-3">{candidate.name}</td>
                        <td className="py-3">{(candidate.skills || []).slice(0, 3).join(', ')}</td>
                        <td className="py-3">{candidate.experience || 'N/A'}</td>
                        <td className="py-3">
                          <progress max="100" value={score} className="h-2 w-24" />
                        </td>
                        <td className="py-3">{formatDate(candidate.createdAt)}</td>
                        <td className="py-3"><Link to={`/candidates/${candidate._id}`} className="text-primary">View Profile</Link></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-center gap-2">
        <Button variant="ghost" onClick={() => setPage((prev) => Math.max(1, prev - 1))}>Prev</Button>
        <Badge>{page} / {totalPages}</Badge>
        <Button variant="ghost" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>Next</Button>
      </div>
    </PageMotion>
  );
}
