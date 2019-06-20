import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { userLogout } from '../../store/actions';

const logout = (props) => {

  useEffect(() => {
    props.onUserLogout();
  }, []);
  return <Redirect to="/" />;
};

logout.propTypes = {
  onUserLogout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  onUserLogout: () => dispatch(userLogout()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(logout));
