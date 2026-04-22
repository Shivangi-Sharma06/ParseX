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
  const { push } = useToast();
  const [files, setFiles] = useState([]);

  const onSelect = (incomingFiles) => {
    const normalized = Array.from(incomingFiles).map((file) => ({
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
        push(`Parsed ${item.file.name}`, 'success');
      } catch {
        updateFile(item.id, { status: 'Error', progress: 0 });
        push(`Failed parsing ${item.file.name}`, 'error');
      }
    }
  };

  const hasFiles = useMemo(() => files.length > 0, [files]);

  return (
    <PageMotion className="section-wrap space-y-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Resume Upload</CardTitle>
          <CardDescription>Drop PDF/DOCX files here or click to browse</CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-line bg-base/60 p-14 text-center hover:border-accentStart">
            <CloudUpload className="h-8 w-8 text-accentStart" />
            <p className="text-sm text-muted">Drop PDF/DOCX files here or click to browse</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
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
        </CardHeader>
        <CardContent className="space-y-3">
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
                <Link to={`/candidates/${item.candidateId}`} className="mt-2 inline-block text-xs text-accentStart">
                  View parsed candidate
                </Link>
              ) : null}
            </div>
          ))}
          <Button variant="gradient" onClick={uploadAll} disabled={!hasFiles}>Upload All</Button>
        </CardContent>
      </Card>
    </PageMotion>
  );
}
