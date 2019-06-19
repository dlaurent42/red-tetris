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

  // Method invite friend
  const inviteFriend = () => {
    // Nothing here for now
  };

  // Define type of slot following user information
  let slot;
  if (props.userInfos.role === ROOM_ROLES.SPECTATOR) {
    slot = <button type="button" className="room-entering-lobby-empty-slot-join" onClick={enterGame}>JOIN</button>;
  } else if (props.userInfos.id) {
    slot = <button type="button" className="room-entering-lobby-empty-slot-invite" onClick={inviteFriend}>INVITE FRIEND</button>;
  } else {
    slot = <div className="room-entering-lobby-empty-slot-wait">WAITING FOR PLAYER</div>;
  }
  return (
    <div className="room-entering-lobby-empty-slot">
      {slot}
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
