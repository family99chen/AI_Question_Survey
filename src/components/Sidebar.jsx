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
            to="/question-result" 
            className={`ai-nav-link ${location.pathname === '/question-result' ? 'ai-active' : ''}`}
          >
            问卷结果
          </Link>
          <Link 
            to="/result" 
            className={`ai-nav-link ${location.pathname === '/result' ? 'ai-active' : ''}`}
          >
            AI分析
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
