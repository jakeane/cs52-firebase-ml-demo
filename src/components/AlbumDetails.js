import React, { useState, useEffect } from 'react';
import { Segment, Header, Form, Divider } from 'semantic-ui-react';

const ImageUpload = (props) => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file) => {
    const fileName = 'filename'; // generate filename (with push?)
    const user = 'user'; // firebase.auth().user?

    const result = 'result'; // put image in storage

    console.log('Uploaded file:', result);
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
    return prps.photos.map((photo) => <h3>IMAGE</h3>);
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
      const results = setAlbum('album'); // getAlbum by id //results.data.getAlbum);
    };

    loadAlbumInfo();
  }, [props.id]);

  const fetchNextPhotos = async () => {
    const FETCH_LIMIT = 20;
    setFetchingPhotos(true);
    const queryArgs = 'query'; // set up queryArgs
    const results = 'result'; // listPhotosByAlbum with queryArgs
    setPhotos((p) => p.concat(results.data.listPhotosByAlbum.items));
    setNextPhotosToken(results.data.listPhotosByAlbum.nextToken);
    setHasMorePhotos(
      // eslint-disable-next-line comma-dangle
      results.data.listPhotosByAlbum.items.length === FETCH_LIMIT
    );
    setFetchingPhotos(false);
  };

  useEffect(() => {
    fetchNextPhotos();
  }, []);

  useEffect(() => {
    let subscription;
    console.log('hey from useeffect');
    async function setupSubscription() {
      const user = 'user'; // firebase.auth().user or something
      subscription = 'subscription'; // subscribe to album updates
    }
    setupSubscription();

    return () => {
      subscription.unsubscribe();
    };
  }, [props.id]);

  return (
    <Segment>
      <Header as="h3">{album.name}</Header>
      <ImageUpload albumId={album.id} />
      <PhotosList photos={photos} />
      {hasMorePhotos && (
        <Form.Button
          onClick={() => fetchNextPhotos()}
          icon="refresh"
          disabled={fetchingPhotos}
          content={fetchingPhotos ? 'Loading...' : 'Load more photos'}
        />
      )}
    </Segment>
  );
};

export default AlbumDetails;
