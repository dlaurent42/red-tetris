import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './RightSideSubmenu.scss';

const rightSideSubmenu = (props) => {
  if (props.variant !== 'full') return null;
  return (!props.user.id) ? (
    <div className={['menu-right', props.color].join(' ')}>
      <Link to="/login" className="menu-item menu-login">LOG IN</Link>
      <Link to="/signup" className="menu-signup">SIGN UP</Link>
    </div>
  ) : (
    <div className={['menu-right', props.color].join(' ')}>
      <Link to="/profile" className={['menu-item'].concat((window.location.hash === '#/profile') ? 'active' : '').join(' ')}>PROFILE</Link>
      <Link to="/logout" className="menu-logout">LOG OUT</Link>
    </div>
  );
};

rightSideSubmenu.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string,
  user: PropTypes.objectOf(PropTypes.any),
};

rightSideSubmenu.defaultProps = {
  color: 'dark',
  variant: 'full',
  user: {},
};

const mapStateToProps = state => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(rightSideSubmenu);
