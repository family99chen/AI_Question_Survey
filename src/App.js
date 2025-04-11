import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Result from './pages/Result';
import QuestionResult from './pages/QuestionResult';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result" element={<Result />} />
            <Route path="/question-result" element={<QuestionResult />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
