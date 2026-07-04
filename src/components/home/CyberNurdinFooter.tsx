import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import CyberNurdinLogo from '@/components/shared/CyberNurdinLogo';
import { YOUTUBE_CHANNEL_URL } from '@/lib/cybernurdin-data';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Plans', href: '/plans' },
  { label: 'Courses', href: '/courses' },
];

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Login', href: '/login' },
];

const socials = [
  { label: 'f', name: 'Facebook', href: 'https://facebook.com/cybernurdin' },
  { label: 'x', name: 'X (Twitter)', href: 'https://x.com/cybernurdin' },
  { label: 'in', name: 'LinkedIn', href: 'https://linkedin.com/company/cybernurdin' },
  { label: 'yt', name: 'YouTube', href: YOUTUBE_CHANNEL_URL },
  { label: 'ig', name: 'Instagram', href: 'https://instagram.com/cybernurdin' },
];

export default function CyberNurdinFooter() {
  return (
    <footer className="w-full bg-[#FFF8EF]">
      <div className="w-full px-6 pb-8 sm:px-8 lg:px-16 2xl:px-20">
        <div className="overflow-hidden rounded-lg bg-[#061C36] text-white shadow-[0_18px_36px_rgba(6,28,54,0.15)]">
          <div className="grid gap-9 px-8 py-7 md:grid-cols-[1.4fr_1fr_1fr_1.45fr]">
            <div>
              <Link href="/" aria-label="CyberNurdin home">
                <CyberNurdinLogo size="md" variant="light" />
              </Link>
              <p className="mt-4 max-w-[250px] text-sm font-medium leading-6 text-white/76">
                Cybersecurity mentorship for serious learners ready to build real-world skills.
              </p>
              <div className="mt-5 flex gap-4 text-white">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`CyberNurdin on ${social.name}`}
                    className="text-white/86 hover:text-[#F95738]"
                  >
                    <span className="grid h-4 min-w-4 place-items-center text-xs font-black">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-base font-black">Quick Links</h3>
              <div className="flex flex-col gap-3">
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm font-medium text-white/78 hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-base font-black">Company</h3>
              <div className="flex flex-col gap-3">
                {companyLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm font-medium text-white/78 hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-base font-black">Get In Touch</h3>
              <div className="space-y-3 text-sm font-medium text-white/82">
                <p className="flex items-center gap-3">
                  <Mail size={17} />
                  hello@cybernurdin.com
                </p>
                <p className="flex items-center gap-3">
                  <Phone size={17} />
                  +234 803 123 4567
                </p>
                <p className="flex items-center gap-3">
                  <MapPin size={17} />
                  Lagos, Nigeria
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 py-4 text-center text-sm font-medium text-white/82">
            &copy; 2026 CyberNurdin. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
