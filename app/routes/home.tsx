import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to SmartClassroom</h1>
      <p className="mb-6">This is your home screen.</p>
      
      {/* Link to Login */}
      <Link
        to="/login"
        className="bg-indigo-500 text-white px-4 py-2 rounded-md"
      >
        Go to Login
      </Link>
    </div>
  );
}
