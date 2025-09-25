import { AiFillHome } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { GrPieChart } from "react-icons/gr";
import { RiHistoryLine } from "react-icons/ri";
import { Link } from "react-router";

type MenuProps = { className: string};

export default function Menu({className = ""} : MenuProps) {
    const selectedItem: string = "Home";
    const menuList = [
        {icon: <AiFillHome className="size-8"/>, buttonText: "Home", linkTo: "/"},
        {icon: <GrPieChart className="size-8"/>, buttonText: "Dashboard", linkTo: "/"},
        {icon: <RiHistoryLine className="size-8"/>, buttonText: "History", linkTo: "/"},
        {icon: <BiLogOut className="size-8"/>, buttonText: "Logout", linkTo: "/login"}
    ]
    return (<div>
        {menuList.map((item) => {
            return (<Link to={item.linkTo} key={item.buttonText} className={className}>
                <div className="flex flex-row items-center p-6 gap-10">
                    {item.icon}
                    <p className={"text-2xl " + (selectedItem === item.buttonText ? "font-bold" : "")}>{item.buttonText}</p>
                </div>
            </Link>);
        })}
    </div>)
}