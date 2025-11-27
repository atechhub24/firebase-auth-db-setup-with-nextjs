import { Hero } from "@/components/home/hero";
import { TestimonialsMarquee } from "@/components/home/testimonials-marquee";
import { BentoGallery } from "@/components/home/bento-gallery";
import { testimonials } from "@/lib/config/testimonials";
import { galleryItems, galleryConfig } from "@/lib/config/gallery";

export default function MarketingHome() {
  return (
    <>
      <Hero />
      <BentoGallery
        imageItems={galleryItems}
        title={galleryConfig.title}
        description={galleryConfig.description}
      />
      <TestimonialsMarquee testimonials={testimonials} />
    </>
  );
}
