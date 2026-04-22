const nodemailer = require('nodemailer');

const getTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

const sendShortlistEmail = async ({ to, candidateName, jobTitle, score }) => {
  const from = process.env.SMTP_FROM || 'noreply@example.com';

  if (!to) {
    throw new Error('Candidate email is missing.');
  }

  const transport = getTransport();

  if (!transport) {
    throw new Error('SMTP is not configured. Add SMTP_* vars in backend/.env.');
  }

  await transport.sendMail({
    from,
    to,
    subject: `Shortlisted for ${jobTitle}`,
    text: [
      `Hello ${candidateName || 'Candidate'},`,
      '',
      `Congratulations. You have been shortlisted for the role: ${jobTitle}.`,
      `Your current resume-job skill match score is ${score}%.`,
      '',
      'Our recruiter team will contact you with next steps.',
      '',
      'Regards,',
      'ParseX Hiring Team',
    ].join('\n'),
  });
};

module.exports = {
  sendShortlistEmail,
};
