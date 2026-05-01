const dayMs = 86400000;

export function getDemoJobs() {
  return [
    {
      _id: 'demo-job-1',
      title: 'Web3 Engineer',
      description:
        'Build decentralized applications, smart contracts, and blockchain integrations for core platform workflows.',
      requiredSkills: ['Solidity', 'Ethereum', 'Web3.js', 'Smart Contracts', 'Node.js'],
      createdAt: new Date(Date.now() - 2 * dayMs).toISOString(),
      isDemo: true,
    },
    {
      _id: 'demo-job-2',
      title: 'Backend Engineer',
      description:
        'Design robust APIs and microservices using Node.js, MongoDB, and cloud deployment best practices.',
      requiredSkills: ['Node.js', 'MongoDB', 'Express', 'REST API', 'PostgreSQL'],
      createdAt: new Date(Date.now() - 4 * dayMs).toISOString(),
      isDemo: true,
    },
    {
      _id: 'demo-job-3',
      title: 'Full Stack Role',
      description:
        'Ship product features end-to-end across React frontend and Node backend with strong ownership.',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript'],
      createdAt: new Date(Date.now() - 6 * dayMs).toISOString(),
      isDemo: true,
    },
    {
      _id: 'demo-job-4',
      title: 'Software Engineer',
      description:
        'Generalist role focused on architecture, coding fundamentals, and problem solving across the stack.',
      requiredSkills: ['Python', 'Java', 'C++', 'System Design', 'Git'],
      createdAt: new Date(Date.now() - 8 * dayMs).toISOString(),
      isDemo: true,
    },
    {
      _id: 'demo-job-5',
      title: 'Senior Frontend Engineer',
      description:
        'Lead UI implementation with React and TypeScript while improving performance and design consistency.',
      requiredSkills: ['React', 'JavaScript', 'Tailwind', 'TypeScript'],
      createdAt: new Date(Date.now() - 10 * dayMs).toISOString(),
      isDemo: true,
    },
  ];
}

export function getDemoCandidates() {
  return [
    {
      _id: 'demo-candidate-1',
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
      education: ['BS Computer Science'],
      experience: '5+ years',
      createdAt: new Date(Date.now() - 1 * dayMs).toISOString(),
      aiAnalysis: { confidence: 91 },
      isDemo: true,
    },
    {
      _id: 'demo-candidate-2',
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      skills: ['Node.js', 'MongoDB', 'Express', 'JavaScript'],
      education: ['BS Information Technology'],
      experience: '4+ years',
      createdAt: new Date(Date.now() - 2 * dayMs).toISOString(),
      aiAnalysis: { confidence: 86 },
      isDemo: true,
    },
    {
      _id: 'demo-candidate-3',
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      skills: ['React', 'Node.js', 'MongoDB', 'Python'],
      education: ['BS Computer Science', 'MS Data Science'],
      experience: '6+ years',
      createdAt: new Date(Date.now() - 3 * dayMs).toISOString(),
      aiAnalysis: { confidence: 89 },
      isDemo: true,
    },
    {
      _id: 'demo-candidate-4',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      skills: ['Python', 'SQL', 'AWS', 'Docker'],
      education: ['BS Software Engineering'],
      experience: '3+ years',
      createdAt: new Date(Date.now() - 4 * dayMs).toISOString(),
      aiAnalysis: { confidence: 83 },
      isDemo: true,
    },
  ];
}
