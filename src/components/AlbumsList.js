import React, { useState, useEffect } from 'react';
import { Segment, Header, List } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { getAlbums } from '../services/database';

// function makeComparator(key, order = 'asc') {
//   return (a, b) => {
//     // eslint-disable-next-line no-prototype-builtins
//     if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
//       return 0;
//     }

//     const aVal = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
//     const bVal = typeof a[key] === 'string' ? b[key].toUpperCase() : b[key];

//     let comparison = 0;
//     if (aVal > bVal) {
//       comparison = 1;
//     } else if (aVal < bVal) {
//       comparison = -1;
//     }

//     return order === 'desc' ? comparison * -1 : comparison;
//   };
// }

const AlbumsList = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getAlbums();
      console.log('Results:', result);
      setAlbums(result); //.data.listAlbums.items);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let subscription;
    async function setupSubscription() {
      const user = 'user'; // firebase.auth().user
      subscription = 'subscription'; // subscribe to album changes
    }
    setupSubscription();

    return () => subscription.unsubscribe();
  }, []);

  const albumItems = () => {
    console.log(albums);
    return albums.map((album) => (
      <List.Item key={album.name}>
        <NavLink to={`/albums/${album.name}`}>{album.name}</NavLink>
      </List.Item>
    ));
  };

  return (
    <Segment>
      <Header as="h3">My Albums</Header>
      <List divided relaxed>
        {albumItems()}
      </List>
    </Segment>
  );
};

export default AlbumsList;
