import api from '../../utils/api';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const PendingApprovals = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.filter(u => u.status === 'pending'));
    } catch {
      toast.error('Failed to load pending users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handle = async (id, action, reason = '') => {
    try {
      const url = `/admin/users/${id}/${action}`;
      const body = action === 'reject' ? { reason } : {};
      await api.patch(url, body);
      toast.success(`User ${action}d successfully`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      toast.error(`Failed to ${action} user`);
    }
  };

  if (loading) return <div className="spinner" />;
  if (users.length === 0) return <p className="empty-state">No pending approvals 🎉</p>;

  return (
    <div className="approvals-list">
      {users.map((u) => (
        <div key={u._id} className="approval-card">
          <div className="approval-card__info">
            <strong>{u.name}</strong>
            <span>{u.email}</span>
            <span className="text-muted">Registered {new Date(u.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="approval-card__actions">
            <button className="btn btn--success btn--sm" onClick={() => handle(u._id, 'approve')}>
              ✓ Approve
            </button>
            <button
              className="btn btn--danger btn--sm"
              onClick={() => {
                const reason = window.prompt('Rejection reason:') || 'No reason given';
                handle(u._id, 'reject', reason);
              }}
            >
              ✕ Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingApprovals;