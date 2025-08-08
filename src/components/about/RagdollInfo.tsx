import { motion } from 'framer-motion';

const RagdollInfo = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="font-playfair text-3xl font-semibold text-foreground mb-4"
            >
              Да поговорим за котките Рагдол
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Красиви, интелигентни и любящи – с огромни сини очи и копринена козина. Известни са с непринудения си характер и спокойствие, когато бъдат вдигнати – като парцалена кукла.
            </motion.p>
          </div>

          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm"
            >
              <h4 className="font-semibold text-lg mb-2">Произход</h4>
              <p className="text-muted-foreground">
                Страна на произход: Америка. Първите котенца са родени в Калифорния през 60-те години. Вероятно са резултат от чифтосване между бяла персийска котка и бирман.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm"
            >
              <h4 className="font-semibold text-lg mb-2">Характер</h4>
              <p className="text-muted-foreground">
                Нежни, спокойни и предани. Лесно се адаптират и са отлични семейни любимци. Не са имунизирани срещу болка – просто са доверчиви и уравновесени.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm"
            >
              <h4 className="font-semibold text-lg mb-2">Външен вид</h4>
              <p className="text-muted-foreground">
                Големи и мощни, с широки гърди, къс врат и дълга пухкава опашка. Козината е копринена, средна до дълга, често с „риза“ и „панталони“ при възрастните.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm"
            >
              <h4 className="font-semibold text-lg mb-2">Модели и цветове</h4>
              <p className="text-muted-foreground">
                Три основни модела на окраска, всеки в няколко цвята. Срещат се и варианти с ръкавици и допълнителни бели петна.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RagdollInfo;



