import { Hero } from "@/components/home/hero";
import { TestimonialsMarquee } from "@/components/home/testimonials-marquee";
import { testimonials } from "@/lib/config/testimonials";

export default function MarketingHome() {
  return (
    <>
      <Hero />
      <TestimonialsMarquee testimonials={testimonials} />
    </>
  );
}
