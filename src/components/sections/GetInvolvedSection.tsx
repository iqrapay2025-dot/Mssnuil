import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Users, Heart, HandHeart, ArrowRight } from 'lucide-react';

interface GetInvolvedSectionProps {
  scrollToSection: (id: string) => void;
}

export function GetInvolvedSection({ scrollToSection }: GetInvolvedSectionProps) {
  const involvementWays = [
    { icon: Users, text: "Volunteer in any committee or unit" },
    { icon: Heart, text: "Sponsor a welfare or da'wah project" },
    { icon: HandHeart, text: "Partner for academic or spiritual programs" }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-6">Get Involved</h2>
          <div className="w-20 h-1 bg-white mx-auto mb-8"></div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 mb-12 border border-white/20">
            <h3 className="text-3xl mb-6">Become a Member</h3>
            <p className="text-xl text-emerald-50 leading-relaxed max-w-3xl mx-auto">
              Joining MSSN UNILORIN means becoming part of a brotherhood and sisterhood devoted to Allah's cause. All Muslim students of the University of Ilorin are welcome.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {involvementWays.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button 
            onClick={() => scrollToSection('contact')} 
            size="lg" 
            className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 text-lg rounded-full shadow-xl h-auto py-3"
          >
            Join Us Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            onClick={() => scrollToSection('contact')} 
            size="lg" 
            variant="outline" 
            className="border-2 border-white text-emerald-800 bg-white/90 hover:bg-white hover:text-emerald-900 px-8 text-lg rounded-full backdrop-blur-sm h-auto py-3"
          >
            Become a Volunteer
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
