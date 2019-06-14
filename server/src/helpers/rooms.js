import _ from 'lodash';

const formatRoomList = (roomTable) => {
  const ret = {};
  roomTable.forEach((room) => {
    const tmp = {
      mode: room.mode,
      roomId: room.roomId,
      hasPwd: room.hasPwd,
      roomName: room.roomName,
      maxPlayers: room.maxPlayers,
      players: room.players.length,
    };
    _.assign(ret, tmp);
  });
  return ret;
};

export default formatRoomList;
