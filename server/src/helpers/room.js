const formatRoom = room => ({
  mode: room.mode,
  roomId: room.roomId,
  hasPwd: room.hasPwd,
  roomName: room.roomName,
  maxPlayers: room.maxPlayers,
  players: room.players.length,
});

export default formatRoom;
