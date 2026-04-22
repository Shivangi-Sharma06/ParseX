import { useState } from 'react';
import { dashboardApi } from '../services/dashboardApi';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage('Select a resume file first.');
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      const response = await dashboardApi.uploadResume(formData);
      setMessage(`Parsed successfully: ${response.data.candidate.name}`);
      setFile(null);
      event.target.reset();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel">
      <h2>Upload Candidate Resume</h2>
      <p>Accepted formats: PDF, DOC, DOCX. The profile is parsed and stored automatically.</p>

      <form className="form" onSubmit={onSubmit}>
        <label>
          Resume file
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            required
          />
        </label>

        <button className="btn dark" type="submit" disabled={busy}>
          {busy ? 'Parsing...' : 'Upload & Parse'}
        </button>
      </form>

      {message ? <p className="status">{message}</p> : null}
    </section>
  );
}
