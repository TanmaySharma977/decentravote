import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import PendingApprovals from '../components/admin/PendingApprovals';
import { useElection } from '../hooks/useElection';
import ElectionCard from '../components/voter/ElectionCard';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const { elections, fetchElections, loading } = useElection();

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data.data)).catch(() => { });
    fetchElections();
  }, [fetchElections]);

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Admin Dashboard</h1>
        <Link to="/admin/elections/create" className="btn btn--primary">
          + New Election
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          {[
            { label: 'Total Users', value: stats.total, icon: '👥' },
            { label: 'Pending', value: stats.pending, icon: '⏳' },
            { label: 'Approved', value: stats.approved, icon: '✅' },
            { label: 'Rejected', value: stats.rejected, icon: '❌' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="stat-card">
              <span className="stat-card__icon">{icon}</span>
              <span className="stat-card__value">{value}</span>
              <span className="stat-card__label">{label}</span>
            </div>
          ))}
        </div>
      )}

      <section>
        <h2 className="section-title">Pending Approvals</h2>
        <PendingApprovals />
      </section>

      <section>
        <h2 className="section-title">All Elections</h2>
        {loading ? <div className="spinner" /> : (
          <div className="elections-grid">
            {elections.map((e) => <ElectionCard key={e._id} election={e} />)}
            {elections.length === 0 && <p className="empty-state">No elections yet.</p>}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
