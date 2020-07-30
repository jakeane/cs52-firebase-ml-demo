import React, { useState } from 'react';
import { Segment, Header, Input } from 'semantic-ui-react';

import { createAlbum } from '../services/database';

const NewAlbum = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    createAlbum(name);
    setName('');
  };

  return (
    <Segment>
      <Header as="h3">Add a new album</Header>
      <Input
        type="text"
        placeholder="New Album Name"
        icon="plus"
        iconPosition="left"
        action={{
          content: 'Create',
          onClick: handleSubmit,
        }}
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </Segment>
  );
};

export default NewAlbum;
