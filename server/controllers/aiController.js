const asyncHandler = require('express-async-handler');
const { callGemini } = require('../utils/geminiClient');
const Assessment = require('../models/Assessment');
const Resume = require('../models/Resume');

// @desc    Assess worker skills via chat turn
// @route   POST /api/ai/assess
const assessSkills = asyncHandler(async (req, res) => {
  const { messages, isFinal } = req.body;
  const user = req.user;

  const systemPrompt = `You are KaushalAI, a friendly skill assessor for Indian informal workers. 
The worker is a ${user.trade} worker with ${user.experience || 0} years experience. 
Speak in ${user.language === 'hi' ? 'Hindi' : 'English'}.
Ask scenario-based questions one at a time to assess their skill level. Be encouraging and simple.
If this is the final assessment, return ONLY a JSON object: {"skillLevel":"Beginner", "strengths":["..."], "gaps":["..."], "recommendedCourse":"..."}`;

  const prompt = messages.map(m => `${m.role}: ${m.text}`).join('\n') + (isFinal ? '\nPlease provide the final JSON assessment.' : '');

  const responseText = await callGemini(prompt, systemPrompt, user?.language);

  if (isFinal) {
    try {
      const parsed = JSON.parse(responseText);
      const assessment = await Assessment.create({
        userId: user._id,
        skillLevel: parsed.skillLevel,
        strengths: parsed.strengths,
        gaps: parsed.gaps,
        recommendedCourse: parsed.recommendedCourse,
        rawResponse: responseText
      });
      user.skillLevel = parsed.skillLevel;
      await user.save();
      return res.status(200).json({ success: true, isFinal: true, data: assessment });
    } catch (e) {
      console.error('Failed to parse final assessment JSON', e);
      return res.status(500).json({ success: false, message: 'Failed to generate assessment summary' });
    }
  }

  res.status(200).json({ success: true, text: responseText });
});

// @desc    Answer lesson doubt
// @route   POST /api/ai/doubt
const answerDoubt = asyncHandler(async (req, res) => {
  const { moduleTopic, question } = req.body;
  const user = req.user;

  const systemPrompt = `Explain ${moduleTopic} in simple ${user.language === 'hi' ? 'Hindi' : 'English'} to a ${user.trade} worker at ${user.skillLevel || 'Beginner'} level. Use an everyday example. Keep it short.`;

  const responseText = await callGemini(question, systemPrompt, user?.language);
  res.status(200).json({ success: true, text: responseText });
});

// @desc    Generate Worker Resume
// @route   POST /api/ai/generate-resume
const generateResume = asyncHandler(async (req, res) => {
  const { skills, certifications, completedCourses, previousWork } = req.body;
  const user = req.user;

  const systemPrompt = `You are a professional resume writer for Indian vocational workers. Generate a concise, high-impact resume in strictly valid Markdown format.

CRITICAL: Do NOT include any introductory text, greetings (like "Namaste Rishabh"), or closing remarks. Return ONLY the markdown content.

Focus on professional headers: Summary, Skills, Work History, and Certifications.`;
  
  const prompt = `Name: ${user.name}, Trade: ${user.trade}, Experience: ${user.experience} years. Skills: ${skills.join(', ')}. Certifications: ${certifications.join(', ')}. Completed courses: ${completedCourses.join(', ')}. Previous work: ${previousWork}.`;

  const responseText = await callGemini(prompt, systemPrompt, user?.language);
  const cleanMarkdown = responseText.replace(/^```(markdown)?\n/i, '').replace(/\n```$/i, '').trim();

  const resume = await Resume.create({
    userId: user._id,
    generatedText: cleanMarkdown
  });

  res.status(200).json({ success: true, data: resume });
});

// @desc    Analyze resume
// @route   POST /api/ai/analyze-resume
const analyzeResume = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const user = req.user;

  const systemPrompt = `Analyze this resume for a ${user.trade} worker in India. Return ONLY JSON: {"strengths":["..."], "weaknesses":["..."], "missingCertifications":["..."], "improvementSuggestions":["..."], "overallScore": 8}`;
  
  const responseText = await callGemini(text, systemPrompt, user?.language);
  
  try {
    const parsed = JSON.parse(responseText);
    res.status(200).json({ success: true, data: parsed });
  } catch (e) {
    res.status(500).json({ success: false, message: 'AI failed to analyze resume' });
  }
});

// @desc    Generate Job Description
// @route   POST /api/ai/generate-jd
const generateJd = asyncHandler(async (req, res) => {
  const { title, trade, level, location, salaryMin, salaryMax, certifications } = req.body;
  const employer = req.user;

  const systemPrompt = `Write a clear, professional job description for a ${trade} worker position at ${level} experience level in ${location}, India. Salary: ₹${salaryMin}–₹${salaryMax}/month. Required certifications: ${certifications.join(', ')}. Keep it simple, encouraging. Max 150 words. Output text only.`;
  
  const responseText = await callGemini(`Company: ${employer.companyName}. Job Title: ${title}`, systemPrompt, employer?.language);
  res.status(200).json({ success: true, text: responseText });
});

// @desc    Compare Job Fit
// @route   POST /api/ai/job-fit
const checkJobFit = asyncHandler(async (req, res) => {
  const { jobData, workerProfile } = req.body;
  
  const systemPrompt = `Compare this worker profile vs job requirements. Return ONLY JSON: {"matchPercent": 85, "matchedSkills":["..."], "missingSkills":["..."], "recommendation":"..."}`;
  
  const prompt = `Worker: trade=${workerProfile.trade}, level=${workerProfile.skillLevel}, certs=${workerProfile.certs.join(',')}, skills=${workerProfile.skills.join(',')}. Job requires: ${JSON.stringify(jobData)}.`;

  const responseText = await callGemini(prompt, systemPrompt, req.user?.language);
  
  try {
    const parsed = JSON.parse(responseText);
    res.status(200).json({ success: true, data: parsed });
  } catch (e) {
    res.status(500).json({ success: false, message: 'AI failed to analyze fit' });
  }
});

module.exports = { assessSkills, answerDoubt, generateResume, analyzeResume, generateJd, checkJobFit };
