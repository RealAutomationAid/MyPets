import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-modern-beige">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm text-muted-foreground tracking-wide uppercase mb-2">
            contact us
          </p>
          <h2 className="font-playfair text-4xl lg:text-5xl font-light text-modern-dark">
            Get in Touch
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="text-center md:text-left">
              <h3 className="font-playfair text-2xl font-semibold text-modern-dark mb-4">
                Свържете се с нас
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                За повече информация за нашите прекрасни рагдол котки и условията за закупуване.
              </p>
            </div>

            <Card className="bg-white shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-modern-beige rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-modern-dark" fill="currentColor" viewBox="0 0 20 20"
                         style={{color: 'hsl(var(--modern-dark))'}}>
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-modern-dark font-medium">Email</h4>
                    <p className="text-muted-foreground text-sm">info@ragdollbleuroi.eu</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-modern-beige rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-modern-dark" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-modern-dark font-medium">Телефон</h4>
                    <p className="text-muted-foreground text-sm">
                      <a 
                        href="tel:+359894474966" 
                        className="hover:text-modern-dark transition-colors hover:underline"
                      >
                        +359894 474 966
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-modern-beige rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-modern-dark" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-modern-dark font-medium">Локация</h4>
                    <p className="text-muted-foreground text-sm">София, България</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-white shadow-card border-0">
            <CardContent className="p-8">
              <h3 className="font-playfair text-2xl font-semibold text-modern-dark mb-6">
                Изпратете запитване
              </h3>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-modern-dark text-sm font-medium mb-2">
                    Име
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-modern-beige/30 border border-border rounded-xl text-modern-dark placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-modern-dark focus:border-transparent transition-all"
                    placeholder="Вашето име"
                  />
                </div>
                
                <div>
                  <label className="block text-modern-dark text-sm font-medium mb-2">
                    Email
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-modern-beige/30 border border-border rounded-xl text-modern-dark placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-modern-dark focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-modern-dark text-sm font-medium mb-2">
                    Съобщение
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 bg-modern-beige/30 border border-border rounded-xl text-modern-dark placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-modern-dark focus:border-transparent resize-none transition-all"
                    placeholder="Как можем да ви помогнем?"
                  ></textarea>
                </div>
                
                <Button variant="modern" size="lg" className="w-full">
                  Изпратете съобщение
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;