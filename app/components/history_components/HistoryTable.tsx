import type { DataProp } from "./history_content";

type HistoryProp = {data: DataProp}

export default function HistoryTable({data}: HistoryProp) {
    return (<table className="w-full table-fixed">
        <tr>
            <th className="w-1/6 p-6">Time</th>
            <th className="w-1/3 p-6">Action</th>
            <th className="w-1/2 p-6">Trigger</th>
        </tr>
        {data.map(row => <tr className="bg-[#F7F6FE]">
            <td className="w-1/6 p-6">{row.time.toLocaleString()}</td>
            <td className="w-1/3 p-6">{row.action}</td>
            <td className="w-1/3 p-6">{row.trigger}</td>
        </tr>)}
    </table>)
}