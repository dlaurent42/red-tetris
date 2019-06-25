import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import generateKey from '../../utils/generateId';
import { ICONS } from '../../config/constants';

const cardScores = props => (
  <Card className="leaderboard-card">
    <CardMedia
      className="leaderboard-cover"
      image={require('../../assets/backgrounds/leaderboard_01.png') /* eslint-disable-line */}
      title="scores"
    />
    <List className="leaderboard-list">
      {props.scores.map((user, idx) => {

        // Define icon following rank
        let icon;
        if (idx === 0) icon = <FontAwesomeIcon icon={ICONS.TROPHY} className="leaderboard-icon trophy" />;
        else if (idx < 3) icon = <FontAwesomeIcon icon={ICONS.MEDAL} className="leaderboard-icon medal" />;
        else icon = <FontAwesomeIcon icon={ICONS.AWARD} className="leaderboard-icon award" />;

        // Render leaderboard
        return (
          <ListItem className="leaderboard-player" key={generateKey(25)} onClick={() => ((user.id) ? props.toggleProfile(user) : null)}>
            <ListItemAvatar>{icon}</ListItemAvatar>
            <ListItemText primary={user.username} secondary={(user.score === 'N/A') ? user.score : `score: ${user.score}`} />
            <ListItemAvatar><Avatar className="leaderboard-avatar" src={require(`../../assets/avatars/${user.avatar}`) /* eslint-disable-line */} alt={user.avatar} /></ListItemAvatar>
          </ListItem>
        );
      })}
    </List>
  </Card>
);

cardScores.propTypes = {
  toggleProfile: PropTypes.func.isRequired,
  scores: PropTypes.arrayOf(PropTypes.any),
};

cardScores.defaultProps = {
  scores: [],
};

export default cardScores;
