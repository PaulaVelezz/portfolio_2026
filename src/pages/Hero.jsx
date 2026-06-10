import HeroSection from "../components/HeroSection";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Hero({ setPage }) {
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#0a0a0c]">
      <HeroSection setPage={setPage} />
      <Testimonials />
      <Footer />
    </div>
  );
}
