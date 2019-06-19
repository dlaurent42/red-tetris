import React from 'react';
import PropTypes from 'prop-types';
import { SOCKETS, ROOM_ROLES } from '../../../../config/constants';

const emptySlot = (props) => {

  // Method enter game
  const enterGame = () => {
    const user = { ...props.userInfos, role: ROOM_ROLES.PLAYER };
    props.socket.emit(SOCKETS.ROOM_USER_JOINED, { id: props.roomInfos.id, user });
    props.setUserInfos(user);
  };

  // Define type of slot following user information
  return (
    <div className="room-entering-lobby-empty-slot">
      {(props.userInfos.role === ROOM_ROLES.SPECTATOR)
        ? <button type="button" className="room-entering-lobby-empty-slot-join" onClick={enterGame}>JOIN</button>
        : <div className="room-entering-lobby-empty-slot-wait">WAITING FOR PLAYER</div>}
    </div>
  );
};

emptySlot.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  roomInfos: PropTypes.objectOf(PropTypes.any).isRequired,
  userInfos: PropTypes.objectOf(PropTypes.any).isRequired,
  setUserInfos: PropTypes.func.isRequired,
};


export default emptySlot;
