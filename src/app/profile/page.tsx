import Header from "@/components/Header/Header";
import ProfilePageClient from "@/components/ProfilePage/ProfilePageClient";

export default function Profile() {
  return (
    <>
      <Header isAuthenticated userName="Сергей" hideTagline />
      <ProfilePageClient />
    </>
  );
}

