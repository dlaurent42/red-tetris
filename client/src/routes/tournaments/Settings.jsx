import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ICONS } from '../../config/constants';

const settings = (props) => {

  const [searchInputRef, setSearchInputRef] = useState(null);

  const handleFormChange = field => (event) => {
    const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
    props.setFilters({ ...props.filters, [field]: value });
  };

  return (
    <FormGroup row className="tournaments-form">
      <FormGroup row className="tournaments-subform-right">
        <FormControlLabel
          control={(
            <Checkbox
              checked={props.filters.showFullRooms}
              onChange={handleFormChange('showFullRooms')}
              value={props.filters.showFullRooms}
              color="default"
            />
          )}
          label="Show full rooms"
        />
        <FormControlLabel
          control={(
            <Checkbox
              checked={props.filters.showRoomsWithPwd}
              onChange={handleFormChange('showRoomsWithPwd')}
              value={props.filters.showRoomsWithPwd}
              color="default"
            />
          )}
          label="Show rooms with password"
        />
      </FormGroup>
      <FormGroup row className="tournaments-subform-left">
        <div className="tournament-searchbar">
          <input ref={(ip) => { setSearchInputRef(ip); }} value={props.filters.searchValue} onChange={handleFormChange('searchValue')} />
          <FontAwesomeIcon icon={ICONS.SEARCH} onClick={() => searchInputRef.focus()} />
        </div>
        <Button variant="outlined" className="button" onClick={() => props.setDisplayCreateRoomDialogBox(true)}>Create room</Button>
      </FormGroup>
    </FormGroup>
  );
};

settings.propTypes = {
  filters: PropTypes.objectOf(PropTypes.any).isRequired,
  setFilters: PropTypes.func.isRequired,
  setDisplayCreateRoomDialogBox: PropTypes.func.isRequired,
};

export default settings;
