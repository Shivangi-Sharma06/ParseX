import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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
import { getDemoJobs } from '../utils/demoData';

export default function Jobs() {
  const { jobs, refetch } = useJobs();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [addingSamples, setAddingSamples] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', requiredSkills: [], experienceRequired: '' });

  const resetForm = () => {
    setForm({ title: '', description: '', requiredSkills: [], experienceRequired: '' });
    setSkillInput('');
    setEditingJobId('');
  };

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
    const payload = {
      title: form.title,
      description: form.description,
      requiredSkills: form.requiredSkills,
    };

    try {
      if (editingJobId) {
        await jobsApi.update(editingJobId, payload);
        push('Job updated successfully.', 'success');
      } else {
        await jobsApi.create(payload);
        push('Job requirement saved.', 'success');
      }
      setOpen(false);
      resetForm();
      await refetch();
    } catch {
      push('Failed to save job. Please try again.', 'error');
    }
  };

  const onDeleteJob = async (jobId) => {
    try {
      await jobsApi.remove(jobId);
      push('Job removed.', 'success');
      refetch();
    } catch (error) {
      push(error.response?.data?.message || 'Something went wrong.', 'error');
    }
  };

  const onEditJob = (job) => {
    setEditingJobId(job._id);
    setForm({
      title: job.title || '',
      description: job.description || '',
      requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills : [],
      experienceRequired: '',
    });
    setOpen(true);
  };

  const jobsList = useMemo(() => jobs || [], [jobs]);
  const sampleJobs = getDemoJobs().map((job) => ({
    title: job.title,
    description: job.description,
    requiredSkills: job.requiredSkills,
  }));

  const addSampleJobs = async () => {
    setAddingSamples(true);
    try {
      if (jobsList.some((job) => job.isDemo)) {
        push('Demo jobs are already loaded.', 'info');
        return;
      }

      const existingTitles = new Set(
        jobsList.map((job) => String(job.title || '').trim().toLowerCase()).filter(Boolean),
      );

      const jobsToCreate = sampleJobs.filter(
        (job) => !existingTitles.has(String(job.title || '').trim().toLowerCase()),
      );

      if (!jobsToCreate.length) {
        push('Sample jobs are already available.', 'info');
        return;
      }

      await Promise.all(jobsToCreate.map((job) => jobsApi.create(job)));
      await refetch();
      push(`${jobsToCreate.length} sample jobs added.`, 'success');
    } catch (error) {
      push(error.response?.data?.message || 'Backend not reachable. Showing demo jobs.', 'info');
    } finally {
      setAddingSamples(false);
    }
  };

  return (
    <PageMotion className="section-wrap space-y-6 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Job Requirements</h1>
          <p className="mt-1 text-sm text-muted">Define the skills and criteria for your open roles.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="gradient"
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Job Requirement
          </Button>
          <Button variant="ghost" onClick={addSampleJobs} disabled={addingSamples}>
            {addingSamples ? 'Loading...' : 'Load Sample Jobs'}
          </Button>
        </div>
      </div>

      {!jobsList.length ? (
        <Card>
          <CardContent className="rounded-xl border border-dashed border-line bg-base/50 p-8 text-center">
            <p className="text-sm text-muted">No jobs posted yet. Create one to begin matching.</p>
            <div className="mt-4 flex gap-2 justify-center">
              <Button
                variant="gradient"
                onClick={() => {
                  resetForm();
                  setOpen(true);
                }}
              >
                Add Job Requirement
              </Button>
              <Button variant="ghost" onClick={addSampleJobs} disabled={addingSamples}>
                {addingSamples ? 'Loading...' : 'Load Sample Jobs'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobsList.map((job) => (
            <Card key={job._id} className="bg-surface/95 hover:shadow-glow">
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
                  <span>{job.isDemo ? 'Demo' : 'Active'}</span>
                </div>
                <div className="flex gap-2">
                  {job.isDemo ? (
                    <Button className="w-full" disabled>Demo Job</Button>
                  ) : (
                    <Link to={`/jobs/${job._id}/match`} className="flex-1"><Button className="w-full">Run Matching Engine</Button></Link>
                  )}
                  <Button variant="ghost" onClick={() => onEditJob(job)} aria-label="Edit Job" disabled={job.isDemo}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="danger" onClick={() => onDeleteJob(job._id)} disabled={job.isDemo}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        title={editingJobId ? 'Edit Job Requirement' : 'Add Job Requirement'}
      >
        <div className="space-y-3">
          <Input
            placeholder="e.g. Senior Frontend Engineer"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <textarea
            className="field-surface min-h-24 px-3 py-2"
            placeholder="Describe the role, responsibilities, and must-have qualifications."
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Add required skill and click Add"
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
          <Button variant="gradient" className="w-full" onClick={onSave}>
            {editingJobId ? 'Save Job Updates' : 'Save Job Requirement'}
          </Button>
        </div>
      </Dialog>
    </PageMotion>
  );
}
