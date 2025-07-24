// src/cron/pollMentions.js

const { twitterClient } = require('../config/twitterClient');
const tweetController = require('../controllers/tweetController');
require('dotenv').config();

let lastTweetId = null;

const pollMentions = async () => {
    try {
      const me = await twitterClient.v2.me();
      const userId = me.data.id;
      const myUsername = process.env.TWITTER_USERNAME?.toLowerCase();
  
      const options = {
        expansions: ['author_id'],
        'tweet.fields': ['created_at'],
        max_results: 10
      };
  
      if (lastTweetId) {
        options.since_id = lastTweetId;
      }
  
      const mentions = await twitterClient.v2.userMentionTimeline(userId, options);
  
      for await (const tweet of mentions) {
        const text = tweet.text.toLowerCase();
        if (myUsername && text.includes(`@${myUsername}`)) {
          await tweetController.processMention(tweet);
          lastTweetId = tweet.id;
        }
      }
    } catch (error) {
      console.error('Error polling mentions:', error);
    }
  };
  

module.exports = pollMentions;
