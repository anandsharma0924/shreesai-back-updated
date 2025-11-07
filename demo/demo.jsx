import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assect/images/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Offcanvas, OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import { FaEnvelope, FaHome, FaBox, FaTags, FaSignOutAlt, FaUserCircle, FaMapMarkedAlt, FaShoppingCart, FaPhone, FaBell } from 'react-icons/fa';

const navLinks = [
  { to: '/AdminPanal', icon: <FaHome />, label: 'Dashboard' },
  { to: '/product', icon: <FaBox />, label: 'Product' },
  { to: '/categories', icon: <FaTags />, label: 'Categories' },
  { to: '/ContactEnquiry', icon: <FaEnvelope />, label: 'Enquiries' },
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  return (
    <div className="d-flex" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)', minHeight: '100vh', fontFamily: 'Poppins, Inter, sans-serif' }}>
      {/* Sidebar */}
      <Offcanvas show={showSidebar} onHide={handleCloseSidebar} responsive="lg" className="sidebar-offcanvas-glass position-relative">
        <Offcanvas.Header closeButton className="border-0 p-3 justify-content-center bg-transparent">
          <img src={logo} alt="logo" className="img-fluid" style={{ maxHeight: '40px' }} />
        </Offcanvas.Header>
        <Offcanvas.Body className="p-2 d-flex flex-column align-items-center gap-2 position-relative" style={{ minHeight: 'calc(100vh - 56px)' }}>
          <div className="w-100 d-flex flex-column align-items-center gap-1 mt-2">
            {navLinks.map((link) => (
              <OverlayTrigger key={link.to} placement="right" overlay={<Tooltip>{link.label}</Tooltip>}>
            <Link
                  to={link.to}
                  className={`sidebar-icon-glass d-flex align-items-center justify-content-center mb-1 ${location.pathname === link.to ? 'active' : ''}`}
              onClick={handleCloseSidebar}
            >
                  {link.icon}
            </Link>
              </OverlayTrigger>
            ))}
          </div>
          <div className="sidebar-logout-glass mt-auto mb-2 w-100 d-flex flex-column align-items-center">
            <OverlayTrigger placement="right" overlay={<Tooltip>Logout</Tooltip>}>
            <Link
              to="/AdminLogin"
                className="sidebar-icon-glass d-flex align-items-center justify-content-center logout-icon-glass"
              onClick={handleCloseSidebar}
            >
                <FaSignOutAlt />
            </Link>
            </OverlayTrigger>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Topbar */}
        <Navbar expand="lg" className="glass-topbar sticky-top px-2 px-md-4 py-2" style={{ zIndex: 1040 }}>
          <div className="d-flex align-items-center gap-2">
            <Navbar.Toggle aria-controls="sidebar" onClick={handleShowSidebar} className="d-lg-none" />
            <span className="fw-bold fs-5 text-dark">Admin Dashboard</span>
              </div>
          <div className="ms-auto d-flex align-items-center gap-3">
            <span className="notification-bell-glass position-relative">
              <FaBell className="fs-5" />
              <span className="bell-dot-glass"></span>
            </span>
            <Dropdown show={showUserMenu} onToggle={setShowUserMenu} align="end">
              <Dropdown.Toggle as="div" className="user-avatar-dropdown-glass">
                <div className="user-avatar-glass d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                  <div className="avatar-circle-glass">
                    <FaUserCircle className="text-white fs-4" />
            </div>
                  <div className="d-none d-md-block">
                    <div className="fw-semibold text-dark small">Admin User</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>Administrator</div>
                </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setShowUserMenu(false)}>Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => navigate('/AdminLogin')}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
        </Navbar>

        {/* Dashboard Content */}
        <div className="flex-grow-1 p-3 p-md-4">
            <div className="row g-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card dashboard-card-glass h-100" onClick={() => navigate('/uploadedProducts')}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center position-relative">
                  <div className="dashboard-icon-glass bg-gradient-blue mb-3">
                    <FaBox />
                  </div>
                  <div className="fw-bold mb-1">Uploaded Products</div>
                  <div className="dashboard-number-glass text-gradient-blue">156</div>
                  <svg className="card-bg-svg-glass" viewBox="0 0 200 60" fill="none"><ellipse cx="100" cy="30" rx="100" ry="30" fill="#e0e7ff" fillOpacity="0.15"/></svg>
                </div>
              </div>
                      </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card dashboard-card-glass h-100" onClick={() => navigate('/UploadLand')}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center position-relative">
                  <div className="dashboard-icon-glass bg-gradient-green mb-3">
                    <FaMapMarkedAlt />
                  </div>
                  <div className="fw-bold mb-1">Uploaded Land</div>
                  <div className="dashboard-number-glass text-gradient-green">89</div>
                  <svg className="card-bg-svg-glass" viewBox="0 0 200 60" fill="none"><ellipse cx="100" cy="30" rx="100" ry="30" fill="#d1fae5" fillOpacity="0.15"/></svg>
                </div>
              </div>
                      </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card dashboard-card-glass h-100" onClick={() => navigate('/totalProducts')}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center position-relative">
                  <div className="dashboard-icon-glass bg-gradient-yellow mb-3">
                    <FaShoppingCart />
                  </div>
                  <div className="fw-bold mb-1">Total Products</div>
                  <div className="dashboard-number-glass text-gradient-yellow">245</div>
                  <svg className="card-bg-svg-glass" viewBox="0 0 200 60" fill="none"><ellipse cx="100" cy="30" rx="100" ry="30" fill="#fffbe6" fillOpacity="0.15"/></svg>
                </div>
              </div>
                      </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card dashboard-card-glass h-100" onClick={() => navigate('/ProNumbers')}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center position-relative">
                  <div className="dashboard-icon-glass bg-gradient-purple mb-3">
                    <FaPhone />
                  </div>
                  <div className="fw-bold mb-1">Property Numbers</div>
                  <div className="dashboard-number-glass text-gradient-purple">1.2k</div>
                  <svg className="card-bg-svg-glass" viewBox="0 0 200 60" fill="none"><ellipse cx="100" cy="30" rx="100" ry="30" fill="#ede9fe" fillOpacity="0.15"/></svg>
                </div>
              </div>
                      </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card dashboard-card-glass h-100" onClick={() => navigate('/ContactEnquiry')}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center position-relative">
                  <div className="dashboard-icon-glass bg-gradient-pink mb-3">
                    <FaEnvelope />
                  </div>
                  <div className="fw-bold mb-1">Enquiries</div>
                  <div className="dashboard-number-glass text-gradient-pink">45</div>
                  <svg className="card-bg-svg-glass" viewBox="0 0 200 60" fill="none"><ellipse cx="100" cy="30" rx="100" ry="30" fill="#fce7f3" fillOpacity="0.15"/></svg>
                </div>
              </div>
            </div>
          </div>
      </div>

        {/* Google Fonts: Poppins */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      {/* CSS Styles */}
      <style>{`
          body, .glass-topbar, .dashboard-card-glass, .sidebar-offcanvas-glass {
            font-family: 'Poppins', 'Inter', sans-serif !important;
          }
          .sidebar-offcanvas-glass {
            min-width: 90px !important;
            max-width: 90px !important;
            padding-top: 0 !important;
            border-right: none !important;
            background: rgba(36, 39, 54, 0.65) !important;
            box-shadow: 2px 0 24px rgba(44,62,80,0.10);
            backdrop-filter: blur(16px);
            border-radius: 0 24px 24px 0;
            border-left: 4px solid #a5b4fc;
          }
          .sidebar-icon-glass {
            width: 54px;
            height: 54px;
            color: #bfc9da;
            font-size: 1.8rem;
            border-radius: 16px;
            transition: background 0.22s, color 0.22s, box-shadow 0.22s, border 0.22s;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2px;
            border: 2px solid transparent;
            background: rgba(255,255,255,0.08);
            box-shadow: 0 2px 8px rgba(36,39,54,0.08);
          }
          .sidebar-icon-glass.active, .sidebar-icon-glass:hover {
            background: rgba(99,102,241,0.18);
            color: #6366f1;
            border: 2px solid #6366f1;
            box-shadow: 0 4px 16px #6366f1a0;
          }
          .logout-icon-glass {
            color: #dc3545;
            background: rgba(255,255,255,0.08);
            border: 2px solid transparent;
          }
          .logout-icon-glass:hover {
            background: rgba(220,53,69,0.12);
            color: #fff;
            border: 2px solid #dc3545;
            box-shadow: 0 0 12px #dc3545a0;
          }
          .glass-topbar {
            background: rgba(255,255,255,0.75) !important;
            box-shadow: 0 2px 24px rgba(44,62,80,0.08) !important;
            backdrop-filter: blur(12px);
            border-bottom: 1.5px solid #e0e7ff;
          }
          .user-avatar-glass {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .avatar-circle-glass {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1 60%, #a5b4fc 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px #6366f1a0;
          }
          .notification-bell-glass {
            color: #6366f1;
            background: rgba(99,102,241,0.10);
            border-radius: 50%;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 0 2px 8px #6366f1a0;
            transition: background 0.18s;
          }
          .notification-bell-glass:hover {
            background: rgba(99,102,241,0.18);
          }
          .bell-dot-glass {
            position: absolute;
            top: 8px;
            right: 10px;
            width: 8px;
            height: 8px;
            background: #ef4444;
            border-radius: 50%;
            border: 2px solid #fff;
            box-shadow: 0 0 6px #ef4444a0;
          }
          .dashboard-card-glass {
            border: none;
            border-radius: 22px;
            box-shadow: 0 4px 32px rgba(99,102,241,0.10);
            transition: transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s, border 0.22s;
          cursor: pointer;
            background: rgba(255,255,255,0.55);
            backdrop-filter: blur(10px);
            border: 2.5px solid #e0e7ff;
            min-height: 230px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }
          .dashboard-card-glass:hover {
            transform: translateY(-8px) scale(1.04);
            box-shadow: 0 12px 48px #6366f1a0;
            border: 2.5px solid #6366f1;
            background: rgba(236,239,255,0.75);
          }
          .dashboard-icon-glass {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.2rem;
            color: #fff;
            margin-bottom: 10px;
            box-shadow: 0 2px 12px #6366f1a0;
            border: 3px solid #fff;
            z-index: 2;
          }
          .bg-gradient-blue {
            background: linear-gradient(135deg, #6366f1 60%, #a5b4fc 100%);
          }
          .bg-gradient-green {
            background: linear-gradient(135deg, #22d3ee 60%, #6ee7b7 100%);
          }
          .bg-gradient-yellow {
            background: linear-gradient(135deg, #fbbf24 60%, #fef08a 100%);
            color: #212529 !important;
          }
          .bg-gradient-purple {
            background: linear-gradient(135deg, #a78bfa 60%, #6366f1 100%);
          }
          .bg-gradient-pink {
            background: linear-gradient(135deg, #f472b6 60%, #fbcfe8 100%);
          }
          .dashboard-number-glass {
            font-size: 2.3rem;
            font-weight: 700;
            letter-spacing: -1px;
            margin-top: 6px;
            margin-bottom: 0;
            line-height: 1.1;
            z-index: 2;
          }
          .text-gradient-blue {
            background: linear-gradient(90deg, #6366f1 60%, #a5b4fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .text-gradient-green {
            background: linear-gradient(90deg, #22d3ee 60%, #6ee7b7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .text-gradient-yellow {
            background: linear-gradient(90deg, #fbbf24 60%, #fef08a 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .text-gradient-purple {
            background: linear-gradient(90deg, #a78bfa 60%, #6366f1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .text-gradient-pink {
            background: linear-gradient(90deg, #f472b6 60%, #fbcfe8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .card-bg-svg-glass {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60px;
            z-index: 1;
            pointer-events: none;
          }
          @media (max-width: 991px) {
            .sidebar-offcanvas-glass {
              min-width: 64px !important;
              max-width: 64px !important;
            }
            .sidebar-icon-glass {
              width: 40px;
              height: 40px;
              font-size: 1.2rem;
            }
            .dashboard-icon-glass {
              width: 36px;
              height: 36px;
              font-size: 1.2rem;
            }
            .dashboard-card-glass {
              min-height: 140px;
            }
          }
          @media (max-width: 576px) {
            .dashboard-card-glass {
              border-radius: 14px;
              min-height: 110px;
              padding: 0.5rem !important;
            }
            .dashboard-icon-glass {
              width: 28px;
              height: 28px;
              font-size: 1rem;
            }
            .dashboard-number-glass {
              font-size: 1.1rem !important;
            }
            .p-3, .p-md-4 {
              padding: 0.7rem !important;
            }
            .glass-topbar {
              position: sticky !important;
              top: 0;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default AdminPanel;