import { motion } from 'motion/react';
import { BookOpen, GraduationCap, HandHeart, Megaphone, Heart, FileText, ChevronRight } from 'lucide-react';

export function FocusAreasSection() {
  const focusAreas = [
    { 
      icon: BookOpen, 
      title: "Da'wah and Islamic Education",
      items: ["Qur'an and Tafsīr sessions", "Islamic lectures and symposia", "Spiritual retreats and mentorship"]
    },
    { 
      icon: GraduationCap, 
      title: "Academic and Career Development",
      items: ["Tutorials across faculties", "Academic excellence seminars", "Skill acquisition and leadership training"]
    },
    { 
      icon: HandHeart, 
      title: "Welfare and Humanitarian Service",
      items: ["Foodstuff and charity drives", "Financial and moral support for students", "Medical and community outreach"]
    },
    { 
      icon: Megaphone, 
      title: "Public Relations and Media",
      items: ["Awareness campaigns and digital da'wah", "Content creation and press coverage", "Strengthening online presence"]
    },
    { 
      icon: Heart, 
      title: "Sisters' Affairs",
      items: ["Dedicated programs for female Muslim students", "Halaqah sessions and mentorship", "Women empowerment initiatives"]
    },
    { 
      icon: FileText, 
      title: "Editorial Board",
      items: ["Publishing newsletters and magazines", "Documenting events and MSSN materials", "Islamic journalism and discussions"]
    },
  ];

  return (
    <section id="focus" className="py-24 px-4 bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 tracking-wider uppercase text-sm">What We Do</span>
          <h2 className="text-4xl md:text-5xl text-white mt-4">Core Areas of Focus</h2>
          <div className="w-20 h-1 bg-emerald-500 mx-auto mt-6"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {focusAreas.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors">
                <item.icon className="w-7 h-7 text-emerald-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl mb-4">{item.title}</h3>
              <ul className="space-y-2">
                {item.items.map((listItem, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <ChevronRight className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                    <span className="text-sm">{listItem}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
