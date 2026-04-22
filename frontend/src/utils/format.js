export const formatDate = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
};

export const skillLabel = (skill) => {
  if (!skill) return '';
  return skill.charAt(0).toUpperCase() + skill.slice(1);
};

export const parseSkillInput = (value) =>
  value
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
