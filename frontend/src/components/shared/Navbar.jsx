import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        <span className="navbar__logo">🗳️</span>
        <span>DecentraVote</span>
      </Link>

      {isAuthenticated && (
        <div className="navbar__links">
          {isAdmin ? (
            <>
              <Link to="/admin" className="navbar__link">Dashboard</Link>
              <Link to="/admin/elections/create" className="navbar__link">New Election</Link>
            </>
          ) : (
            <Link to="/dashboard" className="navbar__link">Elections</Link>
          )}
        </div>
      )}

      <div className="navbar__actions">
        {isAuthenticated ? (
          <div className="navbar__user">
            <span className="navbar__username">{user?.name}</span>
            <span className={`badge badge--${user?.role}`}>{user?.role}</span>
            <button className="btn btn--ghost btn--sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn--ghost btn--sm">Login</Link>
            <Link to="/signup" className="btn btn--primary btn--sm">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
