import React, { useState } from 'react';
import { Header, Segment, Input } from 'semantic-ui-react';
import { PhotosList } from './AlbumDetails';
import { searchPhotosByLabel } from '../services/database';

const Search = () => {
  const [photos, setPhotos] = useState([]);
  const [label, setLabel] = useState('');
  const [hasResults, setHasResults] = useState(false);
  const [searched, setSearched] = useState(false);

  const getPhotosForLabel = async () => {
    setPhotos([]);
    const labels = label.split(',').map((str) => str.trim().toLowerCase());
    const result = await searchPhotosByLabel(labels);
    if (result.length !== 0) {
      setHasResults(result.length > 0);
      setPhotos((p) => p.concat(result));
    }
    setSearched(true);
  };

  const NoResults = () => {
    return !searched ? (
      ''
    ) : (
      <Header as="h4" color="grey">
        No photos found matching '{label}'
      </Header>
    );
  };

  return (
    <Segment>
      <Input
        type="text"
        placeholder="Search for photos"
        icon="search"
        iconPosition="left"
        action={{ content: 'Search', onClick: getPhotosForLabel }}
        name="label"
        value={label}
        onChange={(e) => {
          setLabel(e.target.value);
          setSearched(false);
        }}
      />
      {hasResults ? <PhotosList photos={photos} /> : <NoResults />}
    </Segment>
  );
};

export default Search;
