
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect authenticated users to the app
  React.useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleImageClick = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-warmth-50 to-warmth-100 p-4">
      <div 
        onClick={handleImageClick}
        className="cursor-pointer transform transition-transform duration-300 hover:scale-105 active:scale-95 max-w-md w-full"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleImageClick();
          }
        }}
        aria-label="Join MAMIA - Tap to get started"
      >
        <img 
          src="/lovable-uploads/b259d40e-5bfb-417a-a08d-ba26724ff629.png" 
          alt="MAMIA - Join our Kitchen" 
          className="w-full h-auto rounded-2xl shadow-2xl"
        />
      </div>
    </div>
  );
};

export default Landing;
