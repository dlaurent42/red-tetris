import React, { useRef, useState, useEffect } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Header from '../navigation/header/Header';
import Card from './Card';
import Footer from '../navigation/footer/Footer';
import './Home.scss';

const home = () => {

  // Create state
  const [ref, setRef] = useState({
    sectionZero: null,
    sectionOne: null,
  });

  // Create a reference to scroll between sections
  const sectionZeroRef = useRef(null);
  const sectionOneRef = useRef(null);

  useEffect(() => {
    setRef({
      sectionZero: sectionZeroRef,
      sectionOne: sectionOneRef,
    });
  }, [ref]);

  // Handlers
  const scrollToRef = reference => window.scrollTo(0, reference.current.offsetTop);

  return (
    <div className="home-container" ref={sectionZeroRef}>
      <Header color="light" />
      <div className="home-bg" />
      <div className="home-bg-layer" />
      <div className="home-bg-text">
        <Typography gutterBottom variant="h2" component="h1">WELCOME TO RED TETRIS</Typography>
        <Typography gutterBottom variant="h4" paragraph>Tetris Network with Red Pelicans Sauce</Typography>
      </div>
      <div
        role="presentation"
        className="scroll-down"
        onClick={() => scrollToRef(sectionOneRef)}
      >
        <div className="scroll-down-chevron" />
        <div className="scroll-down-chevron" />
        <div className="scroll-down-chevron" />
        <span className="scroll-down-text">Scroll down</span>
      </div>
      <div ref={sectionOneRef} className="home-presentation">
        <Typography gutterBottom variant="h2" component="h1">HOW IT WORKS</Typography>
        <Divider variant="middle" className="separator" />
        <Typography variant="h5" paragraph className="paragraph">
          The objective of this project is to develop a networked multiplayer&nbsp;
          tetris game from a stack of software exclusively Full Stack Javascript.
        </Typography>
        <div className="home-presentation-cards">
          <Card
            title="Client"
            content="Et prima post Osdroenam quam, ut dictum est, ab hac descriptione discrevimus, Commagena, nunc Euphratensis, clementer adsurgit, Hierapoli, vetere Nino et Samosata civitatibus amplis inlustris."
            image={require('../../assets/backgrounds/control-controller-device-687811.jpg') /* eslint-disable-line */}
            onClick={() => window.open('https://www.google.com/')}
          />
          <Card
            title="Server"
            content="Ego vero sic intellego, Patres conscripti, nos hoc tempore in provinciis decernendis perpetuae pacis habere oportere rationem. Nam quis hoc non sentit omnia alia esse nobis vacua ab omni periculo atque etiam suspicione belli?"
            image={require('../../assets/backgrounds/battle-black-and-white-blur-131616.jpg') /* eslint-disable-line */}
            onClick={() => window.open('https://www.google.com/')}
          />
          <Card
            title="API"
            content="Homines enim eruditos et sobrios ut infaustos et inutiles vitant, eo quoque accedente quod et nomenclatores adsueti haec et talia venditare, mercede accepta lucris quosdam et prandiis inserunt subditicios ignobiles et obscuros."
            image={require('../../assets/backgrounds/ace-blur-card-game-1796794.jpg') /* eslint-disable-line */}
            onClick={() => window.open('https://www.google.com/')}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default home;
