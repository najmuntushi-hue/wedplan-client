import Hero from "@/components/home/Hero";
import FeaturedServices from "@/components/home/FeaturedServices";
import Categories from "@/components/home/Categories";
import WhyChoose from "@/components/home/WhyChoose";
import HowItWorks from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <Categories />
      <WhyChoose />
      <HowItWorks />
    </>
  );
}