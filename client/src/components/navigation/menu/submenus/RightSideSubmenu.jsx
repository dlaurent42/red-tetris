import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './RightSideSubmenu.scss';

const rightSideSubmenu = (props) => {
  if (props.variant !== 'full') return null;

  return (!props.user.uid) ? (
    <div className="menu-right">
      <Link to="/login" className="menu-right-item menu-login">LOG IN</Link>
      <Link to="/signup" className="menu-right-item menu-signup">SIGN UP</Link>
    </div>
  ) : (
    <div className="menu-right">
      <Link to="/profile" className="menu-right-item menu-profile">
        <img className="menu-avatar" src={require(`../../../../assets/avatars/${user.avatar}`) /* eslint-disable-line */} alt="avatar" /> 
      </Link>
    </div>
  );
};

rightSideSubmenu.propTypes = {
  variant: PropTypes.string,
  user: PropTypes.objectOf(PropTypes.any),
};

rightSideSubmenu.defaultProps = {
  variant: 'full',
  user: {},
};

const mapStateToProps = state => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(rightSideSubmenu);
