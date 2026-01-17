import Header from "@/components/Header/Header";
import ProfilePage from "@/components/ProfilePage/ProfilePage";

export default function Profile() {
  return (
    <>
      <Header isAuthenticated userName="Сергей" hideTagline />
      <ProfilePage />
    </>
  );
}
