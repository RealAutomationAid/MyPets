"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import RagdollImage from "./RagdollImage";
import { Eye, Heart, Share2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

type GalleryCard = {
  id: number | string;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
  title?: string;
  description?: string;
};

interface InteractiveGalleryProps {
  cards: GalleryCard[];
  className?: string;
}

export const InteractiveGallery = ({ cards, className }: InteractiveGalleryProps) => {
  const [hoveredCard, setHoveredCard] = useState<GalleryCard | null>(null);
  const [selectedCard, setSelectedCard] = useState<GalleryCard | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mouse tracking for particle effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Particle system
  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    }> = [];

    const resizeCanvas = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.offsetWidth;
        canvas.height = containerRef.current.offsetHeight;
      }
    };

    const createParticle = (x: number, y: number) => {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 60,
        maxLife: 60,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha * 0.5;
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    // Create particles on mouse movement
    const interval = setInterval(() => {
      if (hoveredCard && particles.length < 50) {
        createParticle(mousePosition.x, mousePosition.y);
      }
    }, 100);

    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [hoveredCard, mousePosition]);

  const handleCardClick = (card: GalleryCard) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  const getNextCard = () => {
    if (!selectedCard) return null;
    const currentIndex = cards.findIndex(card => card.id === selectedCard.id);
    return cards[(currentIndex + 1) % cards.length];
  };

  const getPrevCard = () => {
    if (!selectedCard) return null;
    const currentIndex = cards.findIndex(card => card.id === selectedCard.id);
    return cards[(currentIndex - 1 + cards.length) % cards.length];
  };

  return (
    <>
      <div 
        ref={containerRef}
        className={cn("relative w-full min-h-[600px] overflow-hidden", className)}
      >
        {/* Particle canvas */}
        <canvas
          ref={particlesRef}
          className="absolute inset-0 pointer-events-none z-10"
        />

        {/* Grid background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" 
            style={{
              backgroundImage: `
                linear-gradient(to right, #000 1px, transparent 1px),
                linear-gradient(to bottom, #000 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* Main gallery grid */}
        <div className="relative z-20 w-full h-full p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {cards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={isVisible ? { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  rotateY: hoveredCard?.id === card.id ? 5 : 0
                } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl cursor-pointer",
                  "bg-white/10 backdrop-blur-sm border border-white/20",
                  "hover:border-white/40 transition-all duration-500",
                  card.className
                )}
                style={{
                  aspectRatio: "4/5"
                }}
                onMouseEnter={() => setHoveredCard(card)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleCardClick(card)}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Image */}
                <RagdollImage
                  src={card.thumbnail}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Gallery image"
                  fallbackSrc="/placeholder.svg"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Floating action buttons */}
                <motion.div
                  className="absolute top-4 right-4 flex gap-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: hoveredCard?.id === card.id ? 1 : 0, y: hoveredCard?.id === card.id ? 0 : -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button size="sm" variant="secondary" className="rounded-full w-8 h-8 p-0 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="rounded-full w-8 h-8 p-0 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </motion.div>

                {/* Content overlay */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-4 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: hoveredCard?.id === card.id ? 1 : 0, 
                    y: hoveredCard?.id === card.id ? 0 : 20 
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {card.content}
                </motion.div>

                {/* View button */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: hoveredCard?.id === card.id ? 1 : 0,
                    scale: hoveredCard?.id === card.id ? 1 : 0.5
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Button className="rounded-full bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 text-white">
                    <Eye className="w-4 h-4 mr-2" />
                    Виж
                  </Button>
                </motion.div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for full image view */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] w-full mx-4"
              initial={{ scale: 0.5, opacity: 0, rotateY: -30 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: 30 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <Button
                className="absolute top-4 right-4 z-10 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                size="sm"
                onClick={closeModal}
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Navigation buttons */}
              <Button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                size="sm"
                onClick={() => setSelectedCard(getPrevCard())}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                size="sm"
                onClick={() => setSelectedCard(getNextCard())}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              {/* Image */}
              <RagdollImage
                src={selectedCard.thumbnail}
                className="w-full h-full object-contain rounded-2xl"
                alt="Full size image"
                fallbackSrc="/placeholder.svg"
              />

              {/* Content overlay */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {selectedCard.content}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};