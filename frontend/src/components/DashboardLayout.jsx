import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  HiOutlineCloudUpload,
  HiOutlineChartBar,
  HiOutlineLightningBolt,
  HiOutlineCursorClick,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';

const menuItems = [
  { path: '/upload',  label: 'Upload Dataset',  icon: HiOutlineCloudUpload },
  { path: '/eda',     label: 'Explore Data',     icon: HiOutlineChartBar },
  { path: '/results', label: 'Results',          icon: HiOutlineLightningBolt },
  { path: '/predict', label: 'Predictions',      icon: HiOutlineCursorClick },
];

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const initials = user.email
    ? user.email.substring(0, 2).toUpperCase()
    : 'DP';

  return (
    <div style={styles.wrapper}>
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside style={{
        ...styles.sidebar,
        ...(sidebarOpen ? styles.sidebarOpen : {}),
      }}>
        {/* Logo */}
        <div style={styles.sidebarHeader}>
          <div style={styles.logoMark}>⚡</div>
          <span style={styles.logoText}>DataPilot AI</span>
        </div>

        {/* Nav items */}
        <nav style={styles.nav}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                }}
                onClick={() => setSidebarOpen(false)}
              >
                {isActive && <div style={styles.activeBar} />}
                <Icon size={20} style={{
                  color: isActive ? '#10B981' : '#6B7280',
                  flexShrink: 0,
                }} />
                <span style={{
                  color: isActive ? '#E5E7EB' : '#9CA3AF',
                  fontWeight: isActive ? '600' : '400',
                }}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

      
       {/* Bottom section */}
        <div style={styles.sidebarBottom}>
          <div style={styles.sidebarDivider} />
          <button style={styles.logoutBtnSidebar} onClick={handleLogout}>
            <HiOutlineLogout size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside> 
      

      {/* ── Main area ── */}
      <div style={styles.mainArea}>
        {/* Topbar */}
        <header style={styles.topbar}>
          <div style={styles.topbarLeft}>
            <button
              style={styles.hamburger}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
            </button>
            <h1 style={styles.pageTitle}>
              {menuItems.find(m => m.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div style={styles.topbarRight}>
            <span style={styles.userEmail}>{user.email || 'user@example.com'}</span>
            <div style={styles.avatar}>{initials}</div>
            {/*<button style={styles.logoutBtnTopbar} onClick={handleLogout}>
              Logout
            </button> */}
          </div>
        </header>

        {/* Content */}
        <main style={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}

/* ── Styles ── */
const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0B1220',
  },

  /* Overlay */
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 40,
  },

  /* Sidebar */
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: '260px',
    background: '#020617',
    borderRight: '1px solid #1F2937',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 50,
    transition: 'transform 0.3s ease',
  },
  sidebarOpen: {},

  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '24px 24px 32px',
  },
  logoMark: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #10B981, #059669)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#E5E7EB',
    letterSpacing: '-0.02em',
  },

  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '0 12px',
    flex: 1,
  },
  navItem: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  navItemActive: {
    background: 'rgba(16,185,129,0.08)',
  },
  activeBar: {
    position: 'absolute',
    left: '0',
    top: '6px',
    bottom: '6px',
    width: '3px',
    borderRadius: '0 3px 3px 0',
    background: '#10B981',
  },

  sidebarBottom: {
    padding: '16px',
  },
  sidebarDivider: {
    height: '1px',
    background: '#1F2937',
    marginBottom: '16px',
  },
  logoutBtnSidebar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 16px',
    background: 'transparent',
    border: '1px solid #1F2937',
    borderRadius: '8px',
    color: '#9CA3AF',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  /* Main area */
  mainArea: {
    marginLeft: '260px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },

  /* Topbar */
  topbar: {
    height: '64px',
    background: '#0F172A',
    borderBottom: '1px solid #1F2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    position: 'sticky',
    top: 0,
    zIndex: 30,
  },
  topbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#9CA3AF',
    cursor: 'pointer',
    padding: '4px',
  },
  pageTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#E5E7EB',
    letterSpacing: '-0.01em',
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userEmail: {
    fontSize: '13px',
    color: '#9CA3AF',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10B981, #059669)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: '#fff',
  },
  logoutBtnTopbar: {
    background: 'transparent',
    border: '1px solid #1F2937',
    color: '#9CA3AF',
    padding: '6px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },

  /* Content */
  content: {
    flex: 1,
    padding: '32px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  },
};

/* ── Responsive — inject media query via style tag ── */
if (typeof document !== 'undefined') {
  const styleId = 'dashboard-layout-responsive';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @media (max-width: 768px) {
        [data-sidebar] {
          transform: translateX(-100%);
        }
        [data-sidebar].open {
          transform: translateX(0);
        }
        [data-main] {
          margin-left: 0 !important;
        }
        [data-hamburger] {
          display: flex !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}
