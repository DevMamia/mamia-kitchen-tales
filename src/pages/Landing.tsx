
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-warmth-50 to-warmth-100 flex flex-col items-center justify-center p-4">
      {/* Main Graphic */}
      <div className="flex-1 flex items-center justify-center w-full max-w-sm">
        <img 
          src="/lovable-uploads/Landingapge.png" 
          alt="MAMIA - Family-Style Flavour" 
          className="w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow-2xl"
        />
      </div>
      
      {/* Join Kitchen Button */}
      <div className="w-full max-w-sm pb-8">
        <Button 
          onClick={() => navigate('/auth')}
          size="lg"
          className="w-full font-handwritten text-xl py-6 bg-gradient-to-r from-warmth-600 to-warmth-700 hover:from-warmth-700 hover:to-warmth-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Join our Kitchen
        </Button>
      </div>
    </div>
  );
};

export default Landing;
