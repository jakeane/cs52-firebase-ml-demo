import * as firebase from 'firebase';
import axios from 'axios';

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
    .then(async (url) => {
      const body = {
        uri: `gs://cs52-firebase-ml-demo.appspot.com/photos/${albumName}/${file.name}`,
      };
      const labels = await axios.post(
        'http://cs52-ml-demo.herokuapp.com/api',
        body
      );
      return [url, labels.data.map((label) => label.toLowerCase())];
    })
    .then((data) => {
      console.log(data[1]);
      db.collection('albums')
        .doc(albumName)
        .collection('photos')
        .doc(file.name)
        .set({ name: file.name, download: data[0], labels: data[1] });
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

export const searchPhotosByLabel = async (labels) => {
  let labeledPhotos = [];
  const albums = await db.collection('albums').get();
  albums.docs.forEach((doc) => {
    labeledPhotos.push(
      db
        .collection('albums')
        .doc(doc.id)
        .collection('photos')
        .where('labels', 'array-contains-any', labels)
        .get()
        .then((snapshot) => {
          return snapshot.docs.map((doc) => doc.data());
        })
    );
  });

  const resultPhotos = await Promise.all(labeledPhotos).then((res) => {
    return [].concat.apply([], res);
  });
  return resultPhotos;
};
