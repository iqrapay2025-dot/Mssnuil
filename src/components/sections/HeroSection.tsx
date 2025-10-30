import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { TypingEffect } from '../TypingEffect';
import { ChevronRight, ArrowRight } from 'lucide-react';

import heroImage1 from 'figma:asset/9a3d9725e9a213f39ca0a2aafb29eceed3638be9.png';
import heroImage2 from 'figma:asset/eca439ce40e1bac64c0e259eabb4a42c224ad0ad.png';
import heroImage3 from 'figma:asset/17f2f35565be0dc80752557ae2cd9e92208726f0.png';

const heroImages = [
  heroImage1,
  heroImage2,
  heroImage3
];

interface HeroSectionProps {
  scrollToSection: (id: string) => void;
}

export function HeroSection({ scrollToSection }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);

  // Auto-slide carousel for hero background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Carousel Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={image}
              alt={`Islamic Architecture ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-block px-4 py-2 bg-emerald-500/30 backdrop-blur-sm rounded-full border border-emerald-400/50 mb-6"
        >
          <span className="text-emerald-300">Faith. Knowledge. Service.</span>
        </motion.div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white mb-6 max-w-4xl mx-auto leading-tight">
          <TypingEffect 
            text="Welcome to MSSN UNIVERSITY OF ILORIN" 
            speed={80}
            className="font-bold"
            onComplete={() => setTypingComplete(true)}
          />
        </h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: typingComplete ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          A faith-driven student organization committed to nurturing disciplined, knowledgeable, and service-oriented Muslim youth.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: typingComplete ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/20 max-w-3xl mx-auto mb-12"
        >
          <p className="text-lg sm:text-xl text-white italic leading-relaxed">
            "Our mission is to cultivate a generation of Muslims who embody excellence in character, knowledge, and leadership."
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: typingComplete ? 1 : 0, y: typingComplete ? 0 : 20 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button 
            onClick={() => scrollToSection('contact')} 
            size="lg" 
            className="bg-white text-emerald-700 hover:bg-emerald-50 px-6 sm:px-8 text-base sm:text-lg rounded-full shadow-xl h-auto py-3"
          >
            Join the Ummah
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button 
            onClick={() => scrollToSection('about')} 
            size="lg" 
            variant="outline" 
            className="border-2 border-white text-emerald-800 bg-white/90 hover:bg-white hover:text-emerald-900 px-6 sm:px-8 text-base sm:text-lg rounded-full backdrop-blur-sm h-auto py-3"
          >
            Learn More
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-white rotate-90" />
        </div>
      </motion.div>
    </section>
  );
}