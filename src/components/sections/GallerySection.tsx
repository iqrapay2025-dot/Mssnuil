import { motion } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function GallerySection() {
  const galleryImages = [
    "https://scontent.flos3-1.fna.fbcdn.net/v/t1.6435-9/130722071_138631088021959_5496328107723187387_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=3a1ebe&_nc_ohc=mNnsgpckcucQ7kNvwE_jZBh&_nc_oc=AdloKFGO_GG8GyjcME46bKmKntdaIZLrBDWMY1tVP8s-LNYgeZhD7hqI4Ev_byRE4dg&_nc_zt=23&_nc_ht=scontent.flos3-1.fna&_nc_gid=oLIk1PvVRXV9r1HjoxN88Q&oh=00_Affl63Xj4M0AhFyWMBfkI_wtJPe7z2JfDljQzTfDktN5fA&oe=692B1D3B",
    "https://images.unsplash.com/photo-1758573644043-d3e1be7e0ce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc2xhbWljJTIwY29tbXVuaXR5JTIwZ2F0aGVyaW5nfGVufDF8fHx8MTc2MTI5MjE3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://i.pinimg.com/1200x/9d/3b/73/9d3b73712c925cde6c124df409fd77d5.jpg",
    "https://images.unsplash.com/photo-1631148902202-a7aa5d651445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNsaW0lMjBzdHVkZW50cyUyMHN0dWR5aW5nfGVufDF8fHx8MTc2MTI5MjE3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://i.pinimg.com/736x/a1/f0/18/a1f018fa0e77768eb478443d510e5c3f.jpg",
    "https://scontent.flos2-2.fna.fbcdn.net/v/t1.6435-9/130878032_138631081355293_6549566011963363477_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=3a1ebe&_nc_ohc=pvI4xmvzmYsQ7kNvwGd2nqv&_nc_oc=AdmXiZg1lv8_b1N7TseuN9Qn1NrqW5U03r1wqjeAqhB3gQukeqqNda6eluw0PuE-KAk&_nc_zt=23&_nc_ht=scontent.flos2-2.fna&_nc_gid=07QYjFrOG2_Deus-9GDswQ&oh=00_AfehCsM4uZUYYQYQLyS5EHxA8wtUxe7EOhiyg4rT96COVA&oe=692B3C2D"
  ];

  return (
    <section id="gallery" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-emerald-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-600 tracking-wider uppercase text-sm">Memories</span>
          <h2 className="text-4xl md:text-5xl text-gray-900 mt-4">Gallery</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto mt-6"></div>
          <p className="text-lg text-gray-600 mt-6">A reflection of our faith, unity, and service.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((src, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <ImageWithFallback
                src={src}
                alt={`Gallery Image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
