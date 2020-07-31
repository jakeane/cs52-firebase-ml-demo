import React, { useState, useEffect } from 'react';
import { Segment, Header, Form } from 'semantic-ui-react';

import { db, storePhoto, getAlbumPhotos } from '../services/database';

// HANDLE THE Each child in a list should have a unique "key" prop. ERROR

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
    return prps.photos.map((photo, index) => (
      <div className="images">
        <img
          src={photo.download}
          alt={photo.name}
          className="album-photo"
          key={index}
        />
      </div>
    ));
  };

  return (
    <div className="image-container">
      <PhotoItems photos={props.photos} />
    </div>
  );
});

const AlbumDetails = (props) => {
  const [album, setAlbum] = useState({ name: 'Loading...', photos: [] });
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const loadAlbumInfo = async () => {
      const photos = await getAlbumPhotos(props.id);
      setAlbum({
        name: props.id,
        photos: photos,
      });
      setPhotos(photos);
    };

    loadAlbumInfo();
  }, [props.id]);

  useEffect(() => {
    const subscription = db
      .collection('albums')
      .doc(props.id)
      .collection('photos')
      .orderBy('created', 'desc')
      .onSnapshot((snapshot) => {
        setPhotos(snapshot.docs.map((doc) => doc.data()));
      });

    return () => subscription();
  }, [props.id]);

  return (
    <Segment>
      <Header as="h3">{album.name}</Header>
      <ImageUpload albumName={album.name} />
      <PhotosList photos={photos} albumName={album.name} />
    </Segment>
  );
};

export default AlbumDetails;
