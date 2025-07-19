
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DifficultyBadgeProps {
  difficulty: 'EASY' | 'MEDIUM' | 'ADVANCED';
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'EASY':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ADVANCED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge className={`${getDifficultyColor(difficulty)} font-medium`}>
      {difficulty}
    </Badge>
  );
};
