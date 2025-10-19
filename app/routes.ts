import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), // /
  route("login", "routes/login.tsx"), // /login
  route("register", "routes/register.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("history", "routes/history.tsx"),
] satisfies RouteConfig;
