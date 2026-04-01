import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const res = await client.post(endpoint, { email, password });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            navigate('/upload');
        }
        catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
      <div style={styles.page}>
        {/* Background glow */}
        <div style={styles.glow} />
        <div style={styles.glow2} />

        <div style={styles.container}>
          {/* Back to landing */}
          <button style={styles.backBtn} onClick={() => navigate('/')}>
            ← Back to Home
          </button>

          <div style={styles.card}>
            {/* Logo */}
            <div style={styles.logoBox}>
              <span style={styles.logoIcon}>⚡</span>
            </div>
            <h1 style={styles.title}>DataPilot AI</h1>
            <p style={styles.subtitle}>
              {isLogin ? 'Welcome back — sign in to continue' : 'Create your account to get started'}
            </p>

            {/* Error */}
            {error && (
              <div style={styles.error}>
                <HiOutlineExclamationCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {/* Submit */}
            <button
              style={{
                ...styles.btn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? 'Please wait...'
                : isLogin ? 'Sign In' : 'Create Account'
              }
            </button>

            {/* Toggle */}
            <p style={styles.toggle}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span
                style={styles.link}
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
              >
                {isLogin ? 'Register' : 'Sign In'}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0B1220',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: '-200px',
    right: '-100px',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  glow2: {
    position: 'absolute',
    bottom: '-150px',
    left: '-100px',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  container: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '420px',
    padding: '0 20px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#6B7280',
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '24px',
    display: 'block',
    transition: 'color 0.2s',
    padding: 0,
  },
  card: {
    background: 'rgba(17,24,39,0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid #1F2937',
    borderRadius: '16px',
    padding: '40px 36px',
  },
  logoBox: {
    width: '52px',
    height: '52px',
    background: 'linear-gradient(135deg, #10B981, #059669)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: '0 0 30px rgba(16,185,129,0.2)',
  },
  logoIcon: {
    fontSize: '24px',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: '700',
    color: '#E5E7EB',
    marginBottom: '4px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: '28px',
    fontSize: '14px',
  },
  error: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    background: '#1C1017',
    borderLeft: '3px solid #EF4444',
    color: '#FCA5A5',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '13px',
    lineHeight: '1.5',
  },
  field: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    background: '#1E293B',
    border: '1.5px solid #1F2937',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#E5E7EB',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  btn: {
    width: '100%',
    padding: '12px',
    background: '#10B981',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
    transition: 'background 0.2s, box-shadow 0.2s',
    boxShadow: '0 0 20px rgba(16,185,129,0.15)',
  },
  toggle: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '13px',
    color: '#6B7280',
  },
  link: {
    color: '#10B981',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'color 0.2s',
  },
};

export default Login;