import { motion } from 'framer-motion';

const BreedHistory = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-transparent to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="font-playfair text-3xl font-semibold text-foreground mb-6"
          >
            История на породата
          </motion.h3>

          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Породата произхожда от Калифорния и е известна със своя спокоен и отпуснат начин на живот. Всичко започва през 60-те години на миналия век, когато местен развъдчик на име Ан Бейкър решава да кръстоса своята бяла дългокосместа домашна котка Джозефин със сийл пойнт мъжки и изцяло черна котка. Интересното е, че всички животни преди това са били бездомни.
            </p>
            <p>
              Полученото потомство било толкова послушно, че г-жа Бейкър решава да развие порода. Поради начина, по който се отпускали, когато ги вдигала, тя решава да нарече тази нова порода „рагдол“ (парцалена кукла).
            </p>
            <p>
              Днес котката Рагдол е сред най-популярните породи в света. Според CFA тя е най-популярната порода за 2020 г., за втора поредна година печелейки титлата „Топ котка“.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BreedHistory;



