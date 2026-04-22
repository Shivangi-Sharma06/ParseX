import { Link } from 'react-router-dom';
import { Activity, ArrowUpRight, BriefcaseBusiness, Mail, Upload, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageMotion } from '../components/ui/PageMotion';
import { useAuth } from '../hooks/useAuth';
import { useCandidates } from '../hooks/useCandidates';
import { useJobs } from '../hooks/useJobs';
import { MOCK_ACTIVITY } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import { stableCount } from '../utils/score';

export default function Dashboard() {
  const { user } = useAuth();
  const { candidates } = useCandidates();
  const { jobs } = useJobs();
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  const metrics = [
    { label: 'Total Resumes', value: candidates.length, icon: Upload },
    { label: 'Candidates Matched', value: Math.max(candidates.length - 1, 0), icon: Users },
    { label: 'Jobs Active', value: jobs.length, icon: BriefcaseBusiness },
    { label: 'Emails Sent', value: Math.floor(candidates.length * 0.4), icon: Mail },
  ];

  return (
    <PageMotion className="section-wrap space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold">Good morning, {user?.username || 'Recruiter'}</h1>
        <p className="text-sm text-muted">{today}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="hover:shadow-glow">
            <CardContent className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">{metric.label}</p>
                <p className="mt-2 text-3xl font-bold">{metric.value}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-success"><ArrowUpRight className="h-3 w-3" />+12% this week</p>
              </div>
              <metric.icon className="h-5 w-5 text-accentStart" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-line bg-base/60 px-3 py-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-accentStart" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-xs text-muted">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/upload"><Button className="w-full" variant="gradient">Upload Resumes</Button></Link>
            <Link to="/jobs"><Button className="w-full">Create Job</Button></Link>
            <Link to="/candidates"><Button className="w-full" variant="ghost">View Candidates</Button></Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <tr key={job._id} className="border-t border-line">
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
                    <td className="py-3"><Link to={`/jobs/${job._id}/match`} className="text-accentStart">View Match</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageMotion>
  );
}
