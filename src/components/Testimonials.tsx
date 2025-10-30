import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Quote } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Aisha Abdullahi",
    role: "Final Year, Law",
    content: "MSSN UNILORIN has been instrumental in my spiritual growth. The Da'wah programs and halaqah sessions have deepened my understanding of Islam while the academic support helped me excel in my studies.",
    avatar: "AA"
  },
  {
    name: "Muhammad Ibrahim",
    role: "Postgraduate, Engineering",
    content: "Being part of MSSN has been a blessing. The brotherhood, the welfare support during tough times, and the leadership opportunities have shaped me into a better Muslim and professional.",
    avatar: "MI"
  },
  {
    name: "Fatimah Oladipo",
    role: "300 Level, Medicine",
    content: "The sisters' programs in MSSN are empowering. From mentorship to skill acquisition, I've gained confidence and knowledge that will benefit me throughout my career and life.",
    avatar: "FO"
  },
  {
    name: "Yusuf Ahmad",
    role: "400 Level, Mass Communication",
    content: "MSSN's editorial board gave me practical media experience. The newsletters, event coverage, and social media management skills I learned here are invaluable for my career.",
    avatar: "YA"
  },
  {
    name: "Zainab Hassan",
    role: "Alumni, 2023",
    content: "Even as an alumna, I cherish my MSSN UNILORIN experience. The values, friendships, and Islamic knowledge I gained continue to guide me in my professional and personal life.",
    avatar: "ZH"
  },
  {
    name: "Abdullah Musa",
    role: "200 Level, Computer Science",
    content: "The technical unit of MSSN helped me develop my IT skills while serving the community. It's amazing how MSSN combines faith with practical skill development.",
    avatar: "AM"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Calculate which testimonials to show based on screen size
  const getVisibleTestimonials = () => {
    // Show 3 cards on desktop, cycling through all testimonials
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-600 tracking-wider uppercase text-sm">What Members Say</span>
          <h2 className="text-4xl md:text-5xl text-gray-900 mt-4">Testimonials</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto mt-6"></div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Hear from our members about their transformative experiences with MSSN UNILORIN
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getVisibleTestimonials().map((testimonial, index) => (
              <motion.div
                key={`${currentIndex}-${index}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-6">
                    <Quote className="w-10 h-10 text-emerald-600 mb-4 opacity-50" />
                    <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600">
                        <AvatarFallback className="text-white">{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-emerald-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
