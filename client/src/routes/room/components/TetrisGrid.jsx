import React from 'react';
import PropTypes from 'prop-types';
import { find, get } from 'lodash';
import { GAME_SETTINGS } from '../../../config/constants';

const tetrisGrid = (props) => {

  // Check wheter a tile exists at x,y position
  const getTile = (x, y) => {
    let tile = false;
    if (typeof props.tiles === 'object' && props.tiles.length) {
      props.tiles.some((el) => {
        if (find(get(el, 'positions', []), { x, y })) tile = el;
        return tile;
      });
    }
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
            return <div key={`row_${row[0] + y}col_${row[0] + x}`} className="grid-cell" />;
          })}
        </div>
      ))}
    </div>
  );
};

tetrisGrid.propTypes = {
  tiles: PropTypes.arrayOf(PropTypes.any),
};

tetrisGrid.defaultProps = {
  tiles: [],
};

export default tetrisGrid;
