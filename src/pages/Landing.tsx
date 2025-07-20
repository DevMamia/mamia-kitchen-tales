import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Heart, ChefHat } from 'lucide-react';
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

  const features = [
    {
      icon: MessageCircle,
      title: 'Voice-guided cooking',
      description: 'Step-by-step guidance from authentic cultural mamas'
    },
    {
      icon: Heart,
      title: 'Cultural stories',
      description: 'Learn the history and traditions behind each recipe'
    },
    {
      icon: ChefHat,
      title: 'Authentic recipes',
      description: 'Traditional family recipes passed down through generations'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-warmth-50 to-warmth-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative mx-auto max-w-md mb-8">
            <img 
              src="/lovable-uploads/Landingapge.png" 
              alt="MAMIA - Family-Style Flavour" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4" style={{ color: 'hsl(var(--logo-brown))' }}>
            MAMIA
          </h1>
          
          <p className="font-handwritten text-xl md:text-2xl text-warmth-800 mb-8 max-w-2xl mx-auto">
            Learn authentic recipes from traditional cultural mamas who guide you with voice, stories, and generations of cooking wisdom
          </p>

          <Button 
            onClick={() => navigate('/auth')}
            size="lg"
            className="font-handwritten text-lg px-8 py-6 bg-gradient-to-r from-warmth-600 to-warmth-700 hover:from-warmth-700 hover:to-warmth-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Join our Kitchen
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-warmth-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <feature.icon className="w-12 h-12 text-warmth-600" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-warmth-800">
                  {feature.title}
                </h3>
                <p className="text-warmth-700 font-handwritten">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Meet the Mamas Section */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold mb-6" style={{ color: 'hsl(var(--logo-brown))' }}>
            Meet Your Cultural Cooking Guides
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/70 backdrop-blur-sm border-warmth-200">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <span className="text-3xl">🍝</span>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2 text-warmth-800">Nonna Lucia</h3>
                <p className="text-warmth-700 font-handwritten">Italian grandmother sharing timeless pasta secrets</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-warmth-200">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                  <span className="text-3xl">🌶️</span>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2 text-warmth-800">Abuela Rosa</h3>
                <p className="text-warmth-700 font-handwritten">Mexican abuela with vibrant flavors and family stories</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-warmth-200">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-3xl">🌿</span>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2 text-warmth-800">Yai Malee</h3>
                <p className="text-warmth-700 font-handwritten">Thai grandmother with fresh herbs and ancient techniques</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <p className="font-handwritten text-lg text-warmth-700 mb-6">
            Ready to learn from the best home cooks in the world?
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            variant="outline"
            size="lg"
            className="font-handwritten text-lg px-8 py-4 border-warmth-600 text-warmth-700 hover:bg-warmth-600 hover:text-white transition-colors duration-300"
          >
            Start Your Culinary Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;