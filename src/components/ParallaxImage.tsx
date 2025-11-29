import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
}

export function ParallaxImage({ src, alt, speed = 0.5, className = '' }: ParallaxImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${-30 * speed}%`]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div 
        ref={imageRef}
        style={{ y }}
        className="w-full h-full"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '120%',
          }}
          role="img"
          aria-label={alt}
        />
      </motion.div>
    </div>
  );
}
