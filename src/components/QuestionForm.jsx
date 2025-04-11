import React, { useState } from 'react';
import './QuestionForm.css';
import PropTypes from 'prop-types';

// 添加开发者模式常量
//const DEV_MODE = true; // 可以根据环境变量或其他配置来设置

const QuestionForm = ({ onSubmit, DEV_MODE = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;
  
  // 添加表单数据状态
  const [formData, setFormData] = useState({
    // 第一页
    age: '',
    gender: '',
    faculty: '',
    facultyOthers: '',
    year: '',
    studentType: '',
    
    // 第二页
    interest: '',
    depression: '',
    sleep: '',
    tired: '',
    appetite: '',
    
    // 第三页
    workload: '',
    performance: '',
    
    // 第四页
    satisfaction: '',
    loneliness: '',
    financialStress: '', // Q11
    sleepHours: '',     // Q12
    sleepHoursOthers: '', // Q12 其他选项
    exercise: '',       // Q13
    socialMediaHours: '',    // Q16
    socialMediaStress: '',    // Q17
    mentalHealthChallenge: '',    // Q14
    stressManagement: '',         // Q15
    anxietyDepression: '',         // Q19
    resourcesSufficient: '',  // Q20
    surveyClarity: '',    // Q24
    surveyLength: '',     // Q25
    suggestions: '',       // Q26
    email: ''  // Q28 可选的邮箱地址
  });

  // 添加调试日志
  const logFormData = (action) => {
    console.log(`[${action}] Form Data:`, formData);
  };

  // 处理表单数据变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log(`[Input Change - ${name}]`, newData);
      return newData;
    });
  };

  // 处理faculty选项变化
  const handleFacultyChange = (e) => {
    const { value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        faculty: value,
        facultyOthers: value === 'others' ? prev.facultyOthers : ''
      };
      console.log('[Faculty Change]', newData);
      return newData;
    });
  };

  // 处理 sleep hours 的特殊逻辑
  const handleSleepHoursChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      sleepHours: value,
      // 如果选择了非 others 选项，清空 others 输入
      sleepHoursOthers: value === 'others' ? prev.sleepHoursOthers : ''
    }));
  };

  const handleNext = () => {
    // 验证当前步骤
    if (!validateCurrentStep()) {
      return;
    }

    // 如果是最后一步，提交表单
    if (currentStep === totalSteps) {
      handleSubmit();
      return;
    }

    // 保存问题选项到 localStorage
    saveQuestionOptions();
    
    // 前进到下一步
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  // 添加保存问题选项的函数
  const saveQuestionOptions = () => {
    // 定义问卷问题选项 - 根据实际问卷内容修正
    const questionOptions = {
      // 第一页 - 基本信息
      "What is your age?": ["Under 18", "18-20", "21-23", "24+"],
      "What is your gender?": ["Male", "Female", "Non-binary/Third Gender", "Prefer not to say"],
      "Which faculty are you enrolled in?": ["Arts", "Business Administration", "Education", "Engineering", "Law", "Medicine", "Science", "Social Science", "Other"],
      "What is your current year of study?": ["Year 1 (undergraduate)", "Year 2 (undergraduate)", "Year 3 (undergraduate)", "Year 4+ (undergraduate)", "Postgraduate"],
      "Are you an international or local student?": ["International", "Local (Hong Kong)", "Mainland China"],
      
      // 第二页 - PHQ-9 相关问题
      "Little interest or pleasure in doing things?": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
      "Feeling down, depressed, or hopeless?": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
      "Trouble falling/staying asleep, or sleeping too much?": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
      "Feeling tired or having little energy?": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
      "Poor appetite or overeating?": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
      
      // 第三页 - 学术和社交
      "How often do you feel overwhelmed by academic workload?": ["Never", "Rarely", "Sometimes", "Often", "Always"],
      "Do you have concerns about your academic performance?": ["Never", "Rarely", "Sometimes", "Often", "Always"],
      "How satisfied are you with your social relationships at CUHK?": ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"],
      "Do you feel isolated or lonely on campus?": ["Never", "Rarely", "Sometimes", "Often", "Always"],
      "How much does financial stress affect your well-being?": ["Not at all", "Slightly", "Moderately", "Significantly", "Severely"],
      
      // 第四页 - 生活习惯和资源
      "How many hours do you sleep per night on average?": ["Less than 5", "5-6", "7-8", "9+", "Other"],
      "How often do you engage in physical exercise?": ["Never", "Rarely", "Sometimes", "Regularly", "Daily"],
      "On average, how many hours daily do you spend on social media?": ["Less than 1", "1-2", "3-4", "5+"],
      "How often do you feel stressed, anxious, or inadequate after using social media?": ["Never", "Rarely", "Sometimes", "Often", "Always"],
      "Have you experienced any mental health challenges during your time at university?": ["Yes", "No", "Not sure"],
      "What strategies do you use to manage stress?": ["Exercise", "Meditation", "Talking to friends", "Professional help", "Other"],
      "Do you think CUHK provides enough resources to help students with mental health?": ["Yes", "No", "Not sure"],
      "Survey clarity feedback": ["Very clear", "Somewhat clear", "Neutral", "Somewhat unclear", "Very unclear"],
      "Was the survey length appropriate?": ["Too short", "Just right", "Too long"]
    };
    
    localStorage.setItem('questionOptions', JSON.stringify(questionOptions));
  };

  const handlePrev = (e) => {
    e.preventDefault();
    logFormData('Before Previous');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      logFormData('After Previous');
    }
  };

  const formatFormDataForAI = (formData) => {
    const formattedData = [
      // 基本信息
      { question: "Q1. What is your age?", 
        answer: formData.age === 'under18' ? 'Under 18' :
                formData.age === '18-20' ? '18-20' :
                formData.age === '21-23' ? '21-23' : '24+' },
      
      { question: "Q2. What is your gender?",
        answer: formData.gender === 'female' ? 'Female' :
                formData.gender === 'male' ? 'Male' :
                formData.gender === 'non-binary' ? 'Non-binary/Third Gender' : 
                'Prefer not to say' },
      
      { question: "Q3. Which faculty are you enrolled in?",
        answer: formData.faculty === 'arts' ? 'Arts' :
                formData.faculty === 'business' ? 'Business Administration' :
                formData.faculty === 'engineering' ? 'Engineering' :
                formData.faculty === 'science' ? 'Science' :
                formData.faculty === 'law' ? 'Law' :
                formData.faculty === 'social-science' ? 'Social Science' :
                formData.faculty === 'education' ? 'Education' :
                formData.faculty === 'medicine' ? 'Medicine' :
                formData.faculty === 'others' ? formData.facultyOthers : 'Unknown' },
      
      { question: "Q4. What is your current year of study?",
        answer: formData.year === 'year1' ? 'Year 1 (undergraduate)' :
                formData.year === 'year2' ? 'Year 2 (undergraduate)' :
                formData.year === 'year3' ? 'Year 3 (undergraduate)' :
                formData.year === 'year4' ? 'Year 4 or above (undergraduate)' : 
                'Postgraduate' },
      
      { question: "Q5. Are you an international or local student?",
        answer: formData.studentType === 'local' ? 'Local (Hong Kong)' :
                formData.studentType === 'mainland' ? 'International (Mainland China)' :
                'International (Other)' },
      
      // PHQ-9 相关问题
      { question: "Q6a. Little interest or pleasure in doing things?",
        answer: formData.interest === '0' ? 'Not at all' :
                formData.interest === '1' ? 'Several days' :
                formData.interest === '2' ? 'More than half the days' :
                'Nearly every day' },
      
      { question: "Q6b. Feeling down, depressed, or hopeless?",
        answer: formData.depression === '0' ? 'Not at all' :
                formData.depression === '1' ? 'Several days' :
                formData.depression === '2' ? 'More than half the days' :
                'Nearly every day' },
      
      { question: "Q6c. Trouble falling/staying asleep, or sleeping too much?",
        answer: formData.sleep === '0' ? 'Not at all' :
                formData.sleep === '1' ? 'Several days' :
                formData.sleep === '2' ? 'More than half the days' :
                'Nearly every day' },
      
      { question: "Q6d. Feeling tired or having little energy?",
        answer: formData.tired === '0' ? 'Not at all' :
                formData.tired === '1' ? 'Several days' :
                formData.tired === '2' ? 'More than half the days' :
                'Nearly every day' },
      
      { question: "Q6e. Poor appetite or overeating?",
        answer: formData.appetite === '0' ? 'Not at all' :
                formData.appetite === '1' ? 'Several days' :
                formData.appetite === '2' ? 'More than half the days' :
                'Nearly every day' },
      
      // 学术和生活相关问题
      { question: "Q7. How often do you feel overwhelmed by academic workload?",
        answer: formData.workload },
      
      { question: "Q8. Do you have concerns about your academic performance?",
        answer: formData.performance },
      
      { question: "Q9. How satisfied are you with your social relationships at CUHK?",
        answer: formData.satisfaction },
      
      { question: "Q10. Do you feel isolated or lonely on campus?",
        answer: formData.loneliness },
      
      { question: "Q11. How much does financial stress affect your well-being?",
        answer: formData.financialStress },
      
      { question: "Q12. How many hours do you sleep per night on average?",
        answer: formData.sleepHours === 'others' ? formData.sleepHoursOthers : formData.sleepHours },
      
      { question: "Q13. How often do you engage in physical exercise?",
        answer: formData.exercise },
      
      { question: "Q14. What do you think is the biggest challenge affecting student mental health at CUHK?",
        answer: formData.mentalHealthChallenge },
      
      { question: "Q15. What resources or support would help you manage stress better?",
        answer: formData.stressManagement },
      
      { question: "Q16. On average, how many hours daily do you spend on social media?",
        answer: formData.socialMediaHours },
      
      { question: "Q17. How often do you feel stressed, anxious, or inadequate after using social media?",
        answer: formData.socialMediaStress },
      
      { question: "Q19. In your own words, how would you describe the difference between anxiety and depression?",
        answer: formData.anxietyDepression },
      
      { question: "Q20. Do you think CUHK provides enough resources to help students distinguish between and manage these conditions?",
        answer: formData.resourcesSufficient },
      
      // 调查反馈
      { question: "Q24. Survey clarity feedback",
        answer: formData.surveyClarity },
      
      { question: "Q25. Was the survey length appropriate?",
        answer: formData.surveyLength },
      
      { question: "Q26. Any suggestions to improve this survey?",
        answer: formData.suggestions }
    ];

    // 如果提供了邮箱，添加到格式化数据中
    if (formData.email) {
      formattedData.push({
        question: "Q28. Contact email (optional)",
        answer: formData.email
      });
    }

    return formattedData;
  };

  const handleSubmit = async (e) => {
    try {
      // 检查是否是表单提交事件
      if (e?.type === 'submit') {
        e.preventDefault();
      }
      
      logFormData('Before Submit');
      
      if (!DEV_MODE) {
        const allRequiredFields = [
          'age', 'gender', 'faculty', 'year', 'studentType',
          'interest', 'depression', 'sleep', 'tired', 'appetite',
          'workload', 'performance',
          'satisfaction', 'loneliness',
          'financialStress', 'sleepHours', 'exercise',
          'socialMediaHours', 'socialMediaStress',
          'mentalHealthChallenge', 'stressManagement', 'anxietyDepression',
          'resourcesSufficient',
          'surveyClarity', 'surveyLength', 'suggestions'
        ];
        
        const emptyFields = allRequiredFields.filter(field => {
          if (field === 'facultyOthers') {
            return formData.faculty === 'others' && !formData.facultyOthers;
          }
          if (field === 'sleepHoursOthers') {
            return formData.sleepHours === 'others' && !formData.sleepHoursOthers;
          }
          return !formData[field];
        });

        if (emptyFields.length > 0) {
          console.log('Missing fields on submit:', emptyFields);
          alert(`Please fill in all required fields: ${emptyFields.join(', ')}`);
          return;
        }

        if (formData.email && !validateEmail(formData.email)) {
          alert('Please enter a valid email address or leave it empty');
          return;
        }
      }

      const formattedData = formatFormDataForAI(formData);
      console.log('Formatted data for AI:', formattedData);
      
      if (typeof onSubmit === 'function') {
        await onSubmit(formattedData);
      } else {
        console.error('onSubmit is not a function');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  // 添加邮箱验证函数
  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // 组件挂载时记录初始状态
  React.useEffect(() => {
    logFormData('Initial Mount');
  }, []);

  // 当前步骤改变时记录状态
  React.useEffect(() => {
    logFormData(`Step Changed to ${currentStep}`);
  }, [currentStep]);

  // 添加验证当前步骤的函数
  const validateCurrentStep = () => {
    if (!DEV_MODE) {
      let isValid = true;
      let emptyFields = [];
      
      if (currentStep === 1) {
        const requiredFields = ['age', 'gender', 'faculty', 'year', 'studentType'];
        requiredFields.forEach(field => {
          if (!formData[field]) {
            isValid = false;
            emptyFields.push(field);
          }
        });
        
        if (formData.faculty === 'others' && !formData.facultyOthers) {
          isValid = false;
          emptyFields.push('facultyOthers');
        }
      } 
      else if (currentStep === 2) {
        const requiredFields = ['interest', 'depression', 'sleep', 'tired', 'appetite'];
        requiredFields.forEach(field => {
          if (!formData[field]) {
            isValid = false;
            emptyFields.push(field);
          }
        });
      }
      else if (currentStep === 3) {
        const requiredFields = ['workload', 'performance'];
        requiredFields.forEach(field => {
          if (!formData[field]) {
            isValid = false;
            emptyFields.push(field);
          }
        });
      }
      else if (currentStep === 4) {
        const requiredFields = ['satisfaction', 'loneliness'];
        requiredFields.forEach(field => {
          if (!formData[field]) {
            isValid = false;
            emptyFields.push(field);
          }
        });
      }
      else if (currentStep === 5) {
        const requiredFields = ['financialStress', 'sleepHours', 'exercise'];
        requiredFields.forEach(field => {
          if (!formData[field]) {
            isValid = false;
            emptyFields.push(field);
          }
        });
        
        if (formData.sleepHours === 'others' && !formData.sleepHoursOthers) {
          isValid = false;
          emptyFields.push('sleepHoursOthers');
        }
      }
      else if (currentStep === 6) {
        const requiredFields = ['socialMediaHours', 'socialMediaStress'];
        requiredFields.forEach(field => {
          if (!formData[field]) {
            isValid = false;
            emptyFields.push(field);
          }
        });
      }
      else if (currentStep === 7) {
        const requiredFields = ['mentalHealthChallenge', 'stressManagement', 'anxietyDepression', 'resourcesSufficient'];
        requiredFields.forEach(field => {
          if (!formData[field]) {
            isValid = false;
            emptyFields.push(field);
          }
        });
      }
      else if (currentStep === 8) {
        const requiredFields = ['surveyClarity', 'surveyLength', 'suggestions'];
        requiredFields.forEach(field => {
          if (!formData[field]) {
            isValid = false;
            emptyFields.push(field);
          }
        });
      }
      // 第9页是可选的邮箱，不需要验证

      if (!isValid) {
        console.log('Missing fields:', emptyFields);
        alert(`Please fill in all required fields: ${emptyFields.join(', ')}`);
        return false;
      }
    }
    return true;
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }} 
      className="ai-survey-form"
    >
      {/* 进度指示器 */}
      <div className="ai-form-progress">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`ai-progress-step ${
              currentStep >= index + 1 ? 'active' : ''
            }`}
          >
            <div className="ai-step-number">{index + 1}</div>
            <div className="ai-step-line"></div>
          </div>
        ))}
      </div>

      {/* 第一页：基本信息 */}
      {currentStep === 1 && (
        <section className="ai-form-section">
          <h2 className="ai-section-title">Basic Information</h2>
          
          {/* Q1: Age */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q1. What is your age?</label>
            <div className="ai-radio-group">
              {[
                { value: 'under18', label: 'Under 18' },
                { value: '18-20', label: '18-20' },
                { value: '21-23', label: '21-23' },
                { value: '24+', label: '24+' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="age"
                    value={option.value}
                    checked={formData.age === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q2: Gender */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q2. What is your gender?</label>
            <div className="ai-radio-group">
              {[
                { value: 'female', label: 'Female' },
                { value: 'male', label: 'Male' },
                { value: 'non-binary', label: 'Non-binary/Third Gender' },
                { value: 'prefer-not-say', label: 'Prefer not to say' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={formData.gender === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q3: Faculty */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q3. Which faculty are you enrolled in?</label>
            <div className="ai-radio-group">
              {[
                { value: 'arts', label: 'Arts' },
                { value: 'business', label: 'Business Administration' },
                { value: 'engineering', label: 'Engineering' },
                { value: 'science', label: 'Science' },
                { value: 'law', label: 'Law' },
                { value: 'social-science', label: 'Social Science' },
                { value: 'education', label: 'Education' },
                { value: 'medicine', label: 'Medicine' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="faculty"
                    value={option.value}
                    checked={formData.faculty === option.value}
                    onChange={handleFacultyChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
              <label className="ai-radio-label">
                <input
                  type="radio"
                  name="faculty"
                  value="others"
                  checked={formData.faculty === 'others'}
                  onChange={handleFacultyChange}
                  className="ai-radio-input"
                />
                <span className="ai-radio-text">Others</span>
              </label>
            </div>
            <input
              id="faculty-others"
              type="text"
              name="facultyOthers"
              value={formData.facultyOthers}
              onChange={handleInputChange}
              className="ai-form-input ai-form-others"
              placeholder="Please specify your faculty"
              style={{ display: formData.faculty === 'others' ? 'block' : 'none' }}
            />
          </div>

          {/* Q4: Year of Study */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q4. What is your current year of study?</label>
            <div className="ai-radio-group">
              {[
                { value: 'year1', label: 'Year 1 (undergraduate)' },
                { value: 'year2', label: 'Year 2 (undergraduate)' },
                { value: 'year3', label: 'Year 3 (undergraduate)' },
                { value: 'year4', label: 'Year 4 or above (undergraduate)' },
                { value: 'postgrad', label: 'Postgraduate' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="year"
                    value={option.value}
                    checked={formData.year === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q5: Student Type */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q5. Are you an international or local student?</label>
            <div className="ai-radio-group">
              {[
                { value: 'local', label: 'Local (Hong Kong)' },
                { value: 'mainland', label: 'International (Mainland China)' },
                { value: 'international', label: 'International (Other)' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="studentType"
                    value={option.value}
                    checked={formData.studentType === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 第二页：表格选择题 */}
      {currentStep === 2 && (
        <section className="ai-form-section">
          <h2 className="ai-section-title">Mental Health Assessment</h2>
          <div className="ai-form-group">
            <label className="ai-form-label">Q6. Over the last 2 weeks, how often have you been bothered by the following?</label>
            
            <div className="ai-matrix-table">
              {/* 表头 */}
              <div className="ai-matrix-header">
                <div className="ai-matrix-cell ai-matrix-label"></div>
                <div className="ai-matrix-cell">Not at all (0)</div>
                <div className="ai-matrix-cell">Several days (1)</div>
                <div className="ai-matrix-cell">More than half the days (2)</div>
                <div className="ai-matrix-cell">Nearly every day (3)</div>
              </div>

              {/* 问题行 */}
              {[
                { name: 'interest', label: 'Little interest or pleasure in doing things?' },
                { name: 'depression', label: 'Feeling down, depressed, or hopeless?' },
                { name: 'sleep', label: 'Trouble falling/staying asleep, or sleeping too much?' },
                { name: 'tired', label: 'Feeling tired or having little energy?' },
                { name: 'appetite', label: 'Poor appetite or overeating?' }
              ].map(question => (
                <div key={question.name} className="ai-matrix-row">
                  <div className="ai-matrix-cell ai-matrix-label">{question.label}</div>
                  {[0, 1, 2, 3].map(value => (
                    <div key={value} className="ai-matrix-cell">
                      <label className="ai-matrix-radio-label">
                        <input
                          type="radio"
                          name={question.name}
                          value={String(value)}
                          checked={formData[question.name] === String(value)}
                          onChange={handleInputChange}
                          className="ai-matrix-radio"
                        />
                        <span className="ai-matrix-radio-text"></span>
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 第三页：分析设置 */}
      {currentStep === 3 && (
        <section className="ai-form-section">
          <h2 className="ai-section-title">Academic Assessment</h2>
          
          {/* Q7: Academic Workload */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q7. How often do you feel overwhelmed by academic workload?</label>
            <div className="ai-radio-group">
              {[
                { value: 'never', label: 'Never' },
                { value: 'rarely', label: 'Rarely' },
                { value: 'sometimes', label: 'Sometimes' },
                { value: 'often', label: 'Often' },
                { value: 'always', label: 'Always' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="workload"
                    value={option.value}
                    checked={formData.workload === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q8: Academic Performance Concerns */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q8. Do you have concerns about your academic performance?</label>
            <div className="ai-radio-group">
              {[
                { value: 'significantly', label: 'Yes, significantly' },
                { value: 'moderately', label: 'Yes, moderately' },
                { value: 'slightly', label: 'Yes, slightly' },
                { value: 'rarely', label: 'Rarely' },
                { value: 'not-at-all', label: 'Not at all' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="performance"
                    value={option.value}
                    checked={formData.performance === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 第四页：社会经验 */}
      {currentStep === 4 && (
        <section className="ai-form-section">
          <h2 className="ai-section-title">Social Experience</h2>
          
          {/* Q9: Social Relationships Satisfaction */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q9. How satisfied are you with your social relationships at CUHK?</label>
            <div className="ai-radio-group">
              {[
                { value: 'very-satisfied', label: 'Very satisfied' },
                { value: 'satisfied', label: 'Satisfied' },
                { value: 'neutral', label: 'Neutral' },
                { value: 'dissatisfied', label: 'Dissatisfied' },
                { value: 'very-dissatisfied', label: 'Very dissatisfied' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="satisfaction"
                    value={option.value}
                    checked={formData.satisfaction === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q10: Feeling of Isolation */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q10. Do you feel isolated or lonely on campus?</label>
            <div className="ai-radio-group">
              {[
                { value: 'never', label: 'Never' },
                { value: 'occasionally', label: 'Occasionally' },
                { value: 'frequently', label: 'Frequently' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="loneliness"
                    value={option.value}
                    checked={formData.loneliness === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 第五页：生活方式和幸福感 */}
      {currentStep === 5 && (
        <section className="ai-form-section">
          <h2 className="ai-section-title">Lifestyle and Well-being</h2>
          
          {/* Q11: Financial Stress */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q11. How much does financial stress affect your well-being?</label>
            <div className="ai-radio-group">
              {[
                { value: 'not-at-all', label: 'Not at all' },
                { value: 'slightly', label: 'Slightly' },
                { value: 'moderately', label: 'Moderately' },
                { value: 'severely', label: 'Severely' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="financialStress"
                    value={option.value}
                    checked={formData.financialStress === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q12: Sleep Hours */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q12. How many hours do you sleep per night on average?</label>
            <div className="ai-radio-group">
              {[
                { value: 'less-than-5', label: '< 5 hours' },
                { value: '5-6', label: '5–6 hours' },
                { value: '7-8', label: '7–8 hours' },
                { value: 'more-than-8', label: '> 8 hours' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="sleepHours"
                    value={option.value}
                    checked={formData.sleepHours === option.value}
                    onChange={handleSleepHoursChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
              <label className="ai-radio-label">
                <input
                  type="radio"
                  name="sleepHours"
                  value="others"
                  checked={formData.sleepHours === 'others'}
                  onChange={handleSleepHoursChange}
                  className="ai-radio-input"
                />
                <span className="ai-radio-text">Others (please give us some hints)</span>
              </label>
            </div>
            {formData.sleepHours === 'others' && (
              <input
                type="text"
                name="sleepHoursOthers"
                value={formData.sleepHoursOthers}
                onChange={handleInputChange}
                className="ai-form-input ai-form-others"
                placeholder="Please specify your sleep hours"
                style={{ display: 'block' }}
              />
            )}
          </div>

          {/* Q13: Exercise Frequency */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q13. How often do you engage in physical exercise?</label>
            <div className="ai-radio-group">
              {[
                { value: 'never', label: 'Never' },
                { value: 'seldom', label: 'Seldom' },
                { value: '1-2-times', label: '1–2 times/week' },
                { value: '3-plus-times', label: '3+ times/week' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="exercise"
                    value={option.value}
                    checked={formData.exercise === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 第六页：社交媒体使用 */}
      {currentStep === 6 && (
        <section className="ai-form-section">
          <h2 className="ai-section-title">Social Media Usage</h2>
          
          {/* Q16: Social Media Hours */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q16. On average, how many hours daily do you spend on social media?</label>
            <div className="ai-radio-group">
              {[
                { value: 'less-than-1', label: '<1 hour' },
                { value: '1-2', label: '1–2 hours' },
                { value: '3-4', label: '3–4 hours' },
                { value: 'more-than-4', label: '>4 hours' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="socialMediaHours"
                    value={option.value}
                    checked={formData.socialMediaHours === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q17: Social Media Stress */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q17. How often do you feel stressed, anxious, or inadequate after using social media?</label>
            <div className="ai-radio-group">
              {[
                { value: 'never', label: 'Never' },
                { value: 'rarely', label: 'Rarely' },
                { value: 'sometimes', label: 'Sometimes' },
                { value: 'often', label: 'Often' },
                { value: 'always', label: 'Always' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="socialMediaStress"
                    value={option.value}
                    checked={formData.socialMediaStress === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 第七页：开放问题 */}
      {currentStep === 7 && (
        <section className="ai-form-section">
          <h2 className="ai-section-title">Open Questions</h2>
          
          {/* Q14: Mental Health Challenge */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q14. What do you think is the biggest challenge affecting student mental health at CUHK?</label>
            <textarea
              name="mentalHealthChallenge"
              value={formData.mentalHealthChallenge}
              onChange={handleInputChange}
              className="ai-form-textarea"
              rows="4"
              placeholder="Please share your thoughts..."
            />
          </div>

          {/* Q15: Stress Management Resources */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q15. What resources or support would help you manage stress better?</label>
            <textarea
              name="stressManagement"
              value={formData.stressManagement}
              onChange={handleInputChange}
              className="ai-form-textarea"
              rows="4"
              placeholder="Please share your suggestions..."
            />
          </div>

          {/* Q19: Anxiety vs Depression */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q19. In your own words, how would you describe the difference between anxiety and depression?</label>
            <textarea
              name="anxietyDepression"
              value={formData.anxietyDepression}
              onChange={handleInputChange}
              className="ai-form-textarea"
              rows="4"
              placeholder="Please share your understanding..."
            />
          </div>

          {/* Q20: Resources Sufficiency */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q20. Do you think CUHK provides enough resources to help students distinguish between and manage these conditions?</label>
            <div className="ai-radio-group">
              {[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'unsure', label: 'Unsure' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="resourcesSufficient"
                    value={option.value}
                    checked={formData.resourcesSufficient === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 第八页：调查反馈 */}
      {currentStep === 8 && (
        <section className="ai-form-section">
          <h2 className="ai-section-title">Survey Feedback</h2>
          
          {/* Q24: Survey Clarity */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q24. To help us improve future surveys, please share your feedback</label>
            <div className="ai-radio-group">
              {[
                { value: 'very-clear', label: 'Very clear' },
                { value: 'somewhat-clear', label: 'Somewhat clear' },
                { value: 'confusing', label: 'Confusing' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="surveyClarity"
                    value={option.value}
                    checked={formData.surveyClarity === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q25: Survey Length */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q25. Was the survey length appropriate?</label>
            <div className="ai-radio-group">
              {[
                { value: 'too-short', label: 'Too short' },
                { value: 'just-right', label: 'Just right' },
                { value: 'too-long', label: 'Too long' }
              ].map(option => (
                <label key={option.value} className="ai-radio-label">
                  <input
                    type="radio"
                    name="surveyLength"
                    value={option.value}
                    checked={formData.surveyLength === option.value}
                    onChange={handleInputChange}
                    className="ai-radio-input"
                  />
                  <span className="ai-radio-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q26: Suggestions */}
          <div className="ai-form-group">
            <label className="ai-form-label">Q26. Any suggestions to improve this survey?</label>
            <textarea
              name="suggestions"
              value={formData.suggestions}
              onChange={handleInputChange}
              className="ai-form-textarea"
              rows="4"
              placeholder="Please share your suggestions..."
            />
          </div>
        </section>
      )}

      {/* 第九页：联系信息 */}
      {currentStep === 9 && (
        <section className="ai-form-section">
          <h2 className="ai-section-title">Contact Information (Optional)</h2>
          
          {/* Q28: Email Collection */}
          <div className="ai-form-group">
            <label className="ai-form-label">
              Q28. To help us better understand your responses or share updates on this research, 
              you may optionally provide your email address below. This is entirely voluntary, 
              and your survey answers will remain anonymous even if you choose to share your email.
            </label>
            <textarea
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="ai-form-textarea"
              rows="4"
              placeholder="Enter your email address (optional)"
            />
          </div>
        </section>
      )}

      {/* 导航按钮 */}
      <div className="ai-form-actions">
        {currentStep > 1 && (
          <button 
            type="button" 
            onClick={handlePrev}
            className="ai-nav-button ai-prev-button"
          >
            上一步
          </button>
        )}
        
        {currentStep < totalSteps ? (
          <button 
            type="button" 
            onClick={handleNext}
            className="ai-nav-button ai-next-button"
          >
            下一步
          </button>
        ) : (
          <button 
            type="button" 
            onClick={() => handleSubmit()}
            className="ai-nav-button ai-next-button"
            >
            提交问卷
          </button>
        )}
      </div>
    </form>
  );
};

// 添加 PropTypes 验证
QuestionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  DEV_MODE: PropTypes.bool
};

export default QuestionForm;