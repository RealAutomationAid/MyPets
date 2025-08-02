import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-luxury-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-luxury-brown mb-6">
            За нас
          </h2>
          <p className="text-xl text-luxury-dark-brown max-w-3xl mx-auto leading-relaxed">
            Пасионирани развъдници на рагдол котки с дългогодишен опит и безкрайна любов към породата
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="font-playfair text-3xl font-semibold text-luxury-brown mb-4">
              Нашата история
            </h3>
            <p className="text-lg text-foreground leading-relaxed">
              Ragdoll Radanov Pride е създаден през 2018 година от истинска любов към 
              нежната и добродушна порода рагдол. Започнахме пътешествието си с желанието да 
              отглеждаме здрави, красиви и добре социализирани котки с отлични родословни.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Нашият развъдник е регистриран и работи в съответствие с най-високите стандарти 
              за качество и грижа. Всяка котка от нашия развъдник получава индивидуално внимание, 
              професионални ветеринарни грижи и израства в любящо семейство.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="shadow-elegant">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-luxury-gold mb-2">15+</div>
                <div className="text-foreground">Родословни котки</div>
              </CardContent>
            </Card>
            <Card className="shadow-elegant">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-luxury-gold mb-2">50+</div>
                <div className="text-foreground">Щастливи семейства</div>
              </CardContent>
            </Card>
            <Card className="shadow-elegant">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-luxury-gold mb-2">5+</div>
                <div className="text-foreground">Години опит</div>
              </CardContent>
            </Card>
            <Card className="shadow-elegant">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-luxury-gold mb-2">100%</div>
                <div className="text-foreground">Здрави котки</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 bg-card rounded-2xl p-8 shadow-luxury">
          <h3 className="font-playfair text-2xl font-semibold text-luxury-brown mb-6 text-center">
            Нашата философия
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-luxury-brown" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-2">Любов и грижа</h4>
              <p className="text-muted-foreground">Всяка котка израства в любяща семейна среда</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-luxury-brown" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-2">Качество</h4>
              <p className="text-muted-foreground">Най-високи стандарти за здраве и родословие</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-luxury-brown" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-2">Прозрачност</h4>
              <p className="text-muted-foreground">Пълна информация за здравето и произхода</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;