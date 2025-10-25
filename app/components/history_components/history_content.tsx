import { IoMdArrowDropdown } from "react-icons/io";
import type { ContentProp } from "../home_components/Content";
import HistoryTable from "./HistoryTable";

export type DataProp = {time: Date, action: String, trigger: String}[];

export default function HistoryContent({className = ""}: ContentProp) {
    const mockData: DataProp = [
        { time: new Date(2025, 10, 10, 8, 30, 23, 434), action: "Smart Fan", trigger: "Turn on Smart Fan (Level 3)" },
        { time: new Date(2025, 10, 10, 8, 30, 23, 434), action: "Smart Fan", trigger: 'Execute command on "smartfan_service" successfully' },
        { time: new Date(2025, 10, 10, 8, 30, 23, 434), action: "Smart Fan", trigger: "Change Smart Fan Level (Level 2)" },
        { time: new Date(2025, 10, 10, 8, 30, 23, 434), action: "Smart Fan", trigger: "Turn off Smart Fan" },
        { time: new Date(2025, 10, 10, 8, 30, 23, 434), action: "Smart Light", trigger: "Turn on Smart Light (Level 3)" },
        { time: new Date(2025, 10, 10, 8, 30, 23, 434), action: "Smart Light", trigger: 'Execute command on "smartlight_service" successfully' },
        { time: new Date(2025, 10, 10, 8, 30, 23, 434), action: "Smart Light", trigger: "Turn off Smart Light (Level 3)" },
        ];
    return (<div className={className}>
        <div className="w-full rounded-xl bg-white p-10">
            <h1 className="font-bold text-2xl px-3">History</h1>
            <p className="my-10 flex flex-row items-center gap-x-3 px-5">
                Show 
                <span className="bg-gray-300 p-2 rounded-xl flex flex-row w-fit items-center">7 <IoMdArrowDropdown /></span> 
                entries
            </p>
            <HistoryTable data={mockData}/>
        </div>
        
    </div>)
}