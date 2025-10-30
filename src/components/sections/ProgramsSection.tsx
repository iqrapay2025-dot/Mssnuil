import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Users, GraduationCap, HandHeart, Calendar, FileText } from 'lucide-react';

export function ProgramsSection() {
  const navigate = useNavigate();

  const programs = [
    { title: "Orientation Program", desc: "Welcoming and guiding new Muslim students.", icon: Users },
    { title: "Academic Seminars & Quiz Competitions", desc: "Promoting intellectual and Islamic excellence.", icon: GraduationCap },
    { title: "Charity and Welfare Drives", desc: "Distributing food items, clothing, and essentials to students and communities.", icon: HandHeart },
    { title: "Annual Week & Islamic Camp", desc: "A week of worship, learning, and bonding that rejuvenates the Muslim spirit on campus.", icon: Calendar },
  ];

  return (
    <section id="programs" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-600 tracking-wider uppercase text-sm">Activities</span>
          <h2 className="text-4xl md:text-5xl text-gray-900 mt-4">Programs and Events</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto mt-6"></div>
          <p className="text-lg text-gray-600 mt-6 max-w-3xl mx-auto">
            Impactful programs throughout each academic session.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((program, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:bg-emerald-600 transition-colors">
                  <program.icon className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-2xl text-gray-900 mb-3">{program.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{program.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-lg text-gray-600 mt-12 italic">
          Every program is an opportunity to learn, serve, and grow closer to Allah (SWT).
        </p>

        <div className="text-center mt-8">
          <Button 
            onClick={() => navigate('/blog')}
            size="lg"
            variant="outline"
            className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            <FileText className="mr-2 w-5 h-5" />
            Read Our Blog
          </Button>
        </div>
      </div>
    </section>
  );
}
