import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, find, countBy, mapValues, min, minBy, groupBy } from 'lodash';
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
      if (pos.x < 0 || pos.x >= GAME_SETTINGS.GRID_WIDTH) {
        console.log('collision before of horizontal bounds');
        collision = true;
      } else if (pos.y >= GAME_SETTINGS.GRID_HEIGHT) {
        console.log('collision with ground');
        collision = true;
      }

      // Check collisions between moving tile and other tiles
      otherTiles.some((tile) => {
        if (find(tile.positions, { x: pos.x, y: pos.y })) {
          console.log('collision with piece');
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
    const movingTile = cloneDeep(tiles[0]);

    // If piece has size equal to 2, it is a square
    if (!movingTile || movingTile.size === 2 || props.game.gameOver) return;

    // Pieces of size 4 are bars
    if (movingTile.size === 4) {
      movingTile.positions = movingTile.positions.map((pos, idx) => ({
        x: pos.x
          + [3, 2, 1, 0][movingTile.innerPositions[idx].y]
          - movingTile.innerPositions[idx].x,
        y: pos.y + movingTile.innerPositions[idx].x - movingTile.innerPositions[idx].y,
      }));
      movingTile.innerPositions = movingTile.innerPositions.map(pos => ({
        x: [3, 2, 1, 0][pos.y],
        y: pos.x,
      }));

    // Pieces of size 3 are all other types of piece
    } else if (movingTile.size === 3) {
      movingTile.positions = movingTile.positions.map((pos, idx) => ({
        x: pos.x + [2, 1, 0][movingTile.innerPositions[idx].y] - movingTile.innerPositions[idx].x,
        y: pos.y + movingTile.innerPositions[idx].x - movingTile.innerPositions[idx].y,
      }));
      movingTile.innerPositions = movingTile.innerPositions.map(pos => ({
        x: [2, 1, 0][pos.y],
        y: pos.x,
      }));
    }
    if (!isCollision(movingTile, tiles.slice(1))) setTiles([movingTile, ...tiles.slice(1)]);
  };

  const dropDown = () => {
    if (props.game.gameOver) return;

    // Distinguish moving tile from other tiles
    const movingTile = cloneDeep(tiles[0]);
    const otherTiles = cloneDeep(tiles.slice(1));

    // Move until a collision happens
    while (!isCollision(movingTile, tiles.slice(1))) {
      movingTile.positions = movingTile.positions.map(pos => ({ x: pos.x, y: pos.y + 1 }));
    }

    // Set moving tile hasLanded
    movingTile.hasLanded = true;
    movingTile.positions = movingTile.positions.map(pos => ({ x: pos.x, y: pos.y - 1 }));

    // Handle scoring
    const finalTiles = handleScoring([movingTile, ...otherTiles]);

    // If a collision occurs between tiles and next moving tile, then it is end of the game
    if (isCollision(props.tilesStack[0], finalTiles)) {
      setTiles([props.tilesStack[0], ...finalTiles]);
      console.log('End of game (grid full)');
      props.setGame({ ...props.game, gameOver: true });
      props.socket.emit(SOCKETS.GAME_OVER, { roomId: props.roomId });

    // Update tiles and ask a new tile to server
    } else {
      setTiles([props.tilesStack[0], ...finalTiles.filter(tile => tile.positions.length)]);
      props.socket.emit(
        SOCKETS.GAME_NEW_TILE,
        { roomId: props.roomId },
        (data) => {
          console.log('GAME_NEW_TILE (asked by client)');
          props.setTilesStack([
            ...props.tilesStack.slice(1), {
              ...data.tile,
              color: GAME_SETTINGS.COLORS[Math.floor(Math.random() * GAME_SETTINGS.COLORS.length)],
            },
          ]);
        },
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

  const moveHorizontally = (direction) => {
    const movingTile = cloneDeep(tiles[0]);
    if (!movingTile || props.game.gameOver) return;
    movingTile.positions = movingTile.positions.map(pos => ({
      x: (direction === 'left') ? pos.x - 1 : pos.x + 1,
      y: pos.y,
    }));
    if (!isCollision(movingTile, tiles.slice(1))) setTiles([movingTile, ...tiles.slice(1)]);
  };

  // Key strokes handler
  const onKeyStroke = (key) => {
    if (!props.game.hasStarted || props.game.gameOver || !tiles.length) return null;
    console.log('keystroke');
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
  useInterval(() => {
    console.log(props.game.gameOver);
    if (props.game.hasStarted && !props.game.gameOver) moveDown();
  }, delay);
  useInterval(() => {
    if (delay > 150 && props.game.hasStarted && !props.game.gameOver) setDelay(delay * 0.8);
  }, 10 * 1000);

  // Listen to game new tile event
  useEffect(() => {
    props.socket.on(SOCKETS.GAME_NEW_TILE, (data) => {
      console.log('GAME_NEW_TILE (given by server)');
      props.setTilesStack([...props.tilesStack, data.tile]);
    });
  }, []);

  // Listen to game start event
  useEffect(() => {
    let handler;
    props.socket.on(SOCKETS.GAME_STARTS, (data) => {
      console.log('GAME_STARTS');
      props.setGame({ ...props.game, hasStarted: true });
      handler = setTimeout(() => {
        const tilesWithColor = data.tiles.map(tile => (
          Object.assign(tile, {
            color: GAME_SETTINGS.COLORS[Math.floor(Math.random() * GAME_SETTINGS.COLORS.length)],
          })
        ));
        props.setTilesStack(tilesWithColor.splice(1));
        setTiles([tilesWithColor[0]]);
      }, GAME_SETTINGS.DELAY_BEFORE_STARTS);
      return () => clearTimeout(handler);
    });
  }, []);

  // Listen to game over event
  useEffect(() => {
    props.socket.on(SOCKETS.GAME_OVER, () => {
      console.log('GAME_OVER');
      props.setGame({ ...props.game, gameOver: true });
    });
    return () => props.socket.removeAllListeners();
  }, []);

  // Check wheter a tile exists at x,y position
  const getTile = (x, y) => {
    let tile = false;
    if (typeof tiles === 'object' && tiles.length && props.game.hasStarted) {
      tiles.some((el) => {
        if (find(el.positions, { x, y })) tile = el;
        return tile;
      });
    }
    return tile;
  };

  const grid = Array(GAME_SETTINGS.GRID_HEIGHT).fill(Array(GAME_SETTINGS.GRID_WIDTH).fill(0));
  console.log('render Game');
  return (
    <div className="grid">
      {grid.map((row, y) => (
        <div className="grid-row" key={`row_${row[0] + y}`}>
          {row.map((col, x) => {
            const tile = getTile(x, y);
            if (tile) return <div key={`row_${row[0] + y}col_${row[0] + x}`} className={['grid-cell', tile.color].join(' ')} />;
            return <div key={`row_${row[0] + y}col_${row[0] + x}`} className="grid-cell" />;
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
