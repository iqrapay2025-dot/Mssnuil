import { motion } from 'motion/react';
import { Globe, Target, ChevronRight } from 'lucide-react';

export function VisionMissionSection() {
  return (
    <section id="vision" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-emerald-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-600 tracking-wider uppercase text-sm">Our Purpose</span>
          <h2 className="text-4xl md:text-5xl text-gray-900 mt-4">Vision and Mission</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto mt-6"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-emerald-100"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl text-gray-900 mb-6">Vision</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              To establish an exemplary Muslim student community that upholds Islamic values, academic excellence, and service to humanity within and beyond the University of Ilorin.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-emerald-100"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl text-gray-900 mb-6">Mission</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                <p className="text-gray-600 text-lg">To nurture Muslim students spiritually, morally, and intellectually.</p>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                <p className="text-gray-600 text-lg">To provide an enabling environment for learning and Islamic growth.</p>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                <p className="text-gray-600 text-lg">To unite Muslim students under the banner of Tawḥīd (Oneness of Allah).</p>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                <p className="text-gray-600 text-lg">To empower members to contribute positively to the Ummah and society at large.</p>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
