import _ from 'lodash';

const formatRoomList = (roomTable) => {
  const ret = {};
  roomTable.forEach((room) => {
    const tmp = {
      pwd: room.pwd,
      mode: room.mode,
      roomId: room.roomId,
      hasPwd: room.hasPwd,
      roomName: room.roomName,
      maxPlayers: room.maxPlayers,
      nbPlayers: room.players.length,
    };
    _.assign(ret, tmp);
  });
  return ret;
};

export default formatRoomList;
