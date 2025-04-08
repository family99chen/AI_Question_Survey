import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import QuestionForm from '../components/QuestionForm';
import './Home.css';
import { analyzeFormData } from '../Function/AIAnalysis';
import config from '../config.json';

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const particlesRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });

    const canvas = particlesRef.current;
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
      requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      particles = [];
    };
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      setIsLoading(true);
      
      // 先存储初始数据
      localStorage.setItem('surveyData', JSON.stringify({
        formData,
        aiAnalysis: ''
      }));
      
      // 立即跳转到结果页面
      navigate('/result');
      
      // 在结果页面继续处理AI分析
      const aiAnalysis = await analyzeFormData(
        formData,
        (partialResponse) => {
          localStorage.setItem('surveyData', JSON.stringify({
            formData,
            aiAnalysis: partialResponse
          }));
        }
      );
    } catch (error) {
      console.error('Error processing form submission:', error);
      alert('提交失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-home-page">
      <canvas ref={particlesRef} className="ai-particles-bg"></canvas>
      
      <div className="ai-content-wrapper">
        <header className="ai-page-header">
          <h1 className="ai-gradient-text">AI 智能分析问卷</h1>
          <p className="ai-hero-description">
            使用先进的人工智能技术，为您提供深度数据分析和智能洞察
          </p>
        </header>

        <main className="ai-survey-container">
          <QuestionForm 
            onSubmit={handleFormSubmit} 
            DEV_MODE={config.app.dev_mode} 
          />
        </main>
      </div>
    </div>
  );
};

export default Home;