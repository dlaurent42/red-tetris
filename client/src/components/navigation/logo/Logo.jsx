import React from 'react';
import PropTypes from 'prop-types';
import logoSmall from '../../../assets/logo/logo.png';
import logoLarge from '../../../assets/logo/logo-full.png';
// import './Logo.scss';

const logo = props => (
  <img
    className={(props.type === 'full') ? 'logo logo-large' : 'logo logo-small'}
    src={(props.type === 'full') ? logoLarge : logoSmall}
    alt="logo"
  />
);

logo.propTypes = {
  type: PropTypes.string,
};

logo.defaultProps = {
  type: 'full',
};

export default logo;
