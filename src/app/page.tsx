import CoursesSection from "@/components/CoursesSection/CoursesSection";
import Header from "@/components/Header/Header";
import HeroSection from "@/components/HeroSection/HeroSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CoursesSection />
      </main>
    </>
  );
}
