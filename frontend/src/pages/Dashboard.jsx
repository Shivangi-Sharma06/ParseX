import { Link } from 'react-router-dom';
import { Activity, ArrowUpRight, BriefcaseBusiness, Target, Trophy, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageMotion } from '../components/ui/PageMotion';
import { useAuth } from '../hooks/useAuth';
import { useCandidates } from '../hooks/useCandidates';
import { useJobs } from '../hooks/useJobs';
import { MOCK_ACTIVITY } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import { stableCount, stableScore } from '../utils/score';

export default function Dashboard() {
  const { user } = useAuth();
  const { candidates } = useCandidates();
  const { jobs } = useJobs();
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  const topMatchScore = candidates.length
    ? Math.max(...candidates.map((candidate) => candidate.mockScore || stableScore(candidate._id)))
    : 0;
  const shortlistedCount = Math.max(Math.floor(candidates.length * 0.3), 0);
  const hasActivity = candidates.length > 0 || jobs.length > 0;

  const metrics = [
    { label: 'Total Resumes Uploaded', value: candidates.length, icon: Upload },
    { label: 'Active Jobs', value: jobs.length, icon: BriefcaseBusiness },
    { label: 'Top Match Score Today', value: `${topMatchScore}%`, icon: Trophy },
    { label: 'Candidates Shortlisted', value: shortlistedCount, icon: Target },
  ];

  return (
    <PageMotion className="section-wrap space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.username || 'Recruiter'}</h1>
        <p className="mt-1 text-sm text-muted">Here&apos;s what&apos;s happening with your pipeline today.</p>
        <p className="mt-1 text-xs text-muted">{today}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="bg-surface/95 hover:shadow-glow">
            <CardContent className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">{metric.label}</p>
                <p className="mt-2 text-3xl font-bold">{metric.value}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-success"><ArrowUpRight className="h-3 w-3" />+12% this week</p>
              </div>
              <metric.icon className="h-5 w-5 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across uploads, jobs, and matching.</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasActivity ? (
              <div className="rounded-xl border border-dashed border-line bg-base/50 p-6 text-center">
                <p className="text-sm text-muted">No activity yet. Start by uploading a resume.</p>
              </div>
            ) : (
                <div className="space-y-3">
                  {MOCK_ACTIVITY.map((item) => (
                    <div
                      key={item.id}
                      className="hover-surface flex items-center justify-between rounded-xl border border-line bg-base/60 px-3 py-2"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-primary" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-xs text-muted">{item.time}</span>
                    </div>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/upload"><Button className="w-full" variant="gradient">Upload Resumes</Button></Link>
            <Link to="/jobs"><Button className="w-full">Add Job Requirement</Button></Link>
            <Link to="/candidates"><Button className="w-full" variant="ghost">View Shortlist</Button></Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
          <CardDescription>Track matching performance for your latest job requirements.</CardDescription>
        </CardHeader>
        <CardContent>
          {!jobs.length ? (
            <div className="rounded-xl border border-dashed border-line bg-base/50 p-6 text-center">
              <p className="text-sm text-muted">No jobs posted yet. Create one to begin matching.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-muted">
                  <tr>
                    <th className="pb-2">Job Title</th>
                    <th className="pb-2">Required Skills</th>
                    <th className="pb-2">Candidates Matched</th>
                    <th className="pb-2">Date Created</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.slice(0, 6).map((job) => (
                    <tr key={job._id} className="hover-surface border-t border-line transition-colors duration-200">
                      <td className="py-3 font-medium">{job.title}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {(job.requiredSkills || []).slice(0, 3).map((skill) => (
                            <Badge key={skill}>{skill}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-3">{stableCount(job._id, 1, 20)}</td>
                      <td className="py-3 text-muted">{formatDate(job.createdAt)}</td>
                      <td className="py-3"><Link to={`/jobs/${job._id}/match`} className="text-primary">View Match</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </PageMotion>
  );
}
