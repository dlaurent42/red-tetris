import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Logo from '../../logo/Logo';
import './Menu.scss';

const menu = (props) => {

  // Boolean to check wheter the menu is displayed or not
  const [open, setOpen] = useState(false);

  if (props.variant === 'full') {
    return (
      <nav className={['mobile-menu', props.color].join(' ')}>
        <Link to="/" className="menu-logo"><Logo variant={props.variant} /></Link>
        <div className="mobile-menu-burger" onClick={() => setOpen(!open)} role="presentation">
          <span className={(open) ? ['menu-burger', 'opened'].join(' ') : ['menu-burger', 'closed'].join(' ')} />
          <span className={(open) ? ['menu-burger', 'opened'].join(' ') : ['menu-burger', 'closed'].join(' ')} />
          <span className={(open) ? ['menu-burger', 'opened'].join(' ') : ['menu-burger', 'closed'].join(' ')} />
        </div>
        {(open)
          ? (
            <div className="mobile-menu-container">
              <div className="mobile-menu-items">
                <Link to="/" className="menu-logo"><Logo variant={props.variant} /></Link>
                <Link to="/tournaments" className="mobile-menu-item">TOURNAMENTS</Link>
                <Link to="/leaderboard" className="mobile-menu-item">LEADERBOARD</Link>
                <Link to="/about" className="mobile-menu-item">ABOUT US</Link>
                <span className="separator" />
                {(!props.user.id)
                  ? <Link to="/login" className="mobile-menu-item mobile-menu-login">LOG IN</Link>
                  : <Link to="/profile" className="mobile-menu-item">PROFILE</Link>}
                {(!props.user.id)
                  ? <Link to="/signup" className="mobile-menu-item mobile-menu-signup">SIGN UP</Link>
                  : <Link to="/logout" className="mobile-menu-item mobile-menu-logout">LOG OUT</Link>}
              </div>
            </div>
          ) : null}
      </nav>
    );
  }
  if (props.variant === 'reduced') {
    return (
      <div className={['mobile-menu', props.color].join(' ')}>
        <Link to="/" className="menu-logo reduced-logo"><Logo variant={props.variant} /></Link>
      </div>
    );
  }
  return null;
};

menu.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string,
  user: PropTypes.objectOf(PropTypes.any),
};

menu.defaultProps = {
  color: 'dark',
  variant: 'full',
  user: {},
};

const mapStateToProps = state => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(menu);
