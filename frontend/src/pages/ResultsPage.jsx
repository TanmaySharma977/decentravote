import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { useElection } from '../hooks/useElection';
import { formatTxHash } from '../utils/formatters';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const ResultsPage = () => {
  const { id } = useParams();
  const { getResults, loading } = useElection();
  const [data, setData] = useState(null);

  useEffect(() => {
    getResults(id).then((res) => {
      if (res.success) setData(res.data);
    });
  }, [id]);

  if (loading && !data) return <div className="spinner" style={{ margin: '4rem auto' }} />;
  if (!data) return <div className="page"><p className="empty-state">Results unavailable.</p></div>;

  const tally = data.offChainTally;
  const winner = [...tally].sort((a, b) => b.votes - a.votes)[0];
  const chartData = tally.map((c) => ({ name: c.candidate, votes: c.votes }));

  return (
    <div className="page page--narrow">
      <div className="results-header">
        <h1 className="page__title">{data.election.title}</h1>
        <span className="badge badge--gray">Closed</span>
      </div>

      <div className="results-summary">
        <div className="winner-card">
          <span className="winner-card__trophy">🏆</span>
          <div>
            <p className="winner-card__label">Winner</p>
            <p className="winner-card__name">{winner?.candidate || '—'}</p>
            <p className="winner-card__votes">{winner?.votes} votes</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-card__icon">🗳️</span>
          <span className="stat-card__value">{data.totalVotes}</span>
          <span className="stat-card__label">Total Votes</span>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 className="section-title">Vote Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
            />
            <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
              <LabelList dataKey="votes" position="top" fill="#94a3b8" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 className="section-title">Detailed Breakdown</h2>
        <table className="results-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Candidate</th>
              <th>Votes</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {[...tally]
              .sort((a, b) => b.votes - a.votes)
              .map((c, i) => (
                <tr key={c.onChainId} className={i === 0 ? 'results-table__winner' : ''}>
                  <td>{i + 1}</td>
                  <td>{c.candidate} {i === 0 && '🏆'}</td>
                  <td>{c.votes}</td>
                  <td>{data.totalVotes ? ((c.votes / data.totalVotes) * 100).toFixed(1) + '%' : '0%'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsPage;
