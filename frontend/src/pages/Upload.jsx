import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CloudUpload, Trash2 } from 'lucide-react';
import { candidatesApi } from '../api/candidates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageMotion } from '../components/ui/PageMotion';
import { useToast } from '../components/ui/Toast';

export default function Upload() {
  const { push, loading, update } = useToast();
  const [files, setFiles] = useState([]);

  const onSelect = (incomingFiles) => {
    const normalized = Array.from(incomingFiles)
      .filter((file) => {
        if (file.size > 100 * 1024 * 1024) {
          push('Upload failed. File exceeds limit.', 'error');
          return false;
        }
        return true;
      })
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        status: 'Queued',
        progress: 0,
        candidateId: '',
      }));
    setFiles((prev) => [...prev, ...normalized]);
  };

  const updateFile = (id, patch) => {
    setFiles((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const uploadAll = async () => {
    for (const item of files) {
      if (item.status === 'Done') continue;
      updateFile(item.id, { status: 'Parsing', progress: 5 });
      const formData = new FormData();
      formData.append('resume', item.file);
      const toastId = loading('Parsing resume...');
      try {
        const response = await candidatesApi.upload(formData, (event) => {
          const progress = Math.round((event.loaded / (event.total || 1)) * 100);
          updateFile(item.id, { progress });
        });
        updateFile(item.id, {
          status: 'Done',
          progress: 100,
          candidateId: response.data.candidate?._id || '',
        });
        update(toastId, {
          render: 'Resume uploaded and parsed successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      } catch {
        updateFile(item.id, { status: 'Error', progress: 0 });
        update(toastId, {
          render: 'Upload failed. Please check the file format.',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  };

  const hasFiles = useMemo(() => files.length > 0, [files]);

  return (
    <PageMotion className="section-wrap space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold">Upload Candidate Resumes</h1>
        <p className="mt-1 text-sm text-muted">
          Supports all file formats. We&apos;ll extract and structure everything automatically.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resume Upload</CardTitle>
          <CardDescription>Drop resumes here or click to browse</CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-line bg-base/60 p-14 text-center hover:border-accentStart">
            <CloudUpload className="h-8 w-8 text-primary" />
            <p className="text-sm text-muted">Drop resumes here or click to browse</p>
            <p className="text-xs text-muted">Max file size: 100MB per file</p>
            <input
              type="file"
              accept="*"
              multiple
              className="hidden"
              onChange={(event) => onSelect(event.target.files || [])}
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File Queue</CardTitle>
          <CardDescription>Review selected files, then start parsing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!files.length ? (
            <div className="rounded-xl border border-dashed border-line bg-base/50 p-6 text-center">
              <p className="text-sm text-muted">No files queued yet. Add resumes to begin parsing.</p>
            </div>
          ) : null}
          {files.map((item) => (
            <div key={item.id} className="rounded-xl border border-line bg-base/60 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{item.file.name}</p>
                  <p className="text-xs text-muted">{(item.file.size / 1024).toFixed(1)} KB</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={item.status === 'Done' ? 'success' : item.status === 'Error' ? 'danger' : 'info'}>{item.status}</Badge>
                  <button
                    className="rounded-lg border border-line p-2 hover:bg-white/5"
                    onClick={() => setFiles((prev) => prev.filter((file) => file.id !== item.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <progress max="100" value={item.progress} className="mt-2 h-2 w-full" />
              {item.candidateId ? (
                <Link to={`/candidates/${item.candidateId}`} className="mt-2 inline-block text-xs text-primary">
                  View parsed candidate
                </Link>
              ) : null}
            </div>
          ))}
          <Button variant="gradient" onClick={uploadAll} disabled={!hasFiles}>Upload Resumes</Button>
        </CardContent>
      </Card>
    </PageMotion>
  );
}
