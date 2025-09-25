import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import HomeComponent from "~/components/home_components/HomeComponent";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <HomeComponent />;
}
