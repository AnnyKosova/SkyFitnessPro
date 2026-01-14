import Header from "@/components/Header/Header";
import HeroSection from "@/components/HeroSection/HeroSection";
import CoursesSection from "@/components/CoursesSection/CoursesSection";

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
