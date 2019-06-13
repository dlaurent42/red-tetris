import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import useInterval from '../../hooks/useInterval';
import { KEYS, GAME_SETTINGS } from '../../config/constants';

const game = (props) => {

  // State
  const [tiles, setTiles] = useState([]);
  const [blockedRows, setBlockedRows] = useState(0);
  const [delay, setDelay] = useState(1000);

  // Tile moves
  const rotate = () => {};
  const dropDown = () => {};
  const moveDown = () => {};
  const moveLeft = () => {};
  const moveRight = () => {};

  // Game update handler
  const updateGame = () => {
    const movingTile = cloneDeep(tiles[0]);
    const updatedTiles = cloneDeep(tiles.slice(1));
    // Check collisions between movingTile and updated tiles
    //  -> if collision: movingTile.hasLanded = true
    //        -> if row(s) complete:
    //              - remove it from tiles
    //              - unshift tilesStack to top of tiles
    //              - emit specter
    //              - emit socket to tell player has scored
    //              - emit socket to ask for new tile for tilesStack
    //        -> else if movingTile.y == 0
    //              - game over
    //        -> else
    //              - emit specter
    //              - emit socket to ask for new tile for tilesStack
    //  -> if no collision, move it down
  };

  // Key strokes handler
  const onKeyStroke = (key) => {
    switch (key.keyCode) {
      case KEYS.ARROW_UP:
        console.log('ARROW_UP');
        break;
      case KEYS.ARROW_DOWN:
        console.log('ARROW_DOWN');
        break;
      case KEYS.ARROW_LEFT:
        console.log('ARROW_LEFT');
        break;
      case KEYS.ARROW_RIGHT:
        console.log('ARROW_RIGHT');
        break;
      case KEYS.SPACEBAR:
        console.log('SPACEBAR');
        break;
      default:
    }
  };

  // Add key event listeners
  useEffect(() => {
    document.addEventListener('keydown', onKeyStroke);
    return () => document.removeEventListener('keydown', onKeyStroke);
  });

  // Update game each [delay] ms
  useInterval(() => updateGame(), delay);

  // Make game faster each 10 seconds
  useInterval(() => {
    if (delay > 150) {
      console.log(`Accelerate from ${Math.floor(delay)}ms to ${Math.floor(delay * 0.8)}ms`);
      setDelay(delay * 0.8);
    }
  }, 10 * 1000);

  return <div />;
};

/*
socket={props.socket}
tilesStack={tilesStack}
setTilesStack={setTilesStack}
*/

export default game;
