import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';

const nextTile = (props) => {

  const isInTile = (initX, initY) => {
    let x = initX;
    let y = initY;
    if (props.tile.size === 2) {
      x -= 1;
      y -= 1;
    }
    if (props.tile.size === 3) y -= 1;
    return find(props.tile.innerPositions, { x, y });
  };
  const grid = Array(4).fill(Array(4).fill(0));

  return (
    <div className="next-tile-container">
      <div className="next-tile">
        {grid.map((row, y) => (
          <div className="next-tile-row" key={`next-tile-row_${row[0] + y}`}>
            {row.map((col, x) => (
              (isInTile(x, y))
                ? (
                  <div
                    key={`next-tile-row_${row[0] + y}col_${row[0] + x}`}
                    className={['next-tile-cell', props.tile.color].join(' ')}
                  />
                ) : (
                  <div
                    key={`next-tile-row_${row[0] + y}col_${row[0] + x}`}
                    className="next-tile-cell"
                  />
                )
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

nextTile.propTypes = {
  tile: PropTypes.objectOf(PropTypes.any),
};

nextTile.defaultProps = {
  tile: {},
};

export default nextTile;
