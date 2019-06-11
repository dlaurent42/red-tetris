import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Header from '../../components/navigation/header/Header';
import Footer from '../../components/navigation/footer/Footer';
import { AVATARS, ICONS } from '../../config/constants';
import './Leaderboard.scss';

const fakeUsernames = ['Acrimony', 'Gridelin', 'Abattoir', 'Diorism', 'Turdine', 'Abattoir', 'Camsteary', 'Ganister', 'Luminous', 'ZaazAnole', 'Sapsago', 'Torsibility', 'Testaceous', 'Hypnosophy', 'Tampion', 'Isogeny', 'Abattoir', 'Luminous', 'Scientism', 'Magnanimous', 'Moriadon8', 'Costard', 'Abderian', 'Verrucose', 'Xenolalia', 'Skiagram', 'Pellucid', 'Ptyalagogue', 'Blauwbok', 'Adnomination', 'Luminous', 'Acrimony', 'Pejorism', 'Divaricate', 'Papyrography', 'Affranchise', 'Luminous', 'Abattoir', 'Luminous', 'Tattersall', 'Jackanapes', 'Schmutz', 'ComplainZygote', 'Ensorcell', 'HoiPolloi', 'Cacophony', 'Freewheeling', 'SpittinYoyo', 'Whodunit', 'Petcock', 'DamperGuffaw', 'Alfresco', 'Bugbear', 'PlotclassDaedal', 'JohnmuerJunket', 'Muffuletta', 'Joementum', 'Emo1Wigout', 'Godwottery', 'Pomposity', 'Toothsome', 'Ostinato', 'Currish', 'Toupeeba4000', 'Whatsis', 'Gubbins', 'Blinker', 'Tookusde0909', 'Whisternefet', 'Erinaceous', 'Sternutate', 'Tumultuous', 'Maelstrom', 'Ephemeral', 'Moniker', 'Shartnuts334', 'Zonkedle1128', 'Sthenereu12345', 'Quokkareap3r', 'Manorexic'];
const random = bound => Math.floor(Math.random() * bound);

const leaderboard = () => {
  const [games, setGames] = useState([]);
  const [scorers, setScorers] = useState([]);

  useEffect(() => {
    const dataScorers = [];
    const dataGames = [];
    for (let index = 0; index < 5; index += 1) {
      dataScorers.push({
        username: fakeUsernames[random(fakeUsernames.length)],
        avatar: AVATARS[random(AVATARS.length)],
        score: random(10000) + (5 - index) * 10000,
      });
      dataGames.push({
        username: fakeUsernames[random(fakeUsernames.length)],
        avatar: AVATARS[random(AVATARS.length)],
        score: random(100) + (5 - index) * 100,
      });
    }
    setGames(dataGames);
    setScorers(dataScorers);
  }, []);

  return (
    <div className="leaderboard-container">
      <Header color="dark" />
      <div className="leaderboard-subcontainer">
        <Card className="leaderboard-card">
          <CardMedia
            className="leaderboard-cover"
            image={require('../../assets/backgrounds/launchboxarcade.png') /* eslint-disable-line */}
            title="scorers"
          />
          <List className="leaderboard-list">
            {
            scorers.map((user, idx) => {
              let icon;
              if (idx === 0) icon = <FontAwesomeIcon icon={ICONS.TROPHY} className="leaderboard-icon trophy" />;
              else if (idx < 3) icon = <FontAwesomeIcon icon={ICONS.MEDAL} className="leaderboard-icon medal" />;
              else icon = <FontAwesomeIcon icon={ICONS.AWARD} className="leaderboard-icon award" />;
              return (
                <ListItem className="leaderboard-player" key={user.username}>
                  <ListItemAvatar>{icon}</ListItemAvatar>
                  <ListItemText primary={user.username} secondary={`score: ${user.score}`} />
                  <ListItemAvatar><Avatar className="leaderboard-avatar" src={require(`../../assets/avatars/${user.avatar}`) /* eslint-disable-line */} alt={user.avatar} /></ListItemAvatar>
                </ListItem>
              );
            })
            }
          </List>
        </Card>
        <Card className="leaderboard-card">
          <List className="leaderboard-list">
            {
            games.map((user, idx) => {
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
            title="scorers"
          />
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default leaderboard;
