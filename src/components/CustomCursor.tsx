import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const dotX = useSpring(cursorX, { damping: 50, stiffness: 700 });
  const dotY = useSpring(cursorY, { damping: 50, stiffness: 700 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onMouseEnter = () => setIsHovering(true);
    const onMouseLeave = () => setIsHovering(false);

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, [cursorX, cursorY]);

  // Only show custom cursor on desktop
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return null;
  }

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 w-10 h-10 border-2 border-emerald-500 rounded-full pointer-events-none z-[9999] transition-all duration-200 ${
          isHovering ? 'scale-150 bg-emerald-500/10' : 'scale-100'
        }`}
        style={{ 
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference'
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-emerald-500 rounded-full pointer-events-none z-[9999]"
        style={{ 
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      />
    </>
  );
}
