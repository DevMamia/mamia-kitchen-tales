
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { CharacterCard } from '@/components/CharacterCard';
import { mamas } from '@/data/mamas';

const Mamas = () => {
  const navigate = useNavigate();

  return (
    <Layout 
      pageTitle="Meet Our Cooking Mamas" 
      pageSubtitle="Authentic recipes and wisdom from grandmothers around the world"
      variant="cultural"
    >
      <div className="space-y-6">
        {mamas.map((mama) => (
          <CharacterCard
            key={mama.id}
            mama={mama}
            onClick={() => navigate(`/mama/${mama.id}`)}
            className="w-full max-w-md mx-auto"
          />
        ))}
        
        <div className="text-center pt-6">
          <p className="text-sm text-muted-foreground font-handwritten leading-relaxed">
            Each mama brings generations of cooking wisdom and authentic family recipes. 
            Tap any mama above to explore their personal cookbook and start cooking together!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Mamas;
