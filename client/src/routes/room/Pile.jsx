import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const displayTile = tile => <div />;

const pile = (props) => {
  console.log('[pile]');
  return (
    <div className="tiles-stack">
      {props.tilesStack.map(tile => displayTile(tile))}
    </div>
  );
};

pile.propTypes = {
  tilesStack: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default pile;
