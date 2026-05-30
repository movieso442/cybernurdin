import { Quote, Star } from 'lucide-react';

const testimonials = [
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
];

export default function TestimonialsSection() {
  return (
    <section className="w-full bg-[#FFF8EF]">
      <div className="w-full px-6 py-3 sm:px-8 lg:px-16 2xl:px-20">
        <h2 className="mb-3 text-center text-[21px] font-black uppercase tracking-wide text-[#061C36]">
          What Our Mentees Say
        </h2>
        <div className="grid gap-7 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-lg border border-[#061C36]/12 bg-white px-7 py-5 shadow-[0_12px_28px_rgba(6,28,54,0.04)]"
            >
              <Quote size={20} className="mb-2 text-[#0B3D77]" fill="currentColor" />
              <p className="min-h-[72px] text-sm font-semibold leading-5 text-[#061C36]">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#0B3D77] text-sm font-black text-white">
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
        <div className="mt-3 flex justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#F95738]" />
          <span className="h-2 w-2 rounded-full bg-[#061C36]/18" />
          <span className="h-2 w-2 rounded-full bg-[#061C36]/18" />
          <span className="h-2 w-2 rounded-full bg-[#061C36]/18" />
        </div>
      </div>
    </section>
  );
}
