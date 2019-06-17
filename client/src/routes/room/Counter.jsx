import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useInterval from '../../hooks/useInterval';

const counter = (props) => {

  if (!props.game.hasStarted || props.game.counterRun) return null;
  const [count, setCount] = useState(3);
  const updateCounter = () => {
    if (props.game.hasStarted && !props.game.counterRun) {
      setCount((count === 1 || count === 'Start !') ? 'Start !' : count - 1);
      if (count === 'Start !') props.setGame({ ...props.game, counterRun: true });
    }
  };
  useInterval(() => updateCounter(), 1000);
  console.log('render Counter');
  return (
    <div className="game-counter">
      {count}
    </div>
  );

};

counter.propTypes = {
  game: PropTypes.objectOf(PropTypes.any).isRequired,
  setGame: PropTypes.func.isRequired,
};

export default counter;
