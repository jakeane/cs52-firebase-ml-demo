import React, { useState, useEffect } from 'react';
import { Segment, Header, Form, Divider } from 'semantic-ui-react';

import {
  db,
  storePhoto,
  getAlbumPhotos,
  getPhotoURL,
} from '../services/database';

const ImageUpload = (props) => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file) => {
    storePhoto(props.albumName, file);
    // It is possible to have progress bar for upload
  };

  const onChange = async (e) => {
    setUploading(true);

    const files = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files.item(i));
    }
    await Promise.all(files.map((f) => uploadFile(f)));

    setUploading(false);
  };

  return (
    <div>
      <Form.Button
        onClick={() => document.getElementById('add-image-file-input').click()}
        disabled={uploading}
        icon="file image outline"
        content={uploading ? 'Uploading...' : 'Add Images'}
      />
      <input
        id="add-image-file-input"
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export const PhotosList = React.memo((props) => {
  const PhotoItems = (prps) => {
    return prps.photos.map((photo) => (
      <img src={photo.download} alt={photo.name} className="album-photo" />
    ));
  };

  return (
    <div>
      <Divider hidden />
      <PhotoItems photos={props.photos} />
    </div>
  );
});

const AlbumDetails = (props) => {
  const [album, setAlbum] = useState({ name: 'Loading...', photos: [] });
  const [photos, setPhotos] = useState([]);
  const [hasMorePhotos, setHasMorePhotos] = useState(true);
  const [fetchingPhotos, setFetchingPhotos] = useState(false);
  const [nextPhotosToken, setNextPhotosToken] = useState(null);

  useEffect(() => {
    const loadAlbumInfo = async () => {
      setFetchingPhotos(true);
      const photos = await getAlbumPhotos(props.id);
      setAlbum({
        name: props.id,
        photos: photos,
      });
      setPhotos(photos);
      setFetchingPhotos(false);
    };

    loadAlbumInfo();
  }, [props.id]);

  useEffect(() => {
    const subscription = db
      .collection('albums')
      .doc(props.id)
      .collection('photos')
      .onSnapshot((snapshot) => {
        setPhotos(snapshot.docs.map((doc) => doc.data()));
      });

    return () => subscription();
  }, [props.id]);

  //   const fetchNextPhotos = async () => {
  //     const FETCH_LIMIT = 20;
  //     setFetchingPhotos(true);
  //     const queryArgs = 'query'; // set up queryArgs
  //     const results = 'result'; // listPhotosByAlbum with queryArgs
  //     setPhotos((p) => p.concat(results.data.listPhotosByAlbum.items));
  //     setNextPhotosToken(results.data.listPhotosByAlbum.nextToken);
  //     setHasMorePhotos(
  //       // eslint-disable-next-line comma-dangle
  //       results.data.listPhotosByAlbum.items.length === FETCH_LIMIT
  //     );
  //     setFetchingPhotos(false);
  //   };

  //   useEffect(() => {
  //     fetchNextPhotos();
  //   }, []);

  //   useEffect(() => {
  //     let subscription;
  //     console.log('hey from useeffect');
  //     async function setupSubscription() {
  //       const user = 'user'; // firebase.auth().user or something
  //       subscription = 'subscription'; // subscribe to album updates
  //     }
  //     setupSubscription();

  //     return () => {
  //       subscription.unsubscribe();
  //     };
  //   }, [props.id]);
  console.log('Photos:', photos);

  return (
    <Segment>
      <Header as="h3">{album.name}</Header>
      <ImageUpload albumName={album.name} />
      <PhotosList photos={photos} albumName={album.name} />
      {hasMorePhotos && (
        <Form.Button
          //   onClick={() => fetchNextPhotos()}
          icon="refresh"
          disabled={fetchingPhotos}
          content={fetchingPhotos ? 'Loading...' : 'Load more photos'}
        />
      )}
    </Segment>
  );
};

export default AlbumDetails;
