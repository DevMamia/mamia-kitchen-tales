import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  direction?: 'enter' | 'exit';
  cultural?: 'italian' | 'mexican' | 'thai';
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  direction = 'enter',
  cultural 
}) => {
  const getBackgroundClass = () => {
    switch (cultural) {
      case 'italian':
        return 'parallax-italian';
      case 'mexican':
        return 'parallax-mexican';
      case 'thai':
        return 'parallax-thai';
      default:
        return '';
    }
  };

  const pageVariants = {
    initial: {
      rotateY: direction === 'enter' ? 180 : 0,
      opacity: direction === 'enter' ? 0 : 1,
      scale: 0.8,
    },
    animate: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
    },
    exit: {
      rotateY: -180,
      opacity: 0,
      scale: 0.8,
    }
  };

  return (
    <motion.div
      className={`min-h-screen w-full ${getBackgroundClass()}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 20,
        duration: 0.8
      }}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;