import { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { ShoppingListItem } from '@/types/shopping';

interface DraggableShoppingItemProps {
  item: ShoppingListItem;
  isDragging?: boolean;
}

export default function DraggableShoppingItem({ item, isDragging }: DraggableShoppingItemProps) {
  const { toggleItemChecked, deleteItem } = useShoppingList();
  const [dragX, setDragX] = useState(0);
  const [isSwipeDeleting, setIsSwipeDeleting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // Swiped right - delete
      setIsSwipeDeleting(true);
      setTimeout(() => {
        deleteItem(item.id);
      }, 300);
    } else if (info.offset.x < -threshold) {
      // Swiped left - toggle check
      toggleItemChecked(item.id);
      setDragX(0);
    } else {
      // Snap back
      setDragX(0);
    }
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragX(info.offset.x);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`relative overflow-hidden ${isDragging || isSortableDragging ? 'z-50' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isSwipeDeleting ? 0 : 1, 
        y: 0,
        scale: isSwipeDeleting ? 0.8 : 1
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-green-600">
          <Check className="w-5 h-5" />
          <span className="font-medium">Mark Complete</span>
        </div>
        <div className="flex items-center gap-2 text-red-600">
          <span className="font-medium">Delete</span>
          <Trash2 className="w-5 h-5" />
        </div>
      </div>

      {/* Main Item */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -150, right: 150 }}
        dragElastic={0.1}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{ x: dragX }}
        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
          isDragging || isSortableDragging
            ? 'bg-white shadow-elegant scale-105 rotate-2'
            : item.checked
            ? 'bg-muted/40'
            : 'bg-white shadow-sm hover:shadow-md'
        }`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="touch-none cursor-grab active:cursor-grabbing p-1 hover:bg-muted/50 rounded transition-colors"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Checkbox */}
        <motion.button
          onClick={() => toggleItemChecked(item.id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            item.checked
              ? 'bg-primary border-primary text-primary-foreground'
              : 'border-muted-foreground/30 hover:border-primary'
          }`}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          {item.checked && (
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="w-3 h-3" />
            </motion.div>
          )}
        </motion.button>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.span 
            className={`block font-medium transition-all duration-200 ${
              item.checked 
                ? 'text-muted-foreground line-through' 
                : 'text-foreground'
            }`}
            animate={{ 
              opacity: item.checked ? 0.6 : 1,
              scale: item.checked ? 0.95 : 1
            }}
          >
            {item.ingredient_name}
          </motion.span>
          {item.quantity && (
            <span className={`text-sm transition-colors duration-200 ${
              item.checked ? 'text-muted-foreground/60' : 'text-muted-foreground'
            }`}>
              {item.quantity}
            </span>
          )}
          {item.recipe_name && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Badge variant="outline" className="text-xs mt-1">
                From {item.recipe_name}
              </Badge>
            </motion.div>
          )}
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteItem(item.id)}
          className="text-muted-foreground hover:text-destructive opacity-60 hover:opacity-100 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}