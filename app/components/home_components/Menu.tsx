// app/components/home_components/Menu.tsx
import {
  AiFillHome,
  AiOutlineHome,
  AiOutlinePieChart,
  AiFillPieChart,
} from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { RiHistoryLine, RiHistoryFill } from "react-icons/ri";
import { NavLink } from "react-router"; // <-- Importing from the core package

type MenuProps = { className?: string };

export default function Menu({ className = "" }: MenuProps) {
  const menuList = [
    {
      Icon: AiOutlineHome,
      ActiveIcon: AiFillHome,
      buttonText: "Home",
      linkTo: "/",
    },
    {
      Icon: AiOutlinePieChart,
      ActiveIcon: AiFillPieChart,
      buttonText: "Dashboard",
      linkTo: "/dashboard",
    },
    {
      Icon: RiHistoryLine,
      ActiveIcon: RiHistoryFill,
      buttonText: "History",
      linkTo: "/history",
    },
    {
      Icon: BiLogOut,
      ActiveIcon: BiLogOut,
      buttonText: "Logout",
      linkTo: "/login",
    },
  ];

  return (
    <div className={`flex flex-col ${className}`}>
      {menuList.map((item) => (
        <NavLink
          to={item.linkTo}
          key={item.buttonText}
          className={({ isActive }) =>
            `flex items-center gap-4 px-6 py-4 rounded-lg transition-all no-underline
            ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`
          }
        >
          {({ isActive }) => {
            const Icon = isActive ? item.ActiveIcon : item.Icon;
            return (
              <>
                <Icon
                  className={`${
                    isActive ? "text-black" : "text-gray-700"
                  } w-7 h-7`}
                />
                <span
                  className={`text-xl ${
                    isActive ? "font-bold text-black" : "text-black"
                  }`}
                >
                  {item.buttonText}
                </span>
              </>
            );
          }}
        </NavLink>
      ))}
    </div>
  );
}