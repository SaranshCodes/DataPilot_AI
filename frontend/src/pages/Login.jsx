import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

function Login() {
    // useState stores data that changes when user types or clicks
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); // toggle login/register
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async () => {
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const res = await client.post(endpoint, { email, password });

            //Save token and user info to localStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            //Redirect to upload page
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
      <div style={styles.card}>

        {/* Logo + Title */}
        <div style={styles.logo}>🚀</div>
        <h1 style={styles.title}>DataPilot AI</h1>
        <p style={styles.subtitle}>
          {isLogin ? 'Welcome back' : 'Create your account'}
        </p>

        {/* Error message */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Email input */}
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

        {/* Password input */}
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

        {/* Submit button */}
        <button
          style={{...styles.btn, opacity: loading ? 0.7 : 1}}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
        </button>

        {/* Toggle between login and register */}
        <p style={styles.toggle}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            style={styles.link}
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>

      </div>
    </div>
  );
}

// Inline styles — no CSS file needed
const styles = {
  page     : { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' },
  card     : { background: '#fff', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  logo     : { fontSize: '40px', textAlign: 'center', marginBottom: '8px' },
  title    : { textAlign: 'center', fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' },
  subtitle : { textAlign: 'center', color: '#718096', marginBottom: '24px', fontSize: '14px' },
  error    : { background: '#fff5f5', color: '#c53030', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  field    : { marginBottom: '16px' },
  label    : { display: 'block', fontSize: '13px', fontWeight: '600', color: '#4a5568', marginBottom: '6px' },
  input    : { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  btn      : { width: '100%', padding: '12px', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  toggle   : { textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#718096' },
  link     : { color: '#3182ce', cursor: 'pointer', fontWeight: '600' },
};

export default Login;