import CyberNurdinFooter from '@/components/home/CyberNurdinFooter';
import CyberNurdinNavbar from '@/components/home/CyberNurdinNavbar';
import FeaturedMentorshipPathsSection from '@/components/home/FeaturedMentorshipPathsSection';
import FinalCTASection from '@/components/home/FinalCTASection';
import HeroTrustStrip from '@/components/home/HeroTrustStrip';
import HomeHeroSection from '@/components/home/HomeHeroSection';
import MentorshipProcessSection from '@/components/home/MentorshipProcessSection';
import MentorshipStatsPanel from '@/components/home/MentorshipStatsPanel';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import WhyCyberNurdinSection from '@/components/home/WhyCyberNurdinSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8EF] text-[#061C36]">
      <CyberNurdinNavbar />
      <section className="w-full bg-[#FFF8EF] md:flex md:min-h-[calc(100vh-66px)] md:flex-col md:justify-center">
        <HomeHeroSection />
        <HeroTrustStrip />
      </section>
      <section className="w-full bg-[#FFF8EF] px-6 py-8 sm:px-8 lg:px-16 lg:py-10 2xl:px-20">
        <MentorshipStatsPanel />
        <MentorshipProcessSection />
      </section>
      <FeaturedMentorshipPathsSection />
      <WhyCyberNurdinSection />
      <section className="w-full bg-[#FFF8EF] px-6 py-16 sm:px-8 md:py-20 lg:px-16 2xl:px-20">
        <TestimonialsSection />
        <div className="mt-12">
          <FinalCTASection />
        </div>
      </section>
      <CyberNurdinFooter />
    </main>
  );
}
