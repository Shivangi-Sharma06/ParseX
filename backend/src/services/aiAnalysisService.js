const { extractSkillsFromText } = require('../utils/skills');

const getHeuristicAnalysis = (candidate, resumeText = '') => {
  const skills = candidate.skills || extractSkillsFromText(resumeText);
  const strengths = [];
  const concerns = [];

  if (skills.length >= 8) {
    strengths.push('Wide skill coverage across multiple tools and technologies.');
  }
  if (skills.length >= 3 && skills.length < 8) {
    strengths.push('Relevant technical skills are present for role matching.');
  }
  if (skills.length < 3) {
    concerns.push('Limited skill evidence detected from the uploaded resume.');
  }

  if ((candidate.education || []).length > 0) {
    strengths.push('Education details are clearly available in the profile.');
  } else {
    concerns.push('Education data is not clearly extractable from the document.');
  }

  const experienceLabel = candidate.experience || 'Not specified';
  if (/not specified/i.test(experienceLabel)) {
    concerns.push('Work experience duration is not explicitly mentioned.');
  } else {
    strengths.push(`Experience marker found: ${experienceLabel}.`);
  }

  if (!candidate.email) {
    concerns.push('Candidate email was not detected, communication may require manual follow-up.');
  }

  const recommendation =
    skills.length >= 5
      ? 'Recommended for interview round if role fit is confirmed by matching score.'
      : 'Needs manual recruiter review before shortlisting.';

  const confidence = Math.max(35, Math.min(90, Math.round((skills.length / 12) * 100)));

  return {
    summary: `Profile parsed with ${skills.length} identified skills and ${
      (candidate.education || []).length
    } education entries.`,
    strengths,
    concerns,
    recommendation,
    confidence,
    source: 'heuristic',
  };
};

const getGroqAnalysis = async ({ candidate, jobDescription, resumeText = '' }) => {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  if (!apiKey) {
    return null;
  }

  const prompt = [
    'You are an expert recruiter assistant and an AI analysis engine.',
    'Analyze the candidate profile and resume text, then compute a match score and professional recommendation.',
    'Provide strictly valid JSON matching this schema EXACTLY:',
    '{ "summary": "string", "strengths": ["string"], "concerns": ["string"], "recommendation": "string", "confidence": number }',
    'Candidate Info:',
    `Name: ${candidate.name}`,
    `Email: ${candidate.email}`,
    `Skills: ${(candidate.skills || []).join(', ')}`,
    `Education: ${(candidate.education || []).join(', ')}`,
    `Experience: ${candidate.experience}`,
    jobDescription ? `Target job description: ${jobDescription}` : '',
    'Resume Text snippet:',
    resumeText.substring(0, 15000), // pass a large snippet
  ]
    .filter(Boolean)
    .join('\n');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are an AI recruiting assistant. You always reply with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq analysis failed: ${errorBody}`);
  }

  const body = await response.json();
  const outputText = body.choices[0].message.content;

  if (!outputText) {
    throw new Error('Groq analysis returned empty output');
  }

  const parsed = JSON.parse(outputText);

  return {
    summary: parsed.summary || 'Summary not available',
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
    recommendation: parsed.recommendation || '',
    confidence: Number(parsed.confidence) || 0,
    source: 'openai',
  };
};

const generateCandidateAnalysis = async ({ candidate, jobDescription, resumeText = '' }) => {
  try {
    const aiResult = await getGroqAnalysis({ candidate, jobDescription, resumeText });

    if (aiResult) {
      return aiResult;
    }
  } catch (error) {
    console.warn('AI analysis fallback to heuristic:', error.message);
  }

  return getHeuristicAnalysis(candidate, resumeText);
};

module.exports = {
  generateCandidateAnalysis,
};
