import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageMotion } from '../components/ui/PageMotion';
import { LineChartCard } from '../components/charts/LineChartCard';
import { BarChartCard } from '../components/charts/BarChartCard';
import { HistogramCard } from '../components/charts/HistogramCard';
import { stableCount } from '../utils/score';

const lineData = [
  // TODO: replace with API call
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 58 },
  { name: 'Wed', value: 61 },
  { name: 'Thu', value: 74 },
  { name: 'Fri', value: 81 },
  { name: 'Sat', value: 63 },
  { name: 'Sun', value: 70 },
];

const barData = [
  // TODO: replace with API call
  { name: 'React', value: 38 },
  { name: 'Node', value: 52 },
  { name: 'SQL', value: 30 },
  { name: 'AWS', value: 27 },
  { name: 'Python', value: 42 },
];

const histogramData = [
  // TODO: replace with API call
  { range: '0-20', count: 8 },
  { range: '21-40', count: 16 },
  { range: '41-60', count: 24 },
  { range: '61-80', count: 36 },
  { range: '81-100', count: 20 },
];

const heatmapSkills = ['React', 'Node', 'SQL', 'AWS', 'Docker'];
const heatmapRows = ['Frontend Dev', 'Backend Dev', 'Full Stack', 'Data Engineer'];

export default function Analytics() {
  const [range, setRange] = useState('30d');

  return (
    <PageMotion className="section-wrap space-y-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((item) => (
            <Button key={item} variant={range === item ? 'gradient' : 'ghost'} onClick={() => setRange(item)}>
              Last {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <LineChartCard title="Resumes Uploaded Over Time" data={lineData} />
        <BarChartCard title="Skill Distribution" data={barData} />
        <HistogramCard title="Match Score Distribution" data={histogramData} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skills Gap Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-center text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-2 text-left text-muted">Role \ Skill</th>
                  {heatmapSkills.map((skill) => (
                    <th key={skill} className="px-2 py-2 text-muted">{skill}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapRows.map((row) => (
                  <tr key={row} className="border-t border-line">
                    <td className="px-2 py-2 text-left text-sm">{row}</td>
                    {heatmapSkills.map((skill) => {
                      const gap = stableCount(`${row}-${skill}`, 0, 99);
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

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {['Senior Frontend Engineer', 'Backend Node Developer', 'Data Analyst'].map((job) => (
            <div key={job} className="flex items-center justify-between rounded-xl border border-line bg-base/60 px-3 py-2">
              <p>{job}</p>
              <Badge tone="accent">Quality Score {stableCount(job, 80, 99)}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageMotion>
  );
}
