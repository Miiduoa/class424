'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  duration?: number;
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
}

const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.7,
  threshold = 0.1,
  once = true,
  rootMargin = '-50px 0px',
}: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: once,
    rootMargin,
  });
  
  useEffect(() => {
    if (inView) {
      setTimeout(() => {
        setIsVisible(true);
      }, delay * 1000);
    }
  }, [inView, delay]);
  
  // Define transform based on direction
  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translate3d(0, 40px, 0)';
      case 'down':
        return 'translate3d(0, -40px, 0)';
      case 'left':
        return 'translate3d(40px, 0, 0)';
      case 'right':
        return 'translate3d(-40px, 0, 0)';
      case 'scale':
        return 'scale3d(0.95, 0.95, 1)';
      case 'fade':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };
  
  const style = {
    transform: isVisible ? 'translate3d(0, 0, 0)' : getInitialTransform(),
    opacity: isVisible ? 1 : 0,
    transition: `transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
  };
  
  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
};

export default AnimatedSection; 