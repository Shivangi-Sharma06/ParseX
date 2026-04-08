export const formatDate = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }

  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const prettifySkill = (skill = '') => {
  if (!skill) {
    return '';
  }

  const map = {
    nodejs: 'Node.js',
    nextjs: 'Next.js',
    restapi: 'REST API',
    machinelearning: 'Machine Learning',
    springboot: 'Spring Boot',
  };

  return map[skill] || skill.charAt(0).toUpperCase() + skill.slice(1);
};
