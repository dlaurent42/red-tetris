const formatRoomList = roomTable => roomTable.map(room => ({
  pwd: room.pwd,
  mode: room.mode,
  roomId: room.roomId,
  hasPwd: room.hasPwd,
  roomName: room.roomName,
  maxPlayers: room.maxPlayers,
  nbPlayers: room.players.length,
}));

export default formatRoomList;
