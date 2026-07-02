'use client';

import { Quote, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    quote: 'CyberNurdin gave me the structure I needed to stop learning randomly and start following a clear cybersecurity path.',
    name: 'David O.',
    role: 'SOC Analyst Path Mentee',
    avatar: 'DO',
  },
  {
    quote: 'The mentorship approach helped me understand what to focus on and how to grow with confidence.',
    name: 'Sarah A.',
    role: 'Network Security Mentee',
    avatar: 'SA',
  },
  {
    quote: 'The guided projects and feedback made the learning experience feel practical and serious.',
    name: 'Michael T.',
    role: 'Beginner Cybersecurity Learner',
    avatar: 'MT',
  },
  {
    quote: 'I finally understood how cybersecurity topics connect because the path was clear and guided.',
    name: 'Amina K.',
    role: 'Introduction to Cybersecurity Mentee',
    avatar: 'AK',
  },
  {
    quote: 'The sessions, projects, and feedback helped me stay consistent and improve week by week.',
    name: 'Daniel E.',
    role: 'Web Security Mentee',
    avatar: 'DE',
  },
  {
    quote: 'Instead of jumping between random videos, I followed one path and knew exactly what to do next.',
    name: 'Grace N.',
    role: 'Cloud Security Mentee',
    avatar: 'GN',
  },
  {
    quote: 'The SOC path helped me understand alerts, logs, and investigation steps in a practical way.',
    name: 'Samuel B.',
    role: 'SOC Analyst Path Mentee',
    avatar: 'SB',
  },
  {
    quote: 'CyberNurdin made cybersecurity feel less confusing and more achievable.',
    name: 'Joyce M.',
    role: 'Beginner Cybersecurity Mentee',
    avatar: 'JM',
  },
  {
    quote: 'The mentorship gave me direction, accountability, and confidence to keep learning.',
    name: 'Kelvin A.',
    role: 'Network Security Mentee',
    avatar: 'KA',
  },
];

function getCardsPerSlide() {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function chunkTestimonials(cardsPerSlide: number) {
  const slides: Testimonial[][] = [];
  for (let index = 0; index < testimonials.length; index += cardsPerSlide) {
    slides.push(testimonials.slice(index, index + cardsPerSlide));
  }
  return slides;
}

export default function TestimonialsSection() {
  const [cardsPerSlide, setCardsPerSlide] = useState(3);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const syncCardsPerSlide = () => setCardsPerSlide(getCardsPerSlide());
    syncCardsPerSlide();
    window.addEventListener('resize', syncCardsPerSlide);
    return () => window.removeEventListener('resize', syncCardsPerSlide);
  }, []);

  const slides = useMemo(() => chunkTestimonials(cardsPerSlide), [cardsPerSlide]);
  const currentSlide = slides[Math.min(activeSlide, slides.length - 1)] || slides[0] || [];

  useEffect(() => {
    setActiveSlide((value) => Math.min(value, slides.length - 1));
  }, [slides.length]);

  return (
    <div className="w-full">
      <h2 className="mb-8 text-center text-[24px] font-black uppercase tracking-wide text-[#061C36] md:text-[30px]">
        What Our Mentees Say
      </h2>

      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {currentSlide.map((testimonial) => (
          <article
            key={testimonial.name}
            className="flex min-h-[250px] flex-col rounded-2xl border border-[#061C36]/12 bg-white px-7 py-6 shadow-[0_12px_28px_rgba(6,28,54,0.04)]"
          >
            <Quote size={22} className="mb-3 text-[#0B3D77]" fill="currentColor" />
            <p className="text-sm font-semibold leading-6 text-[#061C36]">
              &quot;{testimonial.quote}&quot;
            </p>
            <div className="mt-auto flex items-center gap-3 pt-5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#0B3D77] text-sm font-black text-white">
                {testimonial.avatar}
              </div>
              <div>
                <h3 className="text-sm font-black text-[#061C36]">{testimonial.name}</h3>
                <p className="text-xs font-semibold text-[#061C36]/70">{testimonial.role}</p>
                <div className="mt-1 flex gap-0.5 text-[#F95738]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={13} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveSlide(index)}
            className={`h-2.5 rounded-full transition ${
              activeSlide === index ? 'w-8 bg-[#F95738]' : 'w-2.5 bg-[#061C36]/18'
            }`}
            aria-label={`Show testimonial slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
