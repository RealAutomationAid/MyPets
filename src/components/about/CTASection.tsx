import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-primary/10 via-transparent to-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="font-playfair text-3xl font-semibold text-foreground mb-4"
          >
            Готови ли сте да добавите нов любимец към семейството?
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground mb-8"
          >
            Свържете се с нас за налични котенца, условия за резервация и транспорт в цялата страна.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-3"
          >
            <Button size="lg" className="min-h-[44px]" onClick={() => navigate('/')}>Виж началото</Button>
            <a href="tel:+359894474966">
              <Button variant="outline" size="lg" className="min-h-[44px]">Обади се</Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;


