import { AiFillHome } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { GrPieChart } from "react-icons/gr";
import { RiHistoryLine } from "react-icons/ri";

type MenuProps = { className: string};

export default function Menu({className = ""} : MenuProps) {
    const selectedItem: string = "Home";
    const menuList = [
        {icon: <AiFillHome className="size-8"/>, buttonText: "Home"},
        {icon: <GrPieChart className="size-8"/>, buttonText: "Dashboard"},
        {icon: <RiHistoryLine className="size-8"/>, buttonText: "History"},
        {icon: <BiLogOut className="size-8"/>, buttonText: "Logout"}
    ]
    return (<div>
        {menuList.map((item) => {
            return (<div key={item.buttonText} className={className}>
                <div className="flex flex-row items-center p-6 gap-10">
                    {item.icon}
                    <p className={"text-2xl " + (selectedItem === item.buttonText ? "font-bold" : "")}>{item.buttonText}</p>
                </div>
            </div>);
        })}
    </div>)
}