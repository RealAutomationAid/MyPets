import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, MessageCircle } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

interface HeroSectionProps {
  onContactClick?: () => void;
}

export default function HeroSection({ onContactClick }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Get active hero images from database
  const heroImages = useQuery(api.heroImages.getActiveHeroImages) || []

  useEffect(() => {
    setIsLoaded(true)

    const handleMouseMove = (e: MouseEvent) => {}

    window.addEventListener("mousemove", () => {})
    return () => window.removeEventListener("mousemove", () => {})
  }, [])

  // Fallback images for when no hero images are uploaded
  const fallbackImages = [
    {
      src: "/featured-cat-1.jpg",
      alt: "Ragdoll Cat 1",
      className: "cat-image-1",
      delay: "0s",
    },
    {
      src: "/featured-cat-2.jpg",
      alt: "Ragdoll Kitten 1",
      className: "cat-image-2",
      delay: "0.2s",
    },
    {
      src: "/model-cat-1.jpg",
      alt: "Ragdoll Cat 2",
      className: "cat-image-3",
      delay: "0.4s",
    },
    {
      src: "/model-cat-2.jpg",
      alt: "Ragdoll Kittens",
      className: "cat-image-4",
      delay: "0.6s",
    },
    {
      src: "/model-cat-3.jpg",
      alt: "Ragdoll Family",
      className: "cat-image-5",
      delay: "0.8s",
    },
    {
      src: "/featured-cat-1.jpg",
      alt: "Elegant Ragdoll",
      className: "cat-image-6",
      delay: "1s",
    },
  ]

  // Convert hero images from database to the format expected by the component
  const catImages = heroImages.length > 0 
    ? heroImages.slice(0, 6).map((image, index) => ({
        src: image.src,
        alt: image.alt,
        className: `cat-image-${index + 1}`,
        delay: `${index * 0.2}s`,
      }))
    : fallbackImages

  const scrollToModels = () => {
    const modelsSection = document.getElementById('models');
    if (modelsSection) {
      modelsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div
          className="absolute w-[520px] h-[520px] bg-ragdoll-blue/10 rounded-full blur-2xl animate-slow-float-1"
          style={{
            left: "10%",
            top: "20%",
            animationDelay: "0s",
          }}
        />
        <div
          className="absolute w-[390px] h-[390px] bg-ragdoll-lavender/8 rounded-full blur-2xl animate-slow-float-2"
          style={{
            right: "15%",
            bottom: "25%",
            animationDelay: "8s",
          }}
        />
        <div
          className="absolute w-[650px] h-[650px] bg-ragdoll-cream/5 rounded-full blur-2xl animate-slow-float-3"
          style={{
            left: "50%",
            bottom: "10%",
            animationDelay: "15s",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div
            className={`space-y-8 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-ragdoll-blue/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-ragdoll-blue/30">
                <Heart className="w-4 h-4 text-white" />
                Сертифициран Развъдник
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight font-playfair">
                BleuRoi
                <span className="block text-transparent bg-gradient-to-r from-ragdoll-blue to-ragdoll-lavender bg-clip-text">
                  Ragdoll
                </span>
                <span className="block text-3xl md:text-4xl font-light text-white/90">Развъдник</span>
              </h1>

              <p className="text-xl text-white/80 max-w-lg leading-relaxed">
                Най-добрите сертифицирани Рагдол котки в България. Нашите котки са известни с кротък темперамент,
                поразителни сини очи и луксозна полудълга козина.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={scrollToModels}
                className="bg-ragdoll-blue hover:bg-ragdoll-blue/90 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-ragdoll-blue/25"
              >
                Разгледай Котенца
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onContactClick}
                className="border-white/40 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 bg-transparent backdrop-blur-sm"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Контакт
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">6+</div>
                <div className="text-sm text-white/70">Години Опит</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-white/70">Щастливи Семейства</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ragdoll-lavender">5★</div>
                <div className="text-sm text-white/70">Рейтинг</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Collage */}
          <div className="relative h-[600px] lg:h-[700px]">
            {/* Central Logo */}
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
              style={{ animationDelay: "0.5s" }}
            >
              <div className="w-56 h-56 bg-white rounded-full p-2 shadow-2xl hover:scale-110 transition-transform duration-300 border-4 border-ragdoll-blue/50 overflow-hidden">
                <img
                  src="/hero-image.jpg"
                  alt="BleuRoi Ragdoll Hero Image"
                  className="w-full h-full object-cover rounded-full animate-float"
                />
              </div>
            </div>

            {/* Floating Cat Images */}
            {catImages.map((image, index) => (
              <div
                key={index}
                className={`absolute ${image.className} transition-all duration-1000 hover:scale-110 hover:z-30 cursor-pointer ${isLoaded ? "opacity-100" : "opacity-0"}`}
                style={{
                  animationDelay: image.delay,
                }}
              >
                <div className="bg-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 w-62 h-62 flex items-center justify-center border-3 border-ragdoll-blue/30">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="rounded-full object-cover w-52 h-52"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cat paw particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-20 animate-paw-fall text-ragdoll-cream"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 6}s`,
            }}
          >
            🐾
          </div>
        ))}
      </div>
    </section>
  )
}
