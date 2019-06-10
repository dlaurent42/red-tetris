import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import logoSmall from '../../../assets/logo/logo.png';
import logoLarge from '../../../assets/logo/logo-full.png';
import './Logo.scss';

const logo = props => (
  <Link to="/">
    <img
      className={(props.type === 'full') ? 'logo logo-large' : 'logo logo-small'}
      src={(props.type === 'full') ? logoLarge : logoSmall}
      alt="logo"
    />
  </Link>
);

export default logo;
