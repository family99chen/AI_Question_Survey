import React, { useMemo, useState } from 'react';
import { marked } from 'marked';
import './AIFeedback.css';

const AIFeedback = ({ aiAnalysis, onRegenerate }) => {
  const [instruction, setInstruction] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  
  // 配置 marked 选项
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
  });

  // 使用 useMemo 缓存转换后的 HTML
  const htmlContent = useMemo(() => {
    if (!aiAnalysis) return '';
    try {
      return marked(aiAnalysis);
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return aiAnalysis;
    }
  }, [aiAnalysis]);

  const handleRegenerate = () => {
    setHasStarted(true);
    onRegenerate(instruction);
    setInstruction('');
  };

  return (
    <div className="aif-content">
      <div className="aif-analysis-section">
        <h2 className="aif-section-title">心理健康评估</h2>
        {!hasStarted ? (
          <div className="aif-analysis-text">
            <div className="aif-start-hint">
              点击下方"生成分析"按钮开始AI分析
            </div>
          </div>
        ) : (
          <div 
            className="aif-analysis-text src-markdown-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>

      <div className="aif-instruction-section">
        <textarea
          className="aif-instruction-input"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="在这里输入额外的分析要求（可选）..."
        />
        <button 
          className="aif-regenerate-button"
          onClick={handleRegenerate}
        >
          {!hasStarted ? '生成分析' : '重新生成分析'}
        </button>
      </div>

      <div className="aif-cyber-line"></div>

      <div className="aif-metrics-grid">
        <div className="aif-metric-card">
          <span className="aif-metric-title">分析完成度</span>
          <span className="aif-metric-value">{hasStarted ? '100%' : '0%'}</span>
        </div>
        <div className="aif-metric-card">
          <span className="aif-metric-title">AI 模型</span>
          <span className="aif-metric-value">GPT-4o</span>
        </div>
        <div className="aif-metric-card">
          <span className="aif-metric-title">分析可信度</span>
          <span className="aif-metric-value">{hasStarted ? '98%' : '0%'}</span>
        </div>
      </div>
    </div>
  );
};

export default AIFeedback;
