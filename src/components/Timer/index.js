import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Timer = ({ expiresIn = 0, restartControl, onTimerEnd = () => { } }) => {
  let timeout;
  const [timeLeft, setTimeLeft] = useState(expiresIn);

  const handleTimerEnd = () => {
    return typeof onTimerEnd === 'function' && onTimerEnd();
  };

  const countDown = () => {
    if (timeLeft > 0) {
      setTimeLeft(timeLeft - 1);
    }

    else if (timeLeft === 0) {
      clearTimeout(timeout);
      handleTimerEnd();
    }
  };

  const format = (n) =>
    n.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

  const renderContent = () => {
    const hours = Math.floor((timeLeft / (60 * 60)) % 24);
    const formatHours = (hours < 10) ? "0" + hours : hours;

    const divisorForMinutes = timeLeft % (60 * 60);
    const minutes = Math.floor(divisorForMinutes / 60);

    const divisorForSeconds = divisorForMinutes % 60;
    const seconds =
      Math.ceil(divisorForSeconds) >= 10
        ? Math.ceil(divisorForSeconds)
        : `0${Math.ceil(divisorForSeconds)}`;

    return `${format(formatHours)}:${format(minutes)}:${format(seconds)}`;
  };

  useEffect(() => {
    setTimeLeft(expiresIn);
  }, [restartControl]);

  useEffect(() => {
    timeout = setTimeout(countDown, 1000);

    return () => {
      clearTimeout(timeout);
    };
  });

  return renderContent();
};

Timer.propTypes = {
  expiresIn: PropTypes.number.isRequired,
  restartControl: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Timer.defaultProps = {};

export default Timer;