import { useState, useEffect } from 'react';
import { getTimeRemaining } from '../../utils/formatters';

const CountdownTimer = ({ deadline }) => {
  const [time, setTime] = useState(getTimeRemaining(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (time.expired) {
    return <span className="badge badge--closed">Voting Closed</span>;
  }

  return (
    <div className="countdown">
      {[
        { label: 'Days', value: time.days },
        { label: 'Hrs', value: time.hours },
        { label: 'Min', value: time.minutes },
        { label: 'Sec', value: time.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="countdown__unit">
          <span className="countdown__value">{String(value).padStart(2, '0')}</span>
          <span className="countdown__label">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
