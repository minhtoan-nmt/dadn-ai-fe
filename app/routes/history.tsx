import HistoryContent from "~/components/history_components/history_content";
import Menu from "~/components/home_components/Menu";
import Navbar from "~/components/Navbar";

export default function History() {
    return (<>
    <Navbar />
            <div className="bg-white text-black flex flex-row min-h-screen">
                <Menu className="w-3xs flex-1"/>
                <HistoryContent className="flex-6 bg-gray-200 px-20 py-10"/>
            </div>
    </>)
}