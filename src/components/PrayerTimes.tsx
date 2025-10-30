import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Clock, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface PrayerTime {
  name: string;
  time: string;
  isNext: boolean;
}

export function PrayerTimes() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<string>('');

  // Prayer times for Ilorin, Nigeria (approximate)
  const prayerTimes: PrayerTime[] = [
    { name: 'Fajr', time: '05:15', isNext: false },
    { name: 'Dhuhr', time: '12:35', isNext: false },
    { name: 'Asr', time: '15:50', isNext: false },
    { name: 'Maghrib', time: '18:25', isNext: false },
    { name: 'Isha', time: '19:40', isNext: false },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Find next prayer
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    
    for (let i = 0; i < prayerTimes.length; i++) {
      const [hours, minutes] = prayerTimes[i].time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      
      if (currentMinutes < prayerMinutes) {
        setNextPrayer(prayerTimes[i].name);
        prayerTimes[i].isNext = true;
        break;
      }
      
      if (i === prayerTimes.length - 1) {
        // If we've passed all prayers, next prayer is tomorrow's Fajr
        setNextPrayer(prayerTimes[0].name);
        prayerTimes[0].isNext = true;
      }
    }
  }, [currentTime]);

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-0 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Prayer Times
            </CardTitle>
            <div className="text-sm opacity-90 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Ilorin
            </div>
          </div>
          <div className="text-2xl mt-2">{formatTime(currentTime)}</div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {prayerTimes.map((prayer, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-3 rounded-lg transition-all ${
                  prayer.name === nextPrayer
                    ? 'bg-white/20 backdrop-blur-sm border border-white/30'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  {prayer.name}
                  {prayer.name === nextPrayer && (
                    <span className="text-xs bg-white/30 px-2 py-1 rounded-full">Next</span>
                  )}
                </span>
                <span className="font-mono">{prayer.time}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/70 mt-4 text-center">
            Times are approximate. Please verify with your local mosque.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
