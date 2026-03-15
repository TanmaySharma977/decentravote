import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useElection } from '../../hooks/useElection';
import toast from 'react-hot-toast';

const CreateElection = () => {
  const { createElection, loading } = useElection();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    deadline: '',
    candidates: [{ name: '', description: '' }, { name: '', description: '' }],
  });

  const updateCandidate = (i, field, value) => {
    const updated = [...form.candidates];
    updated[i] = { ...updated[i], [field]: value };
    setForm((prev) => ({ ...prev, candidates: updated }));
  };

  const addCandidate = () =>
    setForm((prev) => ({ ...prev, candidates: [...prev.candidates, { name: '', description: '' }] }));

  const removeCandidate = (i) =>
    setForm((prev) => ({ ...prev, candidates: prev.candidates.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.candidates.some((c) => !c.name.trim())) {
      toast.error('All candidates must have a name');
      return;
    }
    const result = await createElection(form);
    if (result.success) {
      toast.success('Election created!');
      navigate('/admin');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2 className="form-card__title">Create New Election</h2>

      <div className="form-group">
        <label>Title</label>
        <input className="input" required value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea className="input" rows={3} value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Start Time</label>
          <input className="input" type="datetime-local" required value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Deadline</label>
          <input className="input" type="datetime-local" required value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        </div>
      </div>

      <div className="form-group">
        <label>Candidates</label>
        {form.candidates.map((c, i) => (
          <div key={i} className="candidate-row">
            <input className="input" placeholder={`Candidate ${i + 1} name`} required
              value={c.name} onChange={(e) => updateCandidate(i, 'name', e.target.value)} />
            <input className="input" placeholder="Short description (optional)"
              value={c.description} onChange={(e) => updateCandidate(i, 'description', e.target.value)} />
            {form.candidates.length > 2 && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => removeCandidate(i)}>✕</button>
            )}
          </div>
        ))}
        <button type="button" className="btn btn--ghost btn--sm" onClick={addCandidate}>
          + Add Candidate
        </button>
      </div>

      <button className="btn btn--primary" type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Election'}
      </button>
    </form>
  );
};

export default CreateElection;
