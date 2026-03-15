import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useElection } from '../hooks/useElection';
import CandidateList from '../components/voter/CandidateList';
import CountdownTimer from '../components/shared/CountdownTimer';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const ElectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchElection, castVote, getVoteStatus } = useElection();

  const [election, setElection]     = useState(null);
  const [voteStatus, setVoteStatus] = useState({ hasVoted: false, record: null });
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // ← starts true

  useEffect(() => {
    const load = async () => {
  setPageLoading(true);
  console.log('Fetching election ID:', id);
  const e = await fetchElection(id);
  console.log('Election data returned:', e);
  if (e) {
    setElection(e);
    const status = await getVoteStatus(id);
    console.log('Vote status:', status);
    setVoteStatus(status);
    if (status.hasVoted) setSelectedId(status.record?.candidateOnChainId ?? null);
  }
  setPageLoading(false);
};
    load();
  }, [id]);

  if (pageLoading) return <div className="spinner" style={{ margin: '4rem auto' }} />;
  if (!election)   return <div className="page"><p className="empty-state">Election not found.</p></div>;

  return (
    <div className="page page--narrow">
      <div className="election-detail">
        <div className="election-detail__header">
          <h1 className="election-detail__title">{election.title}</h1>
          <span className={`badge badge--${election.status}`}>{election.status}</span>
        </div>

        {election.description && <p className="election-detail__desc">{election.description}</p>}

        <div className="election-detail__meta">
          <span>🗓 Start: {formatDate(election.startTime)}</span>
          <span>⏰ Deadline: {formatDate(election.deadline)}</span>
        </div>

        {election.status === 'active' && (
          <div className="election-detail__countdown">
            <p className="text-muted">Time remaining to vote:</p>
            <CountdownTimer deadline={election.deadline} />
          </div>
        )}

        {voteStatus.hasVoted && (
          <div className="alert alert--success">
            ✅ You have already voted in this election.
            {voteStatus.record?.txHash && (
              <span> Tx: <code>{voteStatus.record.txHash.slice(0, 18)}...</code></span>
            )}
          </div>
        )}

        <h2 className="section-title">Candidates</h2>
        <CandidateList
          candidates={election.candidates}
          selectedId={selectedId}
          onSelect={setSelectedId}
          hasVoted={voteStatus.hasVoted}
          disabled={voteStatus.hasVoted || election.status !== 'active'}
        />

        {!voteStatus.hasVoted && election.status === 'active' && (
          <button
            className="btn btn--primary btn--full"
            disabled={selectedId === null || submitting}
            onClick={async () => {
              if (selectedId === null) { toast.error('Please select a candidate'); return; }
              setSubmitting(true);
              const result = await castVote(id, selectedId);
              if (result.success) {
                setVoteStatus({ hasVoted: true, record: { candidateOnChainId: selectedId, txHash: result.data?.txHash } });
              }
              setSubmitting(false);
            }}
          >
            {submitting ? 'Submitting Vote...' : 'Cast Vote on Blockchain'}
          </button>
        )}

        {election.status === 'ended' && (
          <button className="btn btn--ghost btn--full" onClick={() => navigate(`/results/${id}`)}>
            View Results →
          </button>
        )}
      </div>
    </div>
  );
};

export default ElectionPage;