import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../misc/navigation/header/Header';
import Footer from '../../misc/navigation/footer/Footer';
import Profile from '../../misc/profile/Profile';
import { API_CALLS, DEFAULT } from '../../config/constants';
import CardScores from './CardScores';
import CardGamesPlayed from './CardGamesPlayed';
import './Leaderboard.scss';

const leaderboard = () => {

  // Statistics structure
  const emptySlots = Array(5).fill({ username: '', avatar: DEFAULT.AVATAR, score: 'N/A' });
  const [stats, setStats] = useState({ scoring: [...emptySlots], gamesPlayed: [...emptySlots] });

  // Handlers for profile window display
  const [playerInfos, setPlayerInfos] = useState({});
  const [openProfile, setOpenProfile] = useState(false);
  const toggleProfile = (player) => {
    setPlayerInfos(player);
    setOpenProfile(!openProfile);
  };

  // Fetch leaderboard
  useEffect(() => {

    // Make API call
    axios.get(API_CALLS.GET_LEADERBOARD, API_CALLS.CONFIG)
      .then((result) => {
        if (!result.data.success) return;

        // Update statistics and fill empty slots to be sure having at least 5 'users'
        setStats({
          scoring: result.data.leaderboard.scoring.concat(emptySlots).splice(0, 5),
          gamesPlayed: result.data.leaderboard.gamesPlayed.concat(emptySlots).splice(0, 5),
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="leaderboard-container">
      {openProfile
        ? <Profile open={openProfile} onClose={toggleProfile} user={playerInfos} />
        : null}
      <Header color="dark" />
      <div className="leaderboard-subcontainer">
        <CardScores open toggleProfile={toggleProfile} scores={stats.scoring} />
        <CardGamesPlayed open toggleProfile={toggleProfile} games={stats.gamesPlayed} />
      </div>
      <Footer />
    </div>
  );
};

export default leaderboard;
