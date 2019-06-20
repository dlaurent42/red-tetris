import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Profile from '../../../misc/profile/Profile';
import { GAME_SETTINGS, ICONS, ROOM_ROLES } from '../../../config/constants';

const padNumber = number => (number <= 999999 ? `00000${number}`.slice(-6) : number);

const specter = (props) => {
  const [openProfile, setOpenProfile] = useState(false);
  const toggleProfile = () => setOpenProfile(!openProfile);
  const grid = Array(GAME_SETTINGS.GRID_HEIGHT).fill(Array(GAME_SETTINGS.GRID_WIDTH).fill(0));
  return (
    <div className={['specter-container', `specter-container-${props.type}`].join(' ')}>
      {(props.type === 'large')
        ? (
          <div
            role="presentation"
            onClick={toggleProfile}
            className="specter-statistics clickable"
          >
            <Profile open={openProfile} onClose={toggleProfile} user={props.player} />
            <Badge
              badgeContent={
                (
                  <FontAwesomeIcon
                    icon={(props.player.role === ROOM_ROLES.CREATOR) ? ICONS.CROWN : ICONS.GAMEPAD}
                    className={['lobby-icon', (props.player.role === ROOM_ROLES.CREATOR) ? ICONS.CROWN : ICONS.GAMEPAD].join(' ')}
                  />
                )}
            >
              <Avatar src={require(`../../../assets/avatars/${props.player.avatar}`) /* eslint-disable-line */} alt="avatar" />
            </Badge>
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
