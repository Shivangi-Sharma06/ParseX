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

const getOpenAIAnalysis = async ({ candidate, jobDescription }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-5.4-mini';

  if (!apiKey) {
    return null;
  }

  const prompt = [
    'You are an expert recruiter assistant.',
    'Analyze the candidate profile and provide strictly valid JSON with keys:',
    'summary (string), strengths (string[]), concerns (string[]), recommendation (string), confidence (number 0-100).',
    'Candidate data:',
    JSON.stringify(
      {
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills,
        education: candidate.education,
        experience: candidate.experience,
      },
      null,
      2,
    ),
    jobDescription ? `Target job description: ${jobDescription}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: prompt,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'candidate_analysis',
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              summary: { type: 'string' },
              strengths: { type: 'array', items: { type: 'string' } },
              concerns: { type: 'array', items: { type: 'string' } },
              recommendation: { type: 'string' },
              confidence: { type: 'number' },
            },
            required: ['summary', 'strengths', 'concerns', 'recommendation', 'confidence'],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI analysis failed: ${errorBody}`);
  }

  const body = await response.json();
  const outputText = body.output_text;

  if (!outputText) {
    throw new Error('OpenAI analysis returned empty output');
  }

  const parsed = JSON.parse(outputText);

  return {
    summary: parsed.summary || '',
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
    recommendation: parsed.recommendation || '',
    confidence: Number(parsed.confidence) || 0,
    source: 'openai',
  };
};

const generateCandidateAnalysis = async ({ candidate, jobDescription, resumeText = '' }) => {
  try {
    const aiResult = await getOpenAIAnalysis({ candidate, jobDescription });

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
