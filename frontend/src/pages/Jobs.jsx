import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { jobsApi } from '../api/jobs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { PageMotion } from '../components/ui/PageMotion';
import { useToast } from '../components/ui/Toast';
import { stableCount } from '../utils/score';

export default function Jobs() {
  const { jobs, refetch } = useJobs();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({ title: '', description: '', requiredSkills: [], experienceRequired: '' });

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    if (!form.requiredSkills.includes(skill)) {
      setForm((prev) => ({ ...prev, requiredSkills: [...prev.requiredSkills, skill] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setForm((prev) => ({ ...prev, requiredSkills: prev.requiredSkills.filter((item) => item !== skill) }));
  };

  const onSave = async () => {
    try {
      await jobsApi.create({
        title: form.title,
        description: form.description,
        requiredSkills: form.requiredSkills,
      });
      push('Job created successfully', 'success');
      setOpen(false);
      setForm({ title: '', description: '', requiredSkills: [], experienceRequired: '' });
      refetch();
    } catch (error) {
      push(error.response?.data?.message || 'Failed to create job', 'error');
    }
  };

  const onDeleteJob = async (jobId) => {
    try {
      await jobsApi.remove(jobId);
      push('Job deleted successfully', 'success');
      refetch();
    } catch (error) {
      push(error.response?.data?.message || 'Failed to delete job', 'error');
    }
  };

  const jobsList = useMemo(() => jobs || [], [jobs]);

  return (
    <PageMotion className="section-wrap space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Job Requirements</h1>
        <Button variant="gradient" onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Create New Job</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobsList.map((job) => (
          <Card key={job._id} className="hover:shadow-glow">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {(job.requiredSkills || []).map((skill) => <Badge key={skill}>{skill}</Badge>)}
              </div>
              <p className="text-sm text-muted">{job.description}</p>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{stableCount(job._id, 0, 20)} candidates matched</span>
                <span>Active</span>
              </div>
              <div className="flex gap-2">
                <Link to={`/jobs/${job._id}/match`} className="flex-1"><Button className="w-full">View Match</Button></Link>
                <Button variant="danger" onClick={() => onDeleteJob(job._id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Create Job">
        <div className="space-y-3">
          <Input placeholder="Job Title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
          <textarea
            className="focus-ring min-h-24 w-full rounded-xl border border-line bg-base px-3 py-2 text-sm"
            placeholder="Job Description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Add skill and press Add"
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button onClick={addSkill}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.requiredSkills.map((skill) => (
              <Badge key={skill} className="cursor-pointer" onClick={() => removeSkill(skill)}>{skill} ×</Badge>
            ))}
          </div>
          <Input
            type="number"
            placeholder="Experience required (years)"
            value={form.experienceRequired}
            onChange={(event) => setForm((prev) => ({ ...prev, experienceRequired: event.target.value }))}
          />
          <Button variant="gradient" className="w-full" onClick={onSave}>Save & Match</Button>
        </div>
      </Dialog>
    </PageMotion>
  );
}
