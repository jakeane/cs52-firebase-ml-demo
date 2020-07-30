import * as firebase from 'firebase';

var firebaseConfig = {
  apiKey: 'AIzaSyC-wavH3KirRxFkKimJkZIAmJJgeq0qHj8',
  authDomain: 'cs52-firebase-ml-demo.firebaseapp.com',
  databaseURL: 'https://cs52-firebase-ml-demo.firebaseio.com',
  projectId: 'cs52-firebase-ml-demo',
  storageBucket: 'cs52-firebase-ml-demo.appspot.com',
  messagingSenderId: '677674140888',
  appId: '1:677674140888:web:cf4023d8620b6c8b6303ad',
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// create new album
export const createAlbum = (albumName) => {
  db.collection('albums').doc(albumName).set({
    name: albumName,
  });
};

// get all albums
export const getAlbums = async () => {
  const snapshot = await db.collection('albums').get();
  return snapshot.docs.map((doc) => doc.data());
};
