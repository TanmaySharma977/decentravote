import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useElection = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchElections = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/elections');
      setElections(data);
    } catch {
      toast.error('Failed to load elections');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Returns the election data directly
  const fetchElection = useCallback(async (id) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/elections/${id}`);
      return data;
    } catch {
      toast.error('Failed to load election');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createElection = async (form) => {
    try {
      setLoading(true);
      const { data } = await api.post('/elections', {
        title:       form.title,
        description: form.description,
        candidates:  form.candidates,
        startTime:   new Date(form.startTime).toISOString(),
        deadline:    new Date(form.deadline).toISOString(),
      });
      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create election' };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Returns { hasVoted, record }
  const getVoteStatus = async (electionId) => {
  try {
    const { data } = await api.get(`/votes/status/${electionId}`);
    return {
      hasVoted: data.hasVoted,
      record: {
        candidateOnChainId: data.candidateOnChainId,
        txHash: data.txHash,
      },
    };
  } catch {
    return { hasVoted: false, record: null };
  }
};
  // ✅ Casts vote and returns { success, data }
  const castVote = async (electionId, candidateOnChainId) => {
    try {
      const { data } = await api.post('/votes', { electionId, candidateOnChainId });
      toast.success('Vote cast successfully! 🗳️');
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to cast vote';
      toast.error(message);
      return { success: false, message };
    }
  };

  // ✅ Returns { success, data: { election, offChainTally, totalVotes } }
  const getResults = async (id) => {
    try {
      const { data } = await api.get(`/votes/results/${id}`);
      // Build offChainTally from results array
      const totalVotes = data.results.reduce((sum, r) => sum + r.votes, 0);
      const offChainTally = data.results.map((r, i) => ({
        candidate:     r.name,
        votes:         r.votes,
        onChainId:     i,
      }));
      return { success: true, data: { election: data.election, offChainTally, totalVotes } };
    } catch {
      toast.error('Failed to load results');
      return { success: false };
    }
  };

  return { elections, loading, fetchElections, fetchElection, createElection, getVoteStatus, castVote, getResults };
};