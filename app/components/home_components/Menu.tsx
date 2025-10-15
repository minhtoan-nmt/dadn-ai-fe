// app/components/home_components/Menu.tsx
import { AiFillHome } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { GrPieChart } from "react-icons/gr";
import { RiHistoryLine } from "react-icons/ri";
import { Link, useLocation } from "react-router"; // or "react-router-dom"

type MenuProps = { className?: string };

export default function Menu({ className = "" }: MenuProps) {
  const location = useLocation();

  // store icon components (not elements) so we can change classes depending on active state
  const menuList = [
    { Icon: AiFillHome, buttonText: "Home", linkTo: "/" },
    { Icon: GrPieChart, buttonText: "Dashboard", linkTo: "/dashboard" },
    { Icon: RiHistoryLine, buttonText: "History", linkTo: "/history" },
    { Icon: BiLogOut, buttonText: "Logout", linkTo: "/login" }
  ];

  return (
    <div className={`flex flex-col ${className}`}>
      {menuList.map((item) => {
        const isActive =
          location.pathname === item.linkTo ||
          (item.linkTo !== "/" && location.pathname.startsWith(item.linkTo));

        const Icon = item.Icon;
        return (
          <Link to={item.linkTo} key={item.buttonText} className="no-underline">
            <div
              className={`flex items-center gap-4 px-6 py-4 rounded-lg transition-all
                ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              {/* Icon: stays black when active; slightly darker when hovered */}
              <Icon className={`${isActive ? "text-black" : "text-gray-700"} w-7 h-7`} />

              {/* Label: bold when active, black color */}
              <span className={`text-xl ${isActive ? "font-bold text-black" : "text-black"}`}>
                {item.buttonText}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
