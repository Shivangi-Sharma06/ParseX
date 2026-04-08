const SKILL_ALIASES = {
  javascript: ['javascript', 'js', 'es6'],
  typescript: ['typescript', 'ts'],
  nodejs: ['node', 'nodejs', 'node.js'],
  express: ['express', 'expressjs'],
  react: ['react', 'reactjs', 'react.js'],
  redux: ['redux'],
  nextjs: ['nextjs', 'next.js'],
  mongodb: ['mongodb', 'mongo'],
  sql: ['sql', 'mysql', 'postgresql', 'postgres', 'oracle sql'],
  java: ['java'],
  springboot: ['spring boot', 'springboot'],
  python: ['python'],
  django: ['django'],
  flask: ['flask'],
  csharp: ['c#', 'csharp', '.net', 'asp.net'],
  cpp: ['c++', 'cpp'],
  aws: ['aws', 'amazon web services'],
  azure: ['azure'],
  gcp: ['gcp', 'google cloud'],
  docker: ['docker'],
  kubernetes: ['kubernetes', 'k8s'],
  git: ['git', 'github', 'gitlab'],
  html: ['html', 'html5'],
  css: ['css', 'css3', 'sass', 'scss'],
  tailwind: ['tailwind', 'tailwindcss'],
  bootstrap: ['bootstrap'],
  restapi: ['rest api', 'restful', 'api development'],
  graphql: ['graphql'],
  testing: ['jest', 'mocha', 'chai', 'cypress', 'playwright', 'testing'],
  machinelearning: ['machine learning', 'ml', 'scikit-learn', 'tensorflow', 'pytorch'],
  nlp: ['nlp', 'natural language processing'],
  powerbi: ['power bi', 'powerbi'],
};

const canonicalSkills = Object.keys(SKILL_ALIASES);

const normalizeText = (text = '') =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const extractSkillsFromText = (text = '') => {
  const normalized = normalizeText(text);

  return canonicalSkills.filter((skill) =>
    SKILL_ALIASES[skill].some((alias) => normalized.includes(alias.toLowerCase())),
  );
};

module.exports = {
  SKILL_ALIASES,
  canonicalSkills,
  normalizeText,
  extractSkillsFromText,
};
