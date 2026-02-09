
import React from 'react';

const MobileParticles: React.FC = () => {
  const hearts = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 90 + 5}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${12 + Math.random() * 18}s`,
    size: `${14 + Math.random() * 8}px`,
  }));

  return (
    <div className="md:hidden absolute inset-0 pointer-events-none overflow-hidden z-[0]">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart-particle flex items-center justify-center opacity-0"
          style={{
            left: heart.left,
            bottom: '-30px',
            animationDelay: heart.delay,
            animationDuration: heart.duration,
          }}
        >
          <svg 
            width={heart.size} 
            height={heart.size} 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className="text-[#C5A059]"
            style={{ filter: 'drop-shadow(0 0 2px rgba(197, 160, 89, 0.4))' }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default MobileParticles;
