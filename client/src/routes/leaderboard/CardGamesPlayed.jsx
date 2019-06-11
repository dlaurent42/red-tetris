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
import { ICONS } from '../../config/constants';

const cardGamesPlayed = props => (
  <Card className="leaderboard-card">
    <List className="leaderboard-list">
      {
      props.games.map((user, idx) => {
        let icon;
        if (idx === 0) icon = <FontAwesomeIcon icon={ICONS.TROPHY} className="leaderboard-icon trophy" />;
        else if (idx < 3) icon = <FontAwesomeIcon icon={ICONS.MEDAL} className="leaderboard-icon medal" />;
        else icon = <FontAwesomeIcon icon={ICONS.AWARD} className="leaderboard-icon award" />;
        return (
          <ListItem className="leaderboard-player" key={user.username}>
            <ListItemAvatar>{icon}</ListItemAvatar>
            <ListItemText primary={user.username} secondary={`games won: ${user.score}`} />
            <ListItemAvatar><Avatar className="leaderboard-avatar" src={require(`../../assets/avatars/${user.avatar}`) /* eslint-disable-line */} alt={user.avatar} /></ListItemAvatar>
          </ListItem>
        );
      })
      }
    </List>
    <CardMedia
      className="leaderboard-cover"
      image={require('../../assets/backgrounds/738909504.jpg') /* eslint-disable-line */}
      title="games"
    />
  </Card>
);

cardGamesPlayed.propTypes = {
  games: PropTypes.arrayOf(PropTypes.any),
};

cardGamesPlayed.defaultProps = {
  games: [],
};

export default cardGamesPlayed;
