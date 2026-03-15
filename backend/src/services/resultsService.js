const cron = require('node-cron');
const Election = require('../models/Election');
const User = require('../models/User');
const { sendResultsEmail } = require('./emailService');

/**
 * Schedules a one-time job to reveal results exactly at the election deadline.
 * Uses node-cron to fire at the right minute.
 */
exports.scheduleResultsReveal = (election) => {
  const deadline = new Date(election.deadline);
  const cronExpr = `${deadline.getMinutes()} ${deadline.getHours()} ${deadline.getDate()} ${deadline.getMonth() + 1} *`;

  cron.schedule(cronExpr, async () => {
    await Election.findByIdAndUpdate(election._id, { resultsRevealed: true, status: 'ended' });
    const approvedVoters = await User.find({ status: 'approved', role: 'voter' });
    await sendResultsEmail(approvedVoters, election, []);
    console.log(`📊 Results revealed for election: ${election.title}`);
  }, { scheduled: true, timezone: 'UTC' });
};