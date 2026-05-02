const { normalizeText } = require('../utils/skills');

const normalizeSkill = (skill = '') =>
  normalizeText(skill).replace(/[^a-z0-9+#]/g, '');

const normalizeSkillList = (skills = []) => skills.map((skill) => normalizeSkill(skill)).filter(Boolean);

const calculateMatch = (candidateSkills = [], requiredSkills = []) => {
  const normalizedRequiredSkills = normalizeSkillList(requiredSkills);
  const uniqueRequiredSkills = Array.from(new Set(normalizedRequiredSkills));

  if (!uniqueRequiredSkills.length) {
    return {
      score: 0,
      matchedSkills: [],
    };
  }

  const normalizedCandidateSkills = new Set(normalizeSkillList(candidateSkills));
  const matchedSkills = [];
  const matchedNormalizedSkills = new Set();

  requiredSkills.forEach((requiredSkill) => {
    const normalizedSkill = normalizeSkill(requiredSkill);

    if (!normalizedSkill || matchedNormalizedSkills.has(normalizedSkill)) {
      return;
    }

    if (normalizedCandidateSkills.has(normalizedSkill)) {
      matchedNormalizedSkills.add(normalizedSkill);
      matchedSkills.push(requiredSkill);
    }
  });

  const score = Math.round((matchedNormalizedSkills.size / uniqueRequiredSkills.length) * 100);

  return {
    score,
    matchedSkills,
  };
};

module.exports = {
  calculateMatch,
};
