import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { ICONS } from '../../config/constants';

const table = (props) => {

  const [filteredList, setFilteredList] = useState([...props.list]);

  useEffect(() => {
    setFilteredList(props.list.filter((el) => {
      if (props.filters.showFullRooms === false && el.nbPlayers >= el.maxPlayers) return false;
      if (props.filters.showRoomsWithPwd === false && el.hasPwd) return false;
      if (props.filters.searchValue !== '' && el.roomName.includes(props.filters.searchValue) === false) return false;
      return true;
    }));
  }, [props.list, props.filters]);

  return (
    useMemo(() => (
      <Table className="tournaments-table">
        <TableHead className="tournaments-table-head">
          <TableRow>
            <TableCell />
            <TableCell align="center">Room&nbsp;ID</TableCell>
            <TableCell align="center">Room&nbsp;Name</TableCell>
            <TableCell align="center">Mode</TableCell>
            <TableCell align="center">Players</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="tournaments-table-body">
          {filteredList.map(tournament => (
            <TableRow
              key={`${tournament.roomId}_${tournament.roomName}`}
              className="tournaments-table-row"
              onClick={() => {
                props.setJoinRoomData({ ...tournament });
                props.setDisplayJoinRoomDialogBox(true);
              }}
            >
              <TableCell align="center">
                <FontAwesomeIcon icon={ICONS.LOCK} className={['tournaments-lock', (tournament.hasPwd) ? 'lock' : 'unlock'].join(' ')} />
              </TableCell>
              <TableCell align="center">{tournament.roomId}</TableCell>
              <TableCell align="center">{tournament.roomName}</TableCell>
              <TableCell align="center">{tournament.mode}</TableCell>
              <TableCell align="center">{`${tournament.nbPlayers}/${tournament.maxPlayers}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ), [filteredList])
  );
};

table.propTypes = {
  list: PropTypes.arrayOf(PropTypes.any).isRequired,
  filters: PropTypes.objectOf(PropTypes.any).isRequired,
  setDisplayJoinRoomDialogBox: PropTypes.func.isRequired,
  setJoinRoomData: PropTypes.func.isRequired,
};

export default table;
