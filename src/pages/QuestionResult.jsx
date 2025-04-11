import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuestionResult.css';

const QuestionResult = () => {
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [questionOptions, setQuestionOptions] = useState({});
  const particlesRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const data = localStorage.getItem('surveyData');
    const options = localStorage.getItem('questionOptions');
    
    if (data) {
      const parsedData = JSON.parse(data);
      setSurveyData(parsedData);
    }
    
    if (options) {
      setQuestionOptions(JSON.parse(options));
    }
  }, []);

  // 背景动画效果
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

  // 开始编辑回答
  const startEdit = (index, currentValue) => {
    setEditingIndex(index);
    setEditValue(currentValue);
  };

  // 保存编辑后的回答
  const saveEdit = (index) => {
    if (!surveyData) return;
    
    const updatedFormData = [...surveyData.formData];
    updatedFormData[index] = {
      ...updatedFormData[index],
      answer: editValue
    };
    
    const updatedSurveyData = {
      ...surveyData,
      formData: updatedFormData
    };
    
    setSurveyData(updatedSurveyData);
    localStorage.setItem('surveyData', JSON.stringify(updatedSurveyData));
    setEditingIndex(null);
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingIndex(null);
  };

  // 获取问题类型和选项
  const getQuestionType = (questionText) => {
    if (!questionOptions || Object.keys(questionOptions).length === 0) {
      return { type: 'text', options: [] };
    }
    
    // 查找匹配的问题
    const questionKey = Object.keys(questionOptions).find(key => 
      questionText.includes(key) || key.includes(questionText)
    );
    
    if (!questionKey) return { type: 'text', options: [] };
    
    const options = questionOptions[questionKey];
    
    if (Array.isArray(options)) {
      return { 
        type: options.length > 3 ? 'select' : 'radio',
        options: options
      };
    }
    
    return { type: 'text', options: [] };
  };

  // 渲染编辑界面
  const renderEditInterface = (index, question) => {
    const { type, options } = getQuestionType(question);
    
    switch (type) {
      case 'select':
        return (
          <div className="qr-edit-container">
            <select 
              className="qr-edit-select"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
            >
              <option value="">-- 请选择 --</option>
              {options.map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
            <div className="qr-edit-actions">
              <button 
                className="qr-edit-button qr-save-button"
                onClick={() => saveEdit(index)}
              >
                保存
              </button>
              <button 
                className="qr-edit-button qr-cancel-button"
                onClick={cancelEdit}
              >
                取消
              </button>
            </div>
          </div>
        );
        
      case 'radio':
        return (
          <div className="qr-edit-container">
            <div className="qr-radio-group">
              {options.map((option, i) => (
                <label key={i} className="qr-radio-label">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={editValue === option}
                    onChange={() => setEditValue(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <div className="qr-edit-actions">
              <button 
                className="qr-edit-button qr-save-button"
                onClick={() => saveEdit(index)}
              >
                保存
              </button>
              <button 
                className="qr-edit-button qr-cancel-button"
                onClick={cancelEdit}
              >
                取消
              </button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="qr-edit-container">
            <input 
              type="text" 
              className="qr-edit-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
            />
            <div className="qr-edit-actions">
              <button 
                className="qr-edit-button qr-save-button"
                onClick={() => saveEdit(index)}
              >
                保存
              </button>
              <button 
                className="qr-edit-button qr-cancel-button"
                onClick={cancelEdit}
              >
                取消
              </button>
            </div>
          </div>
        );
    }
  };

  // 渲染问卷答案
  const renderQuestionAnswers = () => {
    if (!surveyData) return null;
    
    // 检查数据结构
    if (Array.isArray(surveyData.formData)) {
      // 数组格式的问卷数据
      return (
        <div className="qr-answers-container">
          <div className="qr-section-borderless">
            {surveyData.formData.map((item, index) => (
              <div className="qr-answer-card" key={index}>
                <div className="qr-question">{item.question}</div>
                
                {editingIndex === index ? (
                  renderEditInterface(index, item.question)
                ) : (
                  <div className="qr-answer-container">
                    <div className="qr-answer">{item.answer || '未填写'}</div>
                    <button 
                      className="qr-edit-icon" 
                      onClick={() => startEdit(index, item.answer)}
                      title="编辑回答"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (typeof surveyData.formData === 'object') {
      // 对象格式的问卷数据
      const { formData } = surveyData;
      
      // 基本信息部分
      const basicInfo = ['name', 'age', 'gender'].filter(key => formData[key]);
      
      return (
        <div className="qr-answers-container">
          {basicInfo.length > 0 && (
            <div className="qr-section">
              <h3 className="qr-section-title">基本信息</h3>
              {basicInfo.map(key => (
                <div className="qr-answer-item" key={key}>
                  <span className="qr-question">{formatQuestionKey(key)}:</span>
                  <span className="qr-answer">{formData[key] || '未填写'}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="qr-section">
            <h3 className="qr-section-title">问卷回答</h3>
            {Object.entries(formData)
              .filter(([key]) => !basicInfo.includes(key))
              .map(([key, value]) => (
                <div className="qr-answer-item" key={key}>
                  <span className="qr-question">{formatQuestionKey(key)}:</span>
                  <span className="qr-answer">{formatAnswer(value)}</span>
                </div>
              ))}
          </div>
        </div>
      );
    }
    
    return <div>无法显示问卷数据</div>;
  };
  
  // 格式化问题键名
  const formatQuestionKey = (key) => {
    // 将 camelCase 或 snake_case 转换为可读文本
    return key
      .replace(/([A-Z])/g, ' $1') // 在大写字母前添加空格
      .replace(/_/g, ' ') // 将下划线替换为空格
      .replace(/^\w/, c => c.toUpperCase()); // 首字母大写
  };
  
  // 格式化答案
  const formatAnswer = (value) => {
    if (value === true) return '是';
    if (value === false) return '否';
    if (Array.isArray(value)) return value.join(', ');
    return value;
  };

  return (
    <div className="qr-container">
      <canvas ref={particlesRef} className="qr-particles-bg"></canvas>
      
      {!surveyData ? (
        <div className="qr-loading">加载中...</div>
      ) : (
        <div className="qr-card">
          <h1 className="qr-title">问卷调查结果</h1>
          <div className="qr-cyber-line"></div>
          
          {renderQuestionAnswers()}
          
          <div className="qr-actions">
            <button 
              className="qr-button qr-primary-button"
              onClick={() => navigate('/result')}
            >
              查看 AI 分析
            </button>
            
            <button 
              className="qr-button qr-secondary-button"
              onClick={() => navigate('/')}
            >
              返回首页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionResult;
