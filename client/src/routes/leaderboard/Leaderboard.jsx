import React, { useState, useEffect } from 'react';
import Header from '../../misc/navigation/header/Header';
import Footer from '../../misc/navigation/footer/Footer';
import Profile from '../../misc/profile/Profile';
import { AVATARS } from '../../config/constants';
import CardScores from './CardScores';
import CardGamesPlayed from './CardGamesPlayed';
import './Leaderboard.scss';

const fakeUsernames = ['Acrimony', 'Gridelin', 'Abattoir', 'Diorism', 'Turdine', 'Abattoir', 'Camsteary', 'Ganister', 'Luminous', 'ZaazAnole', 'Sapsago', 'Torsibility', 'Testaceous', 'Hypnosophy', 'Tampion', 'Isogeny', 'Abattoir', 'Luminous', 'Scientism', 'Magnanimous', 'Moriadon8', 'Costard', 'Abderian', 'Verrucose', 'Xenolalia', 'Skiagram', 'Pellucid', 'Ptyalagogue', 'Blauwbok', 'Adnomination', 'Luminous', 'Acrimony', 'Pejorism', 'Divaricate', 'Papyrography', 'Affranchise', 'Luminous', 'Abattoir', 'Luminous', 'Tattersall', 'Jackanapes', 'Schmutz', 'ComplainZygote', 'Ensorcell', 'HoiPolloi', 'Cacophony', 'Freewheeling', 'SpittinYoyo', 'Whodunit', 'Petcock', 'DamperGuffaw', 'Alfresco', 'Bugbear', 'PlotclassDaedal', 'JohnmuerJunket', 'Muffuletta', 'Joementum', 'Emo1Wigout', 'Godwottery', 'Pomposity', 'Toothsome', 'Ostinato', 'Currish', 'Toupeeba4000', 'Whatsis', 'Gubbins', 'Blinker', 'Tookusde0909', 'Whisternefet', 'Erinaceous', 'Sternutate', 'Tumultuous', 'Maelstrom', 'Ephemeral', 'Moniker', 'Shartnuts334', 'Zonkedle1128', 'Sthenereu12345', 'Quokkareap3r', 'Manorexic'];
const random = bound => Math.floor(Math.random() * bound);

const leaderboard = () => {
  const [games, setGames] = useState([]);
  const [scores, setScores] = useState([]);
  const [playerInfos, setPlayerInfos] = useState({});
  const [openProfile, setOpenProfile] = useState(false);
  const toggleProfile = (player) => {
    setPlayerInfos(player);
    setOpenProfile(!openProfile);
  };

  useEffect(() => {
    const datascores = [];
    const dataGames = [];
    for (let index = 0; index < 5; index += 1) {
      datascores.push({
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
    setScores(datascores);
  }, []);

  return (
    <div className="leaderboard-container">
      {openProfile
        ? <Profile open={openProfile} onClose={toggleProfile} user={playerInfos} />
        : null}
      <Header color="dark" />
      <div className="leaderboard-subcontainer">
        <CardScores open toggleProfile={toggleProfile} scores={scores} />
        <CardGamesPlayed open toggleProfile={toggleProfile} games={games} />
      </div>
      <Footer />
    </div>
  );
};

export default leaderboard;
