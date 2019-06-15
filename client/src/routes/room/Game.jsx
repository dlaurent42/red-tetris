import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, find, countBy, mapValues, minBy, groupBy } from 'lodash';
import useInterval from '../../hooks/useInterval';
import { SOCKETS, KEYS, GAME_SETTINGS } from '../../config/constants';

const game = (props) => {

  // State
  const [tiles, setTiles] = useState([]);
  const [blockedRows, setBlockedRows] = useState(0);
  const [delay, setDelay] = useState(1000);

  // Check collisions
  const isCollision = (movingTile, otherTiles) => {
    let collision = false;
    movingTile.positions.some((pos) => {
      // Check if moving Tile is out-of-map
      if (pos.x < 0 || pos.x >= GAME_SETTINGS.GRID_WIDTH) collision = true;
      else if (pos.y >= GAME_SETTINGS.GRID_HEIGHT) collision = true;

      // Check collisions between moving tile and other tiles
      otherTiles.some((tile) => {
        if (find(tile.positions, { x: pos.x })
        || find(tile.positions, { y: pos.y })) collision = true;
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
      props.socket.emit(SOCKETS.GAME_SCORED, { roomId: props.roomId, score: scoringRows.length });
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
    return updatedPieces.map(tile => ({
      ...tile,
      positions: tile.positions.filter(pos => ({
        x: pos.x,
        y: (pos.y < Math.min(scoringRows)) ? pos.y + scoringRows.length : pos.y,
      })),
    }));
  };

  // Tile moves
  const rotate = () => {
    const movingTile = cloneDeep(tiles[0]);
    if (!movingTile || movingTile.size === 2 || props.game.gameOver) return;
    if (movingTile.size === 3) {
      movingTile.positions = movingTile.positions.map((pos, idx) => ({
        x: (movingTile.innerPositions[idx].y - 1 < 0)
          ? pos.X + (movingTile.size - 1 - movingTile.innerPositions[idx].x)
          : pos.X + (movingTile.innerPositions[idx].y - 1 - movingTile.innerPositions[idx].x),
        y: movingTile.innerPositions[idx].x - movingTile.innerPositions[idx].y,
      }));
      movingTile.innerPositions = movingTile.innerPositions.map(pos => ({
        x: (pos.y - 1 < 0) ? movingTile.size - 1 : pos.y - 1,
        y: pos.x,
      }));
    } else if (movingTile.size === 4) {
      movingTile.positions = movingTile.positions.map((pos, idx) => ({
        x: pos.X + [3, 2, 1, 0][movingTile.innerPositions[idx].y] - movingTile.innerPositions.x,
        y: movingTile.innerPositions[idx].x - movingTile.innerPositions[idx].y,
      }));
      movingTile.innerPositions = movingTile.innerPositions.map(pos => ({
        x: [3, 2, 1, 0][pos.y],
        y: pos.x,
      }));
    }
    if (!isCollision(movingTile, tiles.slice(1))) setTiles([movingTile, ...tiles.slice(1)]);
  };

  const dropDown = () => {
    if (props.game.gameOver) return;
    const movingTile = cloneDeep(tiles[0]);
    const otherTiles = cloneDeep(tiles.slice(1));
    while (!isCollision(movingTile, tiles.slice(1))) {
      movingTile.positions = movingTile.positions.map(pos => ({ x: pos.x, y: pos.y + 1 }));
    }
    movingTile.hasLanded = true;
    const finalTiles = handleScoring([movingTile, ...otherTiles]);
    if (isCollision(props.tilesStack[0], finalTiles)) {
      props.setGame({ ...props.game, gameOver: true });
      props.socket.emit(SOCKETS.GAME_OVER, { roomId: props.roomId });
    } else {
      setTiles([props.tilesStack[0], ...finalTiles]);
      props.socket.emit(
        SOCKETS.GAME_NEW_TILE,
        { roomId: props.roomId },
        data => props.setTilesStack([
          ...props.tilesStack.slice(1),
          {
            ...data.tile,
            color: GAME_SETTINGS.COLORS[Math.floor(Math.random() * GAME_SETTINGS.COLORS.length)],
          },
        ]),
      );
      props.socket.emit(
        SOCKETS.GAME_SPECTER_UPDATE,
        {
          roomId: props.roomId,
          specter: mapValues(groupBy(finalTiles.map(el => el.positions).flat(), 'x'), val => minBy(val, 'y').y),
        },
      );
    }
  };

  const moveDown = () => {
    const movingTile = cloneDeep(tiles[0]);
    if (!movingTile || props.game.gameOver) return;
    movingTile.positions = movingTile.positions.map(pos => ({ x: pos.x, y: pos.y + 1 }));
    if (!isCollision(movingTile, tiles.slice(1))) setTiles([movingTile, ...tiles.slice(1)]);
    else dropDown();
  };

  const moveLeft = () => {
    const movingTile = cloneDeep(tiles[0]);
    if (!movingTile || props.game.gameOver) return;
    movingTile.positions = movingTile.positions.map(pos => ({ x: pos.x - 1, y: pos.y }));
    if (!isCollision(movingTile, tiles.slice(1))) setTiles([movingTile, ...tiles.slice(1)]);
  };

  const moveRight = () => {
    const movingTile = cloneDeep(tiles[0]);
    if (!movingTile || props.game.gameOver) return;
    movingTile.positions = movingTile.positions.map(pos => ({ x: pos.x + 1, y: pos.y }));
    if (!isCollision(movingTile, tiles.slice(1))) setTiles([movingTile, ...tiles.slice(1)]);
  };

  // Key strokes handler
  const onKeyStroke = (key) => {
    switch (key.keyCode) {
      case KEYS.ARROW_UP: return rotate();
      case KEYS.ARROW_DOWN: return moveDown();
      case KEYS.ARROW_LEFT: return moveLeft();
      case KEYS.ARROW_RIGHT: return moveRight();
      case KEYS.SPACEBAR: return dropDown();
      default: return null;
    }
  };

  // Add key event listeners
  useEffect(() => {
    document.addEventListener('keydown', onKeyStroke);
    return () => document.removeEventListener('keydown', onKeyStroke);
  }, []);

  // Listen to enemy scoring
  useEffect(() => {
    if (props.game.hasStarted && !props.game.gameOver) {
      props.socket.on(SOCKETS.GAME_SCORED, (data) => {
        if (props.game.gameOver) {
          setBlockedRows(blockedRows + data.score - 1);
          // addRows at the bottom
          // if (conflict) => move moving tile to top until no more conflict
          // else do nothing
        }
      });
    }
  }, []);

  // Make game faster each 10 seconds
  // Update game each [delay] ms
  if (props.game.hasStarted && !props.game.gameOver) {
    useInterval(() => moveDown(), delay);
    useInterval(() => {
      if (delay > 150) {
        console.log(`Accelerate from ${Math.floor(delay)}ms to ${Math.floor(delay * 0.8)}ms`);
        setDelay(delay * 0.8);
      }
    }, 10 * 1000);
  }

  // Listen to game start event
  useEffect(() => {
    let handler;
    props.socket.on(SOCKETS.GAME_STARTS, (data) => {
      props.setGame({ ...props.game, hasStarted: true });
      handler = setTimeout(() => {
        props.setTilesStack(data.tiles.splice(1));
        setTiles(data.tiles[0]);
      }, GAME_SETTINGS.DELAY_BEFORE_STARTS);
      return () => {
        clearTimeout(handler);
      };
    });
  }, []);

  // Listen to game over event
  useEffect(() => {
    props.socket.on(SOCKETS.GAME_OVER, () => props.setGame({ ...props.game, gameOver: true }));
  }, []);

  // Check wheter a tile exists at x,y position
  const getTile = (x, y) => {
    let tile = false;
    tiles.some((el) => {
      if (find(el, { x, y })) tile = el;
      return tile;
    });
    return tile;
  };

  const grid = Array(GAME_SETTINGS.GRID_HEIGHT).fill(Array(GAME_SETTINGS.GRID_WIDTH).fill(0));
  return (
    <div className="grid">
      {grid.map((row, y) => (
        <div className="grid-row" key={`row_${row[0] + y}`}>
          {row.map((col, x) => {
            const tile = getTile(x, y);
            if (tile) return <div key={`row_${row[0] + y}col_${row[0] + x}`} className={['grid-cell', tile.color].join(' ')} />;
            return <div key={`row_${row[0] + y}col_${y + x}`} className="grid-cell" />;
          })}
        </div>
      ))}
    </div>
  );
};

game.propTypes = {
  game: PropTypes.objectOf(PropTypes.any).isRequired,
  setGame: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  tilesStack: PropTypes.arrayOf(PropTypes.any).isRequired,
  setTilesStack: PropTypes.func.isRequired,
};

export default game;
