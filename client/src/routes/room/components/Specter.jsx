import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GAME_SETTINGS, ICONS, ROOM_ROLES } from '../../../config/constants';

const padNumber = number => (number <= 999999 ? `00000${number}`.slice(-6) : number);

const specter = (props) => {
  const grid = Array(GAME_SETTINGS.GRID_HEIGHT).fill(Array(GAME_SETTINGS.GRID_WIDTH).fill(0));
  return (
    <div className={['specter-container', `specter-container-${props.type}`].join(' ')}>
      {(props.type === 'large')
        ? (
          <div className="specter-statistics">
            {<FontAwesomeIcon icon={(props.player.role === ROOM_ROLES.CREATOR) ? ICONS.CROWN : ICONS.GAMEPAD} className="lobby-icon" />}
            <div>{props.player.username || 'unkwown-player'}</div>
            <div>{padNumber(props.player.score)}</div>
          </div>
        ) : null}
      <div className={['specter', `specter-${props.type}`].join(' ')}>
        {grid.map((row, y) => (
          <div className="grid-row" key={`specter-row_${row[0] + y}${props.player.socketId}${Math.random() * 100000}`}>
            {row.map((col, x) => (
              ((!props.player.specter[x] || props.player.specter[x] > y)
                ? (
                  <div
                    key={`specter-row_${row[0] + y}col_${row[0] + x}${props.player.socketId}${Math.random() * 100000}`}
                    className="grid-cell"
                  />
                ) : (
                  <div
                    key={`specter-row_${row[0] + y}col_${y + x}${props.player.socketId}${Math.random() * 100000}`}
                    className="grid-cell grid-cell-filled"
                  />
                )
              )
            ))}
          </div>
        ))}
      </div>
    </div>
  );

};

specter.propTypes = {
  type: PropTypes.string.isRequired,
  player: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default specter;
