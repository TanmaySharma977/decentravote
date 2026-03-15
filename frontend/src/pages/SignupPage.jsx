import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      toast.success(result.message || 'Registered! Awaiting admin approval.');
      navigate('/login');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="auth-card__icon">🗳️</span>
          <h1 className="auth-card__title">Create Account</h1>
          <p className="auth-card__subtitle">Join DecentraVote — your vote, secured on-chain</p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', key: 'name' },
            { id: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', key: 'email' },
            { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', key: 'password' },
            { id: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••', key: 'confirm' },
          ].map(({ id, label, type, placeholder, key }) => (
            <div className="form-group" key={id}>
              <label htmlFor={id}>{label}</label>
              <input
                id={id}
                className="input"
                type={type}
                required
                placeholder={placeholder}
                minLength={key === 'password' ? 8 : undefined}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}

          <button className="btn btn--primary btn--full" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
