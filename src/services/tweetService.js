// src/services/tweetService.js

const { doc, setDoc } = require('firebase/firestore');
const db = require('../config/firebase');
const { rwClient } = require('../config/twitterClient');
const sentiment = require('../utils/sentiment');
const userModel = require('../models/userModel');

const handleMention = async (tweet) => {
  const tweetAge = Date.now() - new Date(tweet.created_at).getTime();
  if (tweetAge < 30 * 60 * 1000) return null;

  const score = sentiment.analyze(tweet.text);
  if (score < 1) return null;

  const githubUsername = extractGithubMention(tweet.text);
  if (!githubUsername) return null;

  await userModel.incrementCredit(githubUsername);
  await saveTestimonial(tweet, githubUsername);
  await rwClient.v2.reply(
    `Thanks for the kind words, ${githubUsername}! 🎉 We've added credit to your account.`,
    tweet.id
  );

  return true;
};

const extractGithubMention = (text) => {
  const match = text.match(/@([a-zA-Z0-9-]{1,39})/g);
  if (!match || match.length < 2) return null; // First mention is bot, second is GitHub
  return match[1].replace('@', '');
};

const saveTestimonial = async (tweet, githubUsername) => {
  const tweetRef = doc(db, 'tweets', tweet.id);
  await setDoc(tweetRef, {
    text: tweet.text,
    twitterHandle: tweet.author?.username || tweet.author_id,
    githubUsername,
    tweetId: tweet.id,
    createdAt: tweet.created_at,
    tweetUrl: `https://twitter.com/${tweet.author?.username || 'user'}/status/${tweet.id}`
  });
};

module.exports = { handleMention }; // or add saveTestimonial if you need it elsewhere
