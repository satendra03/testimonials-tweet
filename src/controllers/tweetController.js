// src/controllers/tweetController.js

const tweetService = require('../services/tweetService');

const processMention = async (tweet) => {
  return await tweetService.handleMention(tweet);
};

module.exports = { processMention };