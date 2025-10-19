import { IoMdArrowDropdown } from "react-icons/io";
import type { ContentProp } from "../home_components/Content";
import HistoryTable from "./history_table";

export default function HistoryContent({className = ""}: ContentProp) {
    const mockData = [
        { time: "17/09/2025 14:42:30", action: "Smart Fan", trigger: "Turn on Smart Fan (Level 3)" },
        { time: "17/09/2025 14:42:31", action: "Smart Fan", trigger: 'Execute command on "smartfan_service" successfully' },
        { time: "17/09/2025 14:42:32", action: "Smart Fan", trigger: "Change Smart Fan Level (Level 2)" },
        { time: "17/09/2025 16:28:19", action: "Smart Fan", trigger: "Turn off Smart Fan" },
        { time: "17/09/2025 16:28:21", action: "Smart Light", trigger: "Turn on Smart Light (Level 3)" },
        { time: "17/09/2025 16:28:22", action: "Smart Light", trigger: 'Execute command on "smartlight_service" successfully' },
        { time: "17/09/2025 16:28:25", action: "Smart Light", trigger: "Turn off Smart Light (Level 3)" },
        ];
    return (<div className={className}>
        <div className="w-full rounded-xl bg-white p-5">
            {/* <h1 className="font-bold text-2xl">History</h1>
            <p className="my-10 flex flex-row items-center gap-x-3">
                Show 
                <span className="bg-gray-300 p-2 rounded-xl flex flex-row w-fit items-center">7 <IoMdArrowDropdown /></span> 
                entries
            </p> */}
            {/* History Table */}
            <HistoryTable data={mockData} />
        </div>
        
    </div>)
}