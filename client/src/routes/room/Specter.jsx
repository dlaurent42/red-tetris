import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SOCKETS, GAME_SETTINGS } from '../../config/constants';

const specter = (props) => {
  const [specterArray, setSpecterArray] = useState([]);

  useEffect(() => {
    props.socket.on(SOCKETS.GAME_SPECTER_UPDATE, (data) => {
      setSpecterArray(data.specter);
    });
  });

  const grid = Array(GAME_SETTINGS.GRID_HEIGHT).fill(Array(GAME_SETTINGS.GRID_WIDTH).fill(0));
  return (
    <div className="specter-container">
      <div className="specter">
        {grid.map((row, y) => (
          <div className="grid-row" key={`specter-row_${row[0] + y}`}>
            {row.map((col, x) => {
              if (!specterArray[x] || specterArray[x] > y) return <div key={`specter-row_${row[0] + y}col_${row[0] + x}`} className="grid-cell" />;
              return <div key={`specter-row_${row[0] + y}col_${y + x}`} className="grid-cell grid-cell-filled" />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

specter.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default specter;
