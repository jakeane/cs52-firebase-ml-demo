import React from 'react';
import { Grid } from 'semantic-ui-react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import NewAlbum from './components/NewAlbum';
import AlbumsList from './components/AlbumsList';
import AlbumDetails from './components/AlbumDetails';
import Search from './components/Search';

function App() {
  return (
    <Router>
      <Grid padded>
        <Grid.Column>
          <Route path="/" exact component={NewAlbum} />
          <Route path="/" exact component={AlbumsList} />
          <Route path="/" exact component={Search} />
          <Route
            path="/albums/:albumId"
            render={() => (
              <div>
                <NavLink to="/">Back to Albums List</NavLink>
              </div>
            )}
          />
          <Route
            path="/albums/:albumId"
            render={(props) => <AlbumDetails id={props.match.params.albumId} />}
          />
        </Grid.Column>
      </Grid>
    </Router>
  );
}

export default App;
