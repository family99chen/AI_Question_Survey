import config from '../config.json';

const { base_url, secret_key } = config.api;

export const analyzeFormData = async (formData, onPartialResponse, instruction = '') => {
  try {
    const response = await fetch(`${base_url}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret_key}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a professional mental health counselor. Please analyze the student's mental health status and provide feedback in the following Markdown format:

### Key Observations

- Key finding 1
- Key finding 2
...

### Detailed Analysis

[Provide detailed analysis here, including emotional state, stress levels, and potential concerns]

### Recommendations

1. Recommendation 1
2. Recommendation 2
...

### Important Notes

> Critical reminders and precautions...

Please ensure your analysis is:
1. Professional and empathetic
2. Based on evidence from the survey
3. Focused on actionable insights
4. Written in clear, accessible language

### Support Resources

If you need professional support, please don't hesitate to reach out:

- **Wellness and Counselling Centre**
  - Office Hours: 3943 7208
  - Email: wacc@cuhk.edu.hk
  - Online Appointment: https://wacc.osa.cuhk.edu.hk/tc/

- **24/7 Support Hotlines**
  - CUHK 24-hour Emotional Support: 5400 2055
  - "Open Up" WhatsApp: 9101 2012
  - Mental Health Link: 18111

- **Online Resources**
  - Wellness Centre: https://wacc.osa.cuhk.edu.hk/tc/
  - Sunshine at CUHK: https://wacc.osa.cuhk.edu.hk/tc/self-help-section/sunshine-at-cuhk/

`
          },
          {
            role: 'user',
            content: `Please analyze this student's mental health survey data: ${JSON.stringify(formData)}${
              instruction ? `\n\nAdditional requirements: ${instruction}` : ''
            }`
          }
        ],
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error('AI分析请求失败');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let partialLine = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = (partialLine + chunk).split('\n');
      partialLine = lines.pop() || '';  // 保存不完整的行

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
              const content = parsed.choices[0].delta.content || '';
              buffer += content;
              if (typeof onPartialResponse === 'function') {
                onPartialResponse(buffer);
              }
            }
          } catch (e) {
            console.error('解析流数据错误:', e);
            continue;  // 跳过错误的数据继续处理
          }
        }
      }
    }

    return buffer;
  } catch (error) {
    console.error('AI分析错误:', error);
    throw error;
  }
};
