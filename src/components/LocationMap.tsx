import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";

const LocationMap = () => {
  const { t } = useLanguage();
  const address = t("footer.address");
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <section aria-label="Location" className="bg-background">
      <div className="container mx-auto px-6 lg:px-8 py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="font-playfair text-2xl sm:text-3xl font-semibold text-foreground">
            {t('locationMap.title', 'Може да ни намерите на адрес')}
          </h2>
          <p className="text-muted-foreground mt-2">{address}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-border/50 shadow-xl"
        >
          <iframe
            src={embedSrc}
            title="Google Map"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[320px] sm:h-[380px] lg:h-[460px]"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default LocationMap;


