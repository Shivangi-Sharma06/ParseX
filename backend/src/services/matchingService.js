const { normalizeText } = require('../utils/skills');

const normalizeSkillList = (skills = []) =>
  skills
    .map((skill) => normalizeText(skill))
    .filter(Boolean)
    .map((skill) => skill.replace(/\s+/g, ''));

const calculateMatch = (candidateSkills = [], requiredSkills = []) => {
  const normalizedCandidateSkills = normalizeSkillList(candidateSkills);
  const normalizedRequiredSkills = normalizeSkillList(requiredSkills);

  const requiredSet = new Set(normalizedRequiredSkills);
  const candidateSet = new Set(normalizedCandidateSkills);

  if (requiredSet.size === 0) {
    return {
      score: 0,
      matchedSkills: [],
    };
  }

  const matchedSkills = [...requiredSet].filter((skill) => candidateSet.has(skill));
  const score = Number(((matchedSkills.length / requiredSet.size) * 100).toFixed(2));

  return {
    score,
    matchedSkills,
  };
};

module.exports = {
  calculateMatch,
};
