import { TestimonialsMarquee } from "@/components/home/testimonials-marquee";
import { testimonials } from "@/lib/config/testimonials";

export default function MarketingHome() {
  return (
    <>
      {/*  */}
      <section className="bg-primary/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold">
            Hello from Firebase Auth + Realtime DB Starter
          </h1>
        </div>
      </section>
      <TestimonialsMarquee testimonials={testimonials} />
    </>
  );
}
