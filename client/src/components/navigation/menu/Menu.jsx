import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import LogoLarge from '../logo/Logo';
import UserSubMenu from './UserSubMenu';

const menu = (props) => {
  const currentPage = window.location.hash;
  const leftSideMenu = (!currentPage.includes(/login|signup/))
    ? <UserSubMenu /> : null;
  return (
    <nav>
      <LogoLarge />
      <div className="header-left">
        xx
      </div>
      {leftSideMenu}
    </nav>
  );
};

menu.PropTypes = {

};

const mapStateToProps = state => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(menu);
