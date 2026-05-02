const fs = require('fs/promises');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { extractSkillsFromText } = require('../utils/skills');

const extractTextFromFile = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  try {
    if (extension === '.pdf') {
      const fileBuffer = await fs.readFile(filePath);
      const parsed = await pdfParse(fileBuffer);
      return parsed.text || '';
    }

    if (extension === '.docx' || extension === '.doc') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || '';
    }
  } catch (error) {
    console.error(`Specific parser failed for ${extension}, falling back. Error:`, error.message);
  }

  // Fallback for .txt or any other format (try to read as utf-8 string)
  try {
    const fileBuffer = await fs.readFile(filePath);
    // Strip out null bytes and invalid characters that can crash JSON or AI APIs
    return fileBuffer.toString('utf-8').replace(/\u0000/g, '').replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, ' ');
  } catch (err) {
    console.error('Text fallback failed:', err.message);
    return '';
  }
};

const extractEmail = (text) => {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return emailMatch ? emailMatch[0].toLowerCase() : '';
};

const extractName = (text) => {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const firstCandidateLine = lines.find(
    (line) =>
      !line.includes('@') &&
      !line.match(/\d{10}/) &&
      line.split(' ').length >= 2 &&
      line.length <= 60,
  );

  return firstCandidateLine || 'Unknown Candidate';
};

const extractEducation = (text) => {
  const lines = text.split('\n').map((line) => line.trim());
  const educationKeywords = [
    'b.tech',
    'b.e',
    'bachelor',
    'master',
    'm.tech',
    'mca',
    'bca',
    'phd',
    'diploma',
    'university',
    'college',
  ];

  const education = lines.filter((line) =>
    educationKeywords.some((keyword) => line.toLowerCase().includes(keyword)),
  );

  return [...new Set(education)].slice(0, 5);
};

const extractExperience = (text) => {
  const yearMatch = text.match(/(\d+)\+?\s*(years|year)\s*(of)?\s*(experience)?/i);

  if (yearMatch) {
    return `${yearMatch[1]} years`;
  }

  if (/fresher|entry level/i.test(text)) {
    return '0 years';
  }

  return 'Not specified';
};

const parseWithGroq = async (text) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const prompt = [
    'Extract the following information from the resume text provided below.',
    'Return ONLY a valid JSON object with the following structure:',
    '{',
    '  "name": "Candidate\'s full name (or \'Unknown Candidate\' if not found)",',
    '  "email": "Candidate\'s email address (or empty string)",',
    '  "skills": ["Array of distinct technical or soft skills extracted from the text"],',
    '  "education": ["Array of degree, major, and institution combinations found"],',
    '  "experience": "Total years of experience (e.g. \'5 years\', \'Fresher\', or \'Not specified\')"',
    '}',
    'If any field is missing, use empty string or empty array.',
    '',
    'Resume Text:',
    text.substring(0, 20000), // pass a large chunk
  ].join('\n');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are an HR assistant expert at parsing resumes. You only output valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq parse failed: ${errorBody}`);
  }

  const body = await response.json();
  const content = body.choices[0].message.content;

  if (!content) {
    throw new Error('Groq parse returned empty output');
  }

  return JSON.parse(content);
};

const parseResumeFile = async (filePath) => {
  const extractedText = await extractTextFromFile(filePath);

  try {
    const aiParsed = await parseWithGroq(extractedText);
    
    if (aiParsed) {
      // In case Groq missed something, we can enhance with heuristic if needed
      const heuristicSkills = extractSkillsFromText(extractedText);
      const combinedSkills = Array.from(new Set([...(aiParsed.skills || []), ...heuristicSkills]));

      return {
        name: aiParsed.name || extractName(extractedText) || 'Unknown Candidate',
        email: aiParsed.email || extractEmail(extractedText) || '',
        skills: combinedSkills,
        education: Array.isArray(aiParsed.education) ? aiParsed.education : extractEducation(extractedText),
        experience: aiParsed.experience && aiParsed.experience !== 'Not specified' ? aiParsed.experience : extractExperience(extractedText),
        resumeText: extractedText,
      };
    }
  } catch (error) {
    console.warn('Groq parsing failed, falling back to heuristic parsing:', error.message);
  }

  // Fallback if no GROQ_API_KEY or if Groq fails
  return {
    name: extractName(extractedText),
    email: extractEmail(extractedText),
    skills: extractSkillsFromText(extractedText),
    education: extractEducation(extractedText),
    experience: extractExperience(extractedText),
    resumeText: extractedText,
  };
};

module.exports = {
  parseResumeFile,
};
