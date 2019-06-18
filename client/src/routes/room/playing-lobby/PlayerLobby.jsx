import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, find, countBy, mapValues, min, minBy, groupBy } from 'lodash';
import TetrisGrid from '../components/TetrisGrid';
import useInterval from '../../../hooks/useInterval';
import { SOCKETS, KEYS, GAME_SETTINGS } from '../../../config/constants';

const playerLobby = (props) => {

  // State
  const [blockedRows, setBlockedRows] = useState(0);
  const [delay, setDelay] = useState(2000);

  // Check collisions
  const isCollision = (movingTile, otherTiles) => {
    let collision = false;
    if (!movingTile) {
      console.log('Collision: no moving tile...');
      return collision;
    }
    movingTile.positions.some((pos) => {

      // Check if moving Tile is out-of-map
      if (pos.x < 0 || pos.x >= GAME_SETTINGS.GRID_WIDTH) {
        console.log('Collision: out-of-horizontal bounds');
        collision = true;
      } else if (pos.y >= GAME_SETTINGS.GRID_HEIGHT) {
        console.log('Collision: piece reach bottom of grid');
        collision = true;
      }

      // Check collisions between moving tile and other tiles
      otherTiles.some((tile) => {
        if (find(tile.positions, { x: pos.x, y: pos.y })) {
          console.log('Collision: 2 tiles are hitting each other');
          collision = true;
        }
        return collision;
      });
      return collision;
    });
    return collision;
  };

  // Check scoring
  const handleScoring = (pieces) => {

    // Get scoring rows as array
    const scoringRows = Object
      .entries(countBy(pieces.map(el => el.positions).flat(), 'y'))
      .map(entry => ((entry[1] >= GAME_SETTINGS.GRID_WIDTH) ? parseInt(entry[0], 10) : []))
      .flat();

    // Warn server about scoring
    if (scoringRows.length) {
      console.log('emitting ROOM_USER_UPDATE');
      props.socket.emit(SOCKETS.GAME_SCORED, { id: props.id, score: scoringRows.length });
    }

    // Remove rows corresponding to scoringRows
    let updatedPieces = pieces;
    scoringRows.forEach((y) => {
      updatedPieces = updatedPieces.map(tile => ({
        ...tile,
        innerPositions: tile.innerPositions.filter((el, idx) => (tile.positions[idx].y !== y)),
        positions: tile.positions.filter(el => el.y !== y),
      }));
    });

    //  Drop down pieces
    return updatedPieces.map(piece => ({
      ...piece,
      positions: piece.positions.map(pos => ({
        x: pos.x,
        y: (pos.y < min(scoringRows)) ? pos.y + scoringRows.length : pos.y,
      })),
    }));
  };

  // Tile moves
  const rotate = () => {
    const movingTile = cloneDeep(props.tiles[0]);

    // If piece has size equal to 2, it is a square
    if (!movingTile || movingTile.size === 2) return;

    // Set array rotating matrix following size
    const rotationMatrix = (movingTile.size === 3) ? [2, 1, 0] : [3, 2, 1, 0];

    // Rotate tile
    movingTile.positions = movingTile.positions.map((pos, idx) => ({
      x: pos.x
        + rotationMatrix[movingTile.innerPositions[idx].y]
        - movingTile.innerPositions[idx].x,
      y: pos.y + movingTile.innerPositions[idx].x - movingTile.innerPositions[idx].y,
    }));
    movingTile.innerPositions = movingTile.innerPositions.map(pos => ({
      x: rotationMatrix[pos.y],
      y: pos.x,
    }));

    if (!isCollision(movingTile, props.tiles.slice(1))) {
      props.setTiles([movingTile, ...props.tiles.slice(1)]);
    }
  };

  const dropDown = () => {

    // Distinguish moving tile from other tiles
    const movingTile = cloneDeep(props.tiles[0]);
    const otherTiles = cloneDeep(props.tiles.slice(1));

    // Move until a collision happens
    while (!isCollision(movingTile, props.tiles.slice(1))) {
      movingTile.positions = movingTile.positions.map(pos => ({ x: pos.x, y: pos.y + 1 }));
    }

    // Set moving tile hasLanded
    movingTile.hasLanded = true;
    movingTile.positions = movingTile.positions.map(pos => ({ x: pos.x, y: pos.y - 1 }));

    // Handle scoring
    const finalTiles = handleScoring([movingTile, ...otherTiles]);

    // If a collision occurs between tiles and next moving tile, then it is end of the game
    if (isCollision(props.tilesStack[0], finalTiles)) {
      console.log(props.tilesStack[0], finalTiles);
      console.log('emitting GAME_OVER');
      props.setTiles([props.tilesStack[0], ...finalTiles]);
      props.socket.emit(SOCKETS.GAME_OVER, { id: props.id });

    // Update tiles and ask a new tile to server if necessary
    } else {
      props.setTiles([props.tilesStack[0], ...finalTiles.filter(tile => tile.positions.length)]);
      props.setTilesStack(props.tilesStack.slice(1));
      console.log('emitting GAME_NEW_TILE and GAME_SPECTER_UPDATE');
      props.socket.emit(SOCKETS.GAME_NEW_TILE, { id: props.id });
      props.socket.emit(SOCKETS.GAME_SPECTER_UPDATE, {
        id: props.id,
        specter: mapValues(groupBy(finalTiles.map(el => el.positions).flat(), 'x'), val => minBy(val, 'y').y),
      });
    }
  };

  const moveDown = () => {
    const movingTile = cloneDeep(props.tiles[0]);
    if (!movingTile) return;
    movingTile.positions = movingTile.positions.map(pos => ({ x: pos.x, y: pos.y + 1 }));
    if (!isCollision(movingTile, props.tiles.slice(1))) {
      props.setTiles([movingTile, ...props.tiles.slice(1)]);
    } else dropDown();
  };

  const moveHorizontally = (direction) => {
    const movingTile = cloneDeep(props.tiles[0]);
    if (!movingTile) return;
    movingTile.positions = movingTile.positions.map(pos => ({
      x: (direction === 'left') ? pos.x - 1 : pos.x + 1,
      y: pos.y,
    }));
    if (!isCollision(movingTile, props.tiles.slice(1))) {
      props.setTiles([movingTile, ...props.tiles.slice(1)]);
    }
  };

  // Key strokes handler
  const onKeyStroke = (key) => {
    if (!props.tiles.length) return null;
    switch (key.keyCode) {
      case KEYS.ARROW_UP: return rotate();
      case KEYS.ARROW_DOWN: return moveDown();
      case KEYS.ARROW_LEFT: return moveHorizontally('left');
      case KEYS.ARROW_RIGHT: return moveHorizontally('right');
      case KEYS.SPACEBAR: return dropDown();
      default: return null;
    }
  };

  // Add key event listeners
  useEffect(() => {
    document.addEventListener('keydown', onKeyStroke);
    return () => { document.removeEventListener('keydown', onKeyStroke); };
  });

  // Listen to enemy scoring
  useEffect(() => {
    props.socket.on(SOCKETS.GAME_SCORED, (data) => {
      console.log('receiving GAME_SCORED', data);
      setBlockedRows(blockedRows + data.score - 1);
      // addRows at the bottom
      // if (conflict) => move moving tile to top until no more conflict
      // else do nothing
    });
  }, []);

  // Listen to game new tile event
  useEffect(() => {
    props.socket.on(SOCKETS.GAME_NEW_TILE, (data) => {
      console.log('receiving GAME_NEW_TILE', data);
      props.setTilesStack(data.tilesStack);
    });
  }, []);

  // Update game each [delay] ms and make game faster each 10 seconds
  useInterval(() => moveDown(), delay);
  useInterval(() => { if (delay > 150) setDelay(delay * 0.9); }, 30 * 1000);
  return (
    <TetrisGrid
      tiles={props.tiles}
    />
  );
};

playerLobby.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  id: PropTypes.string.isRequired,
  tiles: PropTypes.arrayOf(PropTypes.any).isRequired,
  setTiles: PropTypes.func.isRequired,
  tilesStack: PropTypes.arrayOf(PropTypes.any).isRequired,
  setTilesStack: PropTypes.func.isRequired,
};

export default playerLobby;
