import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, find, countBy, mapValues, min, minBy, groupBy } from 'lodash';
import TetrisGrid from '../components/TetrisGrid';
import useInterval from '../../../hooks/useInterval';
import { SOCKETS, KEYS, GAME_SETTINGS } from '../../../config/constants';

const playerLobby = (props) => {

  // State
  const [blockedRows, setBlockedRows] = useState([]);
  const [delay, setDelay] = useState(1000);

  // Check collisions
  const isCollision = (movingTile, otherTiles) => {
    let collision = false;
    if (!movingTile) return collision;
    movingTile.positions.some((pos) => {

      // Check if moving Tile is out-of-map
      if (pos.x < 0 || pos.x >= GAME_SETTINGS.GRID_WIDTH) collision = true;
      else if (pos.y >= GAME_SETTINGS.GRID_HEIGHT) collision = true;

      // Check collisions between moving tile and other tiles
      otherTiles.some((tile) => {
        if (find(tile.positions, { x: pos.x, y: pos.y })) collision = true;
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
      .flat()
      .filter(el => !blockedRows.includes(el));

    // Warn server about scoring
    if (scoringRows.length) {
      props.socket.emit(SOCKETS.GAME_SCORED, { id: props.id, score: scoringRows.length });
    }

    // Remove rows corresponding to scoringRows
    let updatedPieces = pieces;
    scoringRows.forEach((y) => {
      updatedPieces = updatedPieces.map(tile => (
        (tile.innerPositions) ? {
          ...tile,
          innerPositions: tile.innerPositions.filter((el, idx) => (tile.positions[idx].y !== y)),
          positions: tile.positions.filter(el => el.y !== y),
        } : tile
      ));
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
      props.setTiles([props.tilesStack[0], ...finalTiles]);
      props.socket.emit(SOCKETS.GAME_OVER, { id: props.id });

    // Update tiles and ask a new tile to server if necessary
    } else {
      props.setTiles([props.tilesStack[0], ...finalTiles.filter(tile => tile.positions.length)]);
      props.setTilesStack(props.tilesStack.slice(1));
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

  const gameScoringHandler = (data) => {

    // Move current tiles
    const movingTile = props.tiles[0];
    const otherTiles = props.tiles.slice(1).map(tile => ({
      ...tile,
      positions: tile.positions.map(position => ({
        x: position.x,
        y: position.y - data.delta,
      })),
    }));

    // Add blocked tiles
    const blockedTiles = Array(data.delta).fill(0).map((row, idx) => ({
      color: 'black',
      positions: [
        { x: 0, y: GAME_SETTINGS.GRID_HEIGHT - idx - 1 },
        { x: 1, y: GAME_SETTINGS.GRID_HEIGHT - idx - 1 },
        { x: 2, y: GAME_SETTINGS.GRID_HEIGHT - idx - 1 },
        { x: 3, y: GAME_SETTINGS.GRID_HEIGHT - idx - 1 },
        { x: 4, y: GAME_SETTINGS.GRID_HEIGHT - idx - 1 },
        { x: 5, y: GAME_SETTINGS.GRID_HEIGHT - idx - 1 },
        { x: 6, y: GAME_SETTINGS.GRID_HEIGHT - idx - 1 },
        { x: 7, y: GAME_SETTINGS.GRID_HEIGHT - idx - 1 },
        { x: 8, y: GAME_SETTINGS.GRID_HEIGHT - idx - 1 },
        { x: 9, y: GAME_SETTINGS.GRID_HEIGHT - idx - 1 },
      ],
    }));

    // Move moving tile if needed
    while (isCollision(movingTile, otherTiles)) {
      Object.assign(movingTile, {
        positions: movingTile.positions.map(position => ({
          x: position.x,
          y: position.y - 1,
        })),
      });
    }

    setBlockedRows(
      Array(data.blockedRows).fill(0).map((el, idx) => GAME_SETTINGS.GRID_HEIGHT - idx - 1),
    );
    props.setTiles([movingTile, ...otherTiles, ...blockedTiles]);
  };

  const gameNewTileHandler = (data) => {
    props.setTilesStack(data.tilesStack);
  };

  // Listen to enemy scoring
  useEffect(() => {
    props.socket.on(SOCKETS.GAME_SCORED, gameScoringHandler);
    return () => props.socket.removeListener(SOCKETS.GAME_SCORED, gameScoringHandler);
  }, [props.tiles]);

  // Listen to game new tile event
  useEffect(() => {
    props.socket.on(SOCKETS.GAME_NEW_TILE, gameNewTileHandler);
    return () => props.socket.removeListener(SOCKETS.GAME_NEW_TILE, gameNewTileHandler);
  }, []);

  // Update game each [delay] ms and make game faster each 10 seconds
  useInterval(() => moveDown(), delay);
  useInterval(() => { if (delay > 150 && props.mode === 'hard') setDelay(delay * 0.9); }, 30 * 1000);
  return (
    <TetrisGrid
      tiles={props.tiles}
    />
  );
};

playerLobby.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  id: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  tiles: PropTypes.arrayOf(PropTypes.any).isRequired,
  setTiles: PropTypes.func.isRequired,
  tilesStack: PropTypes.arrayOf(PropTypes.any).isRequired,
  setTilesStack: PropTypes.func.isRequired,
};

export default playerLobby;
