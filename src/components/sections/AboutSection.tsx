import { motion } from 'motion/react';
import { BookOpen, Lightbulb, Heart } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <span className="text-emerald-600 tracking-wider uppercase text-sm">About MSSN</span>
              <h2 className="text-4xl md:text-5xl text-gray-900 mt-4 mb-6">Who We Are</h2>
              <div className="w-20 h-1 bg-emerald-600 mb-6"></div>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">
              The Muslim Students' Society of Nigeria (MSSN) is a national Islamic organization established in <span className="text-emerald-600">1954</span> to promote Islamic values and unity among Muslim students across Nigeria.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              The University of Ilorin Branch represents one of its most vibrant and impactful chapters — fostering brotherhood, discipline, academic excellence, and leadership within the university community.
            </p>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-100">
              <h3 className="text-2xl text-emerald-800 mb-4">Our Mandate</h3>
              <p className="text-gray-700 leading-relaxed">
                MSSN UNILORIN serves as a spiritual, academic, and social support system for Muslim students. Through weekly programs, seminars, da'wah, and welfare activities, the society ensures members maintain strong Islamic values while achieving success in their studies.
              </p>
            </div>
          </motion.div>

          <div className="space-y-6">
            <h3 className="text-3xl text-gray-900 mb-8">Our Philosophy</h3>
            
            <div className="space-y-6">
              {[
                { icon: BookOpen, text: "Islam is a complete way of life." },
                { icon: Lightbulb, text: "Knowledge must be pursued and applied for the benefit of humanity." },
                { icon: Heart, text: "Muslim students must lead with integrity, service, and compassion." }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="group hover:translate-x-2 transition-transform duration-300"
                >
                  <div className="bg-white p-6 rounded-xl border-l-4 border-l-emerald-600 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <p className="text-gray-700 text-lg">{item.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
