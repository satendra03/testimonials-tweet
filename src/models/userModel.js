// src/models/userModel.js

const { doc, getDoc, setDoc, updateDoc } = require('firebase/firestore');
const db = require('../config/firebase');

const incrementCredit = async (username) => {
  const ref = doc(db, 'users', username);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { credits: (snap.data().credits || 0) + 1 });
  } else {
    await setDoc(ref, { credits: 1 });
  }
};

module.exports = { incrementCredit };