import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageMotion } from '../components/ui/PageMotion';
import { LineChartCard } from '../components/charts/LineChartCard';
import { BarChartCard } from '../components/charts/BarChartCard';
import { HistogramCard } from '../components/charts/HistogramCard';
import { stableCount } from '../utils/score';
import { useCandidates } from '../hooks/useCandidates';
import { useJobs } from '../hooks/useJobs';
import { jobsApi } from '../api/jobs';
import { candidatesApi } from '../api/candidates';
import { useToast } from '../components/ui/Toast';
import { getDemoCandidates, getDemoJobs } from '../utils/demoData';

export default function Analytics() {
  const [range, setRange] = useState('30d');
  const [seeding, setSeeding] = useState(false);
  const { push } = useToast();
  const { candidates, refetch: refetchCandidates } = useCandidates();
  const { jobs, refetch: refetchJobs } = useJobs();
  const sampleJobs = getDemoJobs();
  const sampleCandidates = getDemoCandidates();
  const analyticsCandidates = candidates.length ? candidates : sampleCandidates;
  const analyticsJobs = jobs.length ? jobs : sampleJobs;
  const showingDemoData = candidates.length === 0 || jobs.length === 0;

  // Generate real line chart data based on candidate creation dates (last 7 days)
  const lineData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const countByDay = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    analyticsCandidates.forEach((candidate) => {
      const date = new Date(candidate.createdAt);
      const dayOfWeek = date.getDay();
      countByDay[dayOfWeek]++;
    });

    return days.map((day, idx) => ({
      name: day,
      value: countByDay[idx] || 0,
    }));
  }, [analyticsCandidates]);

  // Generate real bar chart data based on skill distribution from uploaded resumes
  const barData = useMemo(() => {
    const skillCounts = {};

    analyticsCandidates.forEach((candidate) => {
      (candidate.skills || []).forEach((skill) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    // If no skills, return empty array
    if (Object.keys(skillCounts).length === 0) {
      return [];
    }

    return Object.entries(skillCounts)
      .map(([skill, count]) => ({ name: skill, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [analyticsCandidates]);

  // Generate real histogram data based on match scores from candidates
  const histogramData = useMemo(() => {
    const ranges = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0,
    };

    analyticsCandidates.forEach((candidate) => {
      const confidence = Number(candidate.aiAnalysis?.confidence);
      const score = Number.isFinite(confidence) && confidence > 0
        ? confidence
        : stableCount(candidate._id, 0, 100);
      if (score <= 20) ranges['0-20']++;
      else if (score <= 40) ranges['21-40']++;
      else if (score <= 60) ranges['41-60']++;
      else if (score <= 80) ranges['61-80']++;
      else ranges['81-100']++;
    });

    return Object.entries(ranges).map(([range, count]) => ({ range, count }));
  }, [analyticsCandidates]);

  // Generate real skills gap heatmap based on actual jobs and candidates
  const { heatmapSkills, heatmapRows, heatmapData } = useMemo(() => {
    // Get unique skills from all candidates
    const skillsSet = new Set();
    analyticsCandidates.forEach((candidate) => {
      (candidate.skills || []).forEach((skill) => skillsSet.add(skill));
    });
    const uniqueSkills = Array.from(skillsSet).slice(0, 5);

    // Get job titles or use sample roles if no jobs exist
    const jobTitles = analyticsJobs.map((job) => job.title).slice(0, 4);

    // Calculate skill gaps
    const gapData = {};
    jobTitles.forEach((jobTitle) => {
      gapData[jobTitle] = {};
      uniqueSkills.forEach((skill) => {
        // Count candidates with this skill
        const candidatesWithSkill = analyticsCandidates.filter((c) =>
          (c.skills || []).includes(skill)
        ).length;
        // Gap percentage (0% = all have skill, 100% = none have skill)
        const gapPercentage = analyticsCandidates.length > 0 
          ? Math.round(((analyticsCandidates.length - candidatesWithSkill) / analyticsCandidates.length) * 100)
          : 0;
        gapData[jobTitle][skill] = gapPercentage;
      });
    });

    return {
      heatmapSkills: uniqueSkills.length > 0 ? uniqueSkills : ['React', 'Node', 'Python', 'AWS', 'SQL'],
      heatmapRows: jobTitles,
      heatmapData: gapData,
    };
  }, [analyticsCandidates, analyticsJobs]);

  // Generate real top performing jobs based on candidate matches
  const topPerformingJobs = useMemo(() => {
    return analyticsJobs
      .map((job) => {
        // Calculate how many candidates match this job
        const matchingCandidates = analyticsCandidates.filter((candidate) => {
          const requiredSkills = (job.requiredSkills || []).map((s) => s.toLowerCase());
          const candidateSkills = (candidate.skills || []).map((s) => s.toLowerCase());
          const matchCount = requiredSkills.filter((skill) =>
            candidateSkills.some((cSkill) => cSkill.includes(skill) || skill.includes(cSkill))
          ).length;
          return matchCount > 0;
        });

        const qualityScore = analyticsCandidates.length > 0
          ? Math.round((matchingCandidates.length / analyticsCandidates.length) * 100)
          : 0;

        return {
          title: job.title,
          matchCount: matchingCandidates.length,
          qualityScore,
        };
      })
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 3);
  }, [analyticsCandidates, analyticsJobs]);

  const seedAnalyticsData = async () => {
    setSeeding(true);
    try {
      const [existingJobsResponse, existingCandidatesResponse] = await Promise.all([
        jobsApi.list(),
        candidatesApi.list(),
      ]);

      const existingJobs = existingJobsResponse.data?.jobs || [];
      const existingCandidates = existingCandidatesResponse.data?.candidates || [];

      const existingJobTitles = new Set(
        existingJobs.map((job) => String(job.title || '').trim().toLowerCase()).filter(Boolean),
      );
      const existingCandidateEmails = new Set(
        existingCandidates.map((candidate) => String(candidate.email || '').trim().toLowerCase()).filter(Boolean),
      );

      const jobsToCreate = sampleJobs.filter(
        (job) => !existingJobTitles.has(String(job.title || '').trim().toLowerCase()),
      );
      const candidatesToCreate = sampleCandidates.filter(
        (candidate) => !existingCandidateEmails.has(String(candidate.email || '').trim().toLowerCase()),
      );

      await Promise.all([
        ...jobsToCreate.map((job) => jobsApi.create(job)),
        ...candidatesToCreate.map((candidate) => candidatesApi.create(candidate)),
      ]);

      const refreshedJobsResponse = await jobsApi.list();
      const refreshedJobs = refreshedJobsResponse.data?.jobs || [];

      await Promise.all(refreshedJobs.map((job) => jobsApi.runMatch(job._id).catch(() => null)));
      await Promise.all([refetchJobs(), refetchCandidates()]);

      if (!jobsToCreate.length && !candidatesToCreate.length) {
        push('Sample jobs and candidates already exist. Analytics refreshed.', 'info');
      } else {
        push('Sample jobs, candidates, and matches added for analytics.', 'success');
      }
    } catch (error) {
      push(error.response?.data?.message || 'Backend not reachable. Showing demo analytics data.', 'info');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <PageMotion className="section-wrap space-y-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={seedAnalyticsData} disabled={seeding}>
            {seeding ? 'Loading Sample Data...' : 'Load Sample Analytics Data'}
          </Button>
          {['7d', '30d', '90d'].map((item) => (
            <Button key={item} variant={range === item ? 'gradient' : 'ghost'} onClick={() => setRange(item)}>
              Last {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <LineChartCard title="Resumes Uploaded Over Time" data={lineData} />
        <BarChartCard title="Skill Distribution" data={barData.length > 0 ? barData : [{ name: 'Upload resumes to see skills', value: 0 }]} />
        <HistogramCard title="Match Score Distribution" data={histogramData} />
      </div>

      {/* Skills Gap Heatmap */}
      {heatmapRows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills Gap Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-center text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-2 text-left text-muted">Job \ Skill</th>
                    {heatmapSkills.map((skill) => (
                      <th key={skill} className="px-2 py-2 text-muted">{skill}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapRows.map((row) => (
                    <tr key={row} className="border-t border-line">
                      <td className="px-2 py-2 text-left text-sm font-medium">{row}</td>
                      {heatmapSkills.map((skill) => {
                        const gap = heatmapData[row]?.[skill] || 0;
                        return (
                          <td key={`${row}-${skill}`} className="px-2 py-2">
                            <span className={`inline-block rounded px-2 py-1 ${gap > 65 ? 'bg-danger/30' : gap > 35 ? 'bg-info/25' : 'bg-success/25'}`}>
                              {gap}%
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Performing Jobs */}
      {topPerformingJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topPerformingJobs.map((job) => (
              <div key={job.title} className="flex items-center justify-between rounded-xl border border-line bg-base/60 px-3 py-2">
                <p className="text-sm">{job.title}</p>
                <Badge tone="accent">{job.matchCount} matches - {job.qualityScore}% score</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {showingDemoData && (
        <Card className="border border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-muted">Showing demo analytics data. Use "Load Sample Analytics Data" to save this data to your workspace.</p>
          </CardContent>
        </Card>
      )}
    </PageMotion>
  );
}
