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
      <section className="flex w-full items-center bg-[#FFF8EF] py-14 md:min-h-screen md:py-16">
        <MentorshipStatsPanel />
      </section>
      <MentorshipProcessSection />
      <FeaturedMentorshipPathsSection />
      <WhyCyberNurdinSection />
      <TestimonialsSection />
      <FinalCTASection />
      <CyberNurdinFooter />
    </main>
  );
}
