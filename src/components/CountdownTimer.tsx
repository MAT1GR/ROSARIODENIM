import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ className }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const nextThursday = new Date();
    nextThursday.setDate(now.getDate() + (4 - now.getDay() + 7) % 7);
    nextThursday.setHours(21, 0, 0, 0);

    if (now > nextThursday) {
      nextThursday.setDate(nextThursday.getDate() + 7);
    }

    const difference = nextThursday.getTime() - now.getTime();

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        días: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timerComponents: JSX.Element[] = [];

    Object.keys(timeLeft).forEach((interval, index) => {
      if (timeLeft[interval as keyof typeof timeLeft] !== undefined) {
        timerComponents.push(
          <div key={interval} className="text-center">
            {/* Estilos para que los números se vean grandes y en negrita */}
            <span className="text-3xl sm:text-5xl tracking-[2px] text-[#f8f8f8] font-inter font-bold">
              {String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}
            </span>
            <span className="block text-xs sm:text-base uppercase">{interval}</span>
          </div>
        );
        if (index < Object.keys(timeLeft).length - 1) { 
          timerComponents.push(
            <div key={`separator-${interval}`} className="flex items-center justify-center h-full">
              <div className="w-px bg-[#f8f8f8] h-2/3 mx-1 sm:mx-2 md:mx-4"></div>
            </div>
          );
        }
      }
    });

  return (
    <div className={className}>
      <div className="flex justify-center gap-2 sm:gap-4 md:gap-6">
        {timerComponents.length ? timerComponents : <span>¡El drop es ahora!</span>}
      </div>
    </div>
  );
};

export default CountdownTimer;