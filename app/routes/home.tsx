import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import HomeComponent from "~/components/home_components/HomeComponent";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true); // ⬅️ flag for auth check

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/");
    } else {
      setIsChecking(false); // ✅ allow render only if logged in
    }
  }, [navigate]);

  if (isChecking) {
    // ⏳ Option 1: blank screen
    return null;

    // or Option 2: small loading screen
    // return (
    //   <div className="flex items-center justify-center h-screen text-gray-600">
    //     Checking login...
    //   </div>
    // );
  }

  return <HomeComponent />;
}
