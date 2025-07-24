// // src/index.js

// require('dotenv').config();
// const cron = require('node-cron');
// const pollMentions = require('./cron/pollMentions');

// console.log('Bot started...');

// cron.schedule('*/5 * * * *', async () => {
//   console.log('Checking mentions...');
//   await pollMentions();
// });


const pollMentions = require('./cron/pollMentions');

setInterval(async () => {
  console.log(`[${new Date().toISOString()}] Checking mentions...`);
  await pollMentions();
}, 60 * 1000); // 60 seconds
