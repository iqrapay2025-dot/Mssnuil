import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { UserCircle, Users, FileText, Lightbulb, BookOpen } from 'lucide-react';

export function StructureSection() {
  const structureItems = [
    { icon: UserCircle, title: "Ameer (President)", desc: "Leads the society and provides overall direction and guidance." },
    { icon: Users, title: "Executive Council", desc: "Oversees operations, programs, and welfare activities of the society." },
    { icon: FileText, title: "Editorial Board", desc: "Responsible for publications, media statements, and documentation reflecting Islamic ethics." },
    { icon: Lightbulb, title: "Committees and Units", desc: "Include Academic, Welfare, Da'wah, PRO, Sisters' Wing, Finance, and Technical Units." },
    { icon: BookOpen, title: "Advisory Council", desc: "Experienced members providing mentorship, counsel, and strategic guidance." },
  ];

  return (
    <section id="structure" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-600 tracking-wider uppercase text-sm">Leadership</span>
          <h2 className="text-4xl md:text-5xl text-gray-900 mt-4">Our Structure</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto mt-6"></div>
          <p className="text-lg text-gray-600 mt-6 max-w-3xl mx-auto">
            A well-organized leadership system that ensures discipline, transparency, and effective coordination.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {structureItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-emerald-50/30 h-full">
                <CardHeader>
                  <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
                    <item.icon className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
