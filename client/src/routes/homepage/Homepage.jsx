import React, { useRef, useState, useEffect } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Header from '../../misc/navigation/header/Header';
import Card from '../../misc/UI/surface/Surface';
import Footer from '../../misc/navigation/footer/Footer';
import './Homepage.scss';

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
      <Header color={window.scrollY + 32 < window.innerHeight ? 'light' : 'dark'} />
      <div className="home-bg" />
      <div className="home-bg-layer" />
      <div className="home-bg-text">
        <Typography gutterBottom variant="h2" component="h1">R E D&nbsp;&nbsp;&nbsp;T E T R I S</Typography>
        <Typography gutterBottom variant="h4" paragraph>Tetris Network</Typography>
        <em> with </em>
        <Typography gutterBottom variant="h4" paragraph>Red Pelicans Sauce</Typography>
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
            image={require('../../assets/backgrounds/homepage_card_01.png') /* eslint-disable-line */}
            onClick={() => window.open('https://www.google.com/')}
          />
          <Card
            title="Server"
            content="Ego vero sic intellego, Patres conscripti, nos hoc tempore in provinciis decernendis perpetuae pacis habere oportere rationem. Nam quis hoc non sentit omnia alia esse nobis vacua ab omni periculo atque etiam suspicione belli?"
            image={require('../../assets/backgrounds/homepage_card_02.png') /* eslint-disable-line */}
            onClick={() => window.open('https://www.google.com/')}
          />
          <Card
            title="API"
            content="Homines enim eruditos et sobrios ut infaustos et inutiles vitant, eo quoque accedente quod et nomenclatores adsueti haec et talia venditare, mercede accepta lucris quosdam et prandiis inserunt subditicios ignobiles et obscuros."
            image={require('../../assets/backgrounds/homepage_card_03.png') /* eslint-disable-line */}
            onClick={() => window.open('https://documenter.getpostman.com/view/5992585/S1a1bUzL?version=latest')}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default home;
