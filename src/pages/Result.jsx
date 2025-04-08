import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AIFeedback from '../components/AIFeedback';
import './Result.css';
import { analyzeFormData } from '../Function/AIAnalysis';

const Result = () => {
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const particlesRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const data = localStorage.getItem('surveyData');
    if (data) {
      const parsedData = JSON.parse(data);
      setSurveyData(parsedData);
    }
  }, []);

  const handleRegenerate = async (instruction) => {
    if (!surveyData || isRegenerating) return;
    
    setIsRegenerating(true);
    setAiResponse(''); // 清空当前响应
    
    try {
      await analyzeFormData(surveyData.formData, (partialResponse) => {
        setAiResponse(partialResponse);
      }, instruction);
    } catch (error) {
      console.error('重新生成失败:', error);
      // 可以添加错误提示
    } finally {
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(97, 218, 251, ${Math.random() * 0.5 + 0.2})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const connectParticles = () => {
      const maxDistance = 150;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.strokeStyle = `rgba(97, 218, 251, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const createParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      connectParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particles = [];
    };
  }, []);

  return (
    <div className="ai-result-container">
      <canvas ref={particlesRef} className="ai-particles-bg"></canvas>
      {!surveyData ? (
        <div className="ai-loading">加载中...</div>
      ) : (
        <div className="ai-result-card">
          <h1 className="ai-result-title">AI 智能分析报告</h1>
          <div className="ai-cyber-line"></div>
          
          <AIFeedback 
            aiAnalysis={aiResponse} 
            onRegenerate={handleRegenerate}
          />

          <button 
            className="ai-return-button"
            onClick={() => navigate('/')}
          >
            返回首页
          </button>
        </div>
      )}
    </div>
  );
};

export default Result;
