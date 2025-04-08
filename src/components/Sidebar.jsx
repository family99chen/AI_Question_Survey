import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="ai-topbar">
      <div className="ai-topbar-content">
        <Link to="/" className="ai-logo">
          <span className="ai-logo-text">AI问卷调查系统</span>
        </Link>
        
        <nav className="ai-nav-links">
          <Link 
            to="/" 
            className={`ai-nav-link ${location.pathname === '/' ? 'ai-active' : ''}`}
          >
            首页
          </Link>
          <Link 
            to="/result" 
            className={`ai-nav-link ${location.pathname === '/result' ? 'ai-active' : ''}`}
          >
            分析结果
          </Link>
          <Link 
            to="/about" 
            className={`ai-nav-link ${location.pathname === '/about' ? 'ai-active' : ''}`}
          >
            关于我们
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
