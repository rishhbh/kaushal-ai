const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Language name mapping for Gemini prompt
const LANG_MAP = {
  hi: 'Hindi (हिंदी)',
  en: 'English',
  bn: 'Bengali (বাংলা)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  mr: 'Marathi (मराठी)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)'
};

const callGemini = async (prompt, systemPrompt, userLang = 'hi') => {
  try {
    const langName = LANG_MAP[userLang] || LANG_MAP.hi;
    const finalSystemPrompt = `You are KaushalAI, a friendly assistant for Indian workers. Always respond in ${langName}. Use simple, everyday words that an informal worker with basic literacy can understand. Avoid technical jargon. Be warm, encouraging, and respectful.\n\n${systemPrompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: finalSystemPrompt,
        temperature: 0.7
      }
    });

    let text = response.text;
    
    // Clean up markdown code fences if JSON was requested
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/```\w*\n?/, '').replace(/```\n?$/, '').trim();
    }

    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('AI service is temporarily unavailable.');
  }
};

module.exports = { callGemini };
