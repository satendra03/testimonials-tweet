// src/utils/sentiment.js

const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const analyze = (text) => {
  const result = sentiment.analyze(text);
  return result.score; // positive = good
};

module.exports = { analyze };