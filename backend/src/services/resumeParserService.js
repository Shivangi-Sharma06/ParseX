const fs = require('fs/promises');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { extractSkillsFromText } = require('../utils/skills');

const extractTextFromFile = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === '.pdf') {
    const fileBuffer = await fs.readFile(filePath);
    const parsed = await pdfParse(fileBuffer);
    return parsed.text || '';
  }

  if (extension === '.docx' || extension === '.doc') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  }

  throw new Error('Unsupported file format. Please upload PDF or DOCX.');
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

const parseResumeFile = async (filePath) => {
  const extractedText = await extractTextFromFile(filePath);

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
