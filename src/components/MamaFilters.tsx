import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Difficulty, Category, ContentType } from '@/data/recipes';

interface MamaFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedDifficulty: Difficulty | 'ALL';
  onDifficultyChange: (difficulty: Difficulty | 'ALL') => void;
  selectedCategory: Category | 'ALL';
  onCategoryChange: (category: Category | 'ALL') => void;
  selectedContentType: ContentType | 'ALL';
  onContentTypeChange: (contentType: ContentType | 'ALL') => void;
  resultCount: number;
}

const difficulties: (Difficulty | 'ALL')[] = ['ALL', 'EASY', 'MEDIUM', 'ADVANCED'];
const categories: (Category | 'ALL')[] = ['ALL', 'QUICK', 'EVERYDAY', 'WEEKEND', 'CELEBRATION'];
const contentTypes: (ContentType | 'ALL')[] = ['ALL', 'VEGETARIAN', 'MEAT', 'FISH', 'VEGAN'];

export const MamaFilters = ({
  searchTerm,
  onSearchChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedCategory,
  onCategoryChange,
  selectedContentType,
  onContentTypeChange,
  resultCount
}: MamaFiltersProps) => {
  const hasActiveFilters = selectedDifficulty !== 'ALL' || selectedCategory !== 'ALL' || selectedContentType !== 'ALL' || searchTerm.length > 0;

  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background/50 backdrop-blur-sm border-muted"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Difficulty */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Difficulty
          </label>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <Badge
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => onDifficultyChange(difficulty)}
              >
                {difficulty === 'ALL' ? 'All Levels' : difficulty.toLowerCase()}
              </Badge>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Occasion
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => onCategoryChange(category)}
              >
                {category === 'ALL' ? 'All Occasions' : category.toLowerCase()}
              </Badge>
            ))}
          </div>
        </div>

        {/* Content Type */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Diet
          </label>
          <div className="flex flex-wrap gap-2">
            {contentTypes.map((contentType) => (
              <Badge
                key={contentType}
                variant={selectedContentType === contentType ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => onContentTypeChange(contentType)}
              >
                {contentType === 'ALL' ? 'All Diets' : contentType.toLowerCase()}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {resultCount} recipe{resultCount !== 1 ? 's' : ''} found
        </span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange('');
              onDifficultyChange('ALL');
              onCategoryChange('ALL');
              onContentTypeChange('ALL');
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};