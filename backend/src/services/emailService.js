const sendShortlistEmail = async ({ to, candidateName, jobTitle, score }) => {
  // Keep behavior deterministic in demo mode.
  console.log(
    `Mock email successfully sent to ${to} for ${candidateName} - ${jobTitle} (${score}%)`,
  );
  return true;
};

module.exports = {
  sendShortlistEmail,
};
