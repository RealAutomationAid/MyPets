import { motion } from 'framer-motion';

const AboutHero = () => {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-b from-primary/5 to-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            За нас
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            BleuRoi Ragdoll Cattery
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Ние сме лицензиран развъдник, регистриран към FIFe и WCF. Предлагаме невероятни котенца Рагдол с родословия, европейски паспорт, 2 ваксини и чип. Лиценз 47090/2024.
          </motion.p>
        </div>
      </div>

      {/* Decorative lines */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-4">
        <div className="w-12 h-px bg-muted-foreground/30"></div>
        <div className="w-2 h-2 rounded-full bg-muted-foreground/50"></div>
        <div className="w-12 h-px bg-muted-foreground/30"></div>
      </div>
    </section>
  );
};

export default AboutHero;



