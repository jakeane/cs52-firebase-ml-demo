import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyC-wavH3KirRxFkKimJkZIAmJJgeq0qHj8',
  authDomain: 'cs52-firebase-ml-demo.firebaseapp.com',
  databaseURL: 'https://cs52-firebase-ml-demo.firebaseio.com',
  projectId: 'cs52-firebase-ml-demo',
  storageBucket: 'cs52-firebase-ml-demo.appspot.com',
  messagingSenderId: '677674140888',
  appId: '1:677674140888:web:cf4023d8620b6c8b6303ad',
};
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
const storage = firebase.storage();

// create new album
export const createAlbum = (albumName) => {
  db.collection('albums').doc(albumName).set({
    name: albumName,
  });
};

// get all albums
export const getAlbums = async () => {
  //   const snapshot = await db.collection('albums').get();
  //   return snapshot.docs.map((doc) => doc.data());
  return db.collection('albums').onSnapshot((snapshot) => {
    return snapshot.docs.map((doc) => doc.data());
  });
};

// upload photo to storage
export const storePhoto = async (albumName, file) => {
  storage
    .ref(`photos/${albumName}/${file.name}`)
    .put(file)
    .then((result) => {
      return result.ref.getDownloadURL();
    })
    .then((url) => {
      db.collection('albums')
        .doc(albumName)
        .collection('photos')
        .doc(file.name)
        .set({ name: file.name, download: url });
    });
};

export const getAlbumPhotos = async (albumName) => {
  const snapshot = await db
    .collection('albums')
    .doc(albumName)
    .collection('photos')
    .get();
  return snapshot.docs.map((doc) => doc.data());
};

export const getPhotoURL = (albumName, fileName) => {
  return storage.ref(`photos/${albumName}/${fileName}`).getDownloadURL();
};
