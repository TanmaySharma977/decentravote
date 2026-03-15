import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useElection } from '../hooks/useElection';
import ElectionCard from '../components/voter/ElectionCard';

const VoterDashboard = () => {
  const { user } = useAuth();
  const { elections, loading, fetchElections } = useElection();

  useEffect(() => { fetchElections(); }, [fetchElections]);

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Welcome, {user?.name} 👋</h1>
          <p className="page__subtitle">Browse elections and cast your vote securely on-chain.</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="tab-bar">
        {['All', 'Active', 'Upcoming', 'Closed'].map((tab) => (
          <button
            key={tab}
            className="tab-bar__tab"
            onClick={() => fetchElections(tab === 'All' ? {} : { status: tab.toLowerCase() })}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="elections-grid">
          {elections.map((e) => <ElectionCard key={e._id} election={e} />)}
          {elections.length === 0 && (
            <p className="empty-state">No elections available right now. Check back soon.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VoterDashboard;
