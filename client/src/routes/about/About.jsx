import React from 'react';
// import Divider from '@material-ui/core/Divider';
// import Typography from '@material-ui/core/Typography';
import Card from '../../components/UI/Card';
import Header from '../../components/navigation/header/Header';
import Footer from '../../components/navigation/footer/Footer';
import './About.scss';

const about = () => (
  <div className="about-container">
    <Header color="dark" />
    <div className="about-subcontainer">
      {/* <Typography gutterBottom variant="h2" component="h1" className="title">ABOUT</Typography>
      <Divider variant="middle" className="separator" />
      <Typography variant="h5" paragraph className="paragraph">
        The objective of this project is to develop a networked multiplayer&nbsp;
        tetris game from a stack of software exclusively Full Stack Javascript.
      </Typography> */}
      <div className="about-cards">
        <Card
          title="dlaurent"
          width={450}
          content="Nemo quaeso miretur, si post exsudatos labores itinerum longos congestosque adfatim commeatus fiducia vestri ductante barbaricos pagos adventans velut mutato repente consilio ad placidiora deverti."
          image={require('../../assets/misc/damien.jpeg') /* eslint-disable-line */}
          onClick={() => window.open('https://profile.intra.42.fr/users/dlaurent')}
        />
        <Card
          title="42"
          width={450}
          content="Nemo quaeso miretur, si post exsudatos labores itinerum longos congestosque adfatim commeatus fiducia vestri ductante barbaricos pagos adventans velut mutato repente consilio ad placidiora deverti."
          image={require('../../assets/misc/42.jpg') /* eslint-disable-line */}
          onClick={() => window.open('https://profile.intra.42.fr/users/dlaurent')}
        />
        <Card
          title="azaliaus"
          width={450}
          content="Victus universis caro ferina est lactisque abundans copia qua sustentantur, et herbae multiplices et siquae alites capi per aucupium possint, et plerosque mos vidimus frumenti usum et vini penitus ignorantes."
          image={require('../../assets/misc/adomas.jpeg') /* eslint-disable-line */}
          onClick={() => window.open('https://profile.intra.42.fr/users/azaliaus')}
        />
      </div>
    </div>
    <Footer />
  </div>
);

export default about;
