import Header from "@/components/Header/Header";
import WorkoutPage from "@/components/WorkoutPage/WorkoutPage";

export default function WorkoutVideoPage() {
  return (
    <>
      <Header isAuthenticated userName="Сергей" hideTagline />
      <WorkoutPage />
    </>
  );
}

