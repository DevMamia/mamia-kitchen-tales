
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
    <div className="min-h-screen bg-gradient-to-b from-warmth-50 to-warmth-100 flex items-center justify-center p-4">
      {/* Clickable Landing Image */}
      <div 
        onClick={handleImageClick}
        className="w-full max-w-sm cursor-pointer transform transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        <img 
          src="/lovable-uploads/9975ff1b-4219-48d1-8464-290df9a084dd.png" 
          alt="MAMIA - Join our Kitchen" 
          className="w-full h-auto object-contain rounded-2xl shadow-2xl"
        />
      </div>
    </div>
  );
};

export default Landing;
