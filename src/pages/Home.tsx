import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import TrustSection from '../components/TrustSection';
import GallerySection from '../components/GallerySection';
import FacilitySection from '../components/FacilitySection';
import ReviewsSection from '../components/ReviewsSection';
import ContactSection from '../components/ContactSection';

export default function Home(props: { setPage?: any }) {
  return (
    <div className="w-full">
      <HeroSection />
      <ServicesSection />
      <TrustSection />
      <GallerySection />
      <FacilitySection />
      <ReviewsSection />
      <ContactSection />
    </div>
  );
}
