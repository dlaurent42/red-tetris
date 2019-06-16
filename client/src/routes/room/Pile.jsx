import React from 'react';
import PropTypes from 'prop-types';

const displayTile = tile => <div />;

const pile = props => (
  <div className="tiles-stack">
    {props.tilesStack.map(tile => displayTile(tile))}
  </div>
);

pile.propTypes = {
  tilesStack: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default pile;
