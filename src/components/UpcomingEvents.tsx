import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Button } from './ui/button';

interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: string;
  description: string;
}

const upcomingEvents: Event[] = [
  {
    title: "Weekly Halaqah Session",
    date: "Every Friday",
    time: "2:00 PM - 4:00 PM",
    location: "MSSN Secretariat",
    category: "Da'wah",
    attendees: "50+",
    description: "Join us for Qur'an recitation, Tafsir, and Islamic discussions"
  },
  {
    title: "Academic Excellence Seminar",
    date: "December 15, 2025",
    time: "10:00 AM - 3:00 PM",
    location: "Faculty of Science Auditorium",
    category: "Academic",
    attendees: "200+",
    description: "Study techniques, time management, and career guidance sessions"
  },
  {
    title: "Charity Drive & Food Distribution",
    date: "December 20, 2025",
    time: "9:00 AM - 12:00 PM",
    location: "Campus-wide",
    category: "Welfare",
    attendees: "100+",
    description: "Supporting less privileged students with food items and essentials"
  },
  {
    title: "Sisters' Empowerment Workshop",
    date: "January 5, 2026",
    time: "1:00 PM - 5:00 PM",
    location: "Women's Center",
    category: "Sisters' Affairs",
    attendees: "80+",
    description: "Skill acquisition, leadership training, and mentorship for Muslim sisters"
  }
];

export function UpcomingEvents() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-600 tracking-wider uppercase text-sm">What's Next</span>
          <h2 className="text-4xl md:text-5xl text-gray-900 mt-4">Upcoming Events</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto mt-6"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="group h-full hover:shadow-xl transition-all duration-300 border-l-4 border-l-emerald-600 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                      {event.category}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>

                  <h3 className="text-xl text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    Register for Event
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
