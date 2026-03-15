import { Link } from 'react-router-dom';
import { formatDate, timeLeft } from '../../utils/formatters';

const ElectionCard = ({ election }) => {
  const ended = new Date() > new Date(election.deadline);
  const statusColor = ended ? '#ef4444' : '#22c55e';
  const statusLabel = ended ? 'Ended' : 'Active';

  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>{election.title}</h3>
        <span style={{ background: `${statusColor}22`, color: statusColor, borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 600 }}>
          {statusLabel}
        </span>
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
        {election.description || 'No description'}
      </p>

      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
        🕐 {ended ? 'Ended' : `Closes in ${timeLeft(election.deadline)}`}
      </p>
      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1rem' }}>
        📅 Deadline: {formatDate(election.deadline)}
      </p>

      <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem' }}>
        👥 {election.candidates?.length || 0} candidates
      </p>

      <Link
        to={ended ? `/results/${election._id}` : `/elections/${election._id}`}
        className="btn btn--primary btn--sm"
        style={{ textDecoration: 'none', display: 'inline-block' }}
      >
        {ended ? 'View Results' : 'Vote Now'}
      </Link>
    </div>
  );
};

export default ElectionCard;