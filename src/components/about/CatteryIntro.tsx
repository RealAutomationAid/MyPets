import { motion } from 'framer-motion';

const CatteryIntro = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="font-playfair text-3xl font-semibold text-foreground">
              За BleuRoi
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ние сме Лицензиран развъдник BleuRoi Ragdol Cattery предлага невероятни котенца Рагдоли с родословия, европейски паспорд, 2 ваксини и чип. Постоянно имаме малки красиви котки. Ако искате да имате част от семейството – една от най-красивите и най-галовните котки на света – мястото е тук. Котенцата са с резервация и ще са готови за новото семейство.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Родителите на нашите котенца произхождат от Европа и Русия. Предлагаме котенца за домашни любимци (кастрирани и некастрирани), изложбени такива и селектирани за лицензирана развъдна дейност. Без забрана за продажба в ЕС. Организираме транспорт за цялата страна. Лиценз 47090/2024. Регистрирани сме в FIFe и WCF. Участваме на изложби и родителите са шампиони с високи оценки.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl border border-border/50">
              <img
                src="/hero-image.jpg"
                alt="BleuRoi Ragdoll Cattery"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card/90 rounded-xl p-4 shadow-lg backdrop-blur-sm border border-border/50">
              <p className="text-sm text-muted-foreground">
                Свържете се с нас за повече снимки и информация
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CatteryIntro;












