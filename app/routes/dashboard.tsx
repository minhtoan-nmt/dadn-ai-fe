import Navbar from "../components/Navbar";
import Content from "./dashboard_content";
import Menu from "../components/home_components/Menu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function HomeComponent() {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true); // ⬅️ flag for auth check

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
        navigate("/");
        } else {
        setIsChecking(false); // ✅ allow render only if logged in
        }
    }, [navigate]);

    if (isChecking) {
        // ⏳ Option 1: blank screen
        return null;

        // or Option 2: small loading screen
        // return (
        //   <div className="flex items-center justify-center h-screen text-gray-600">
        //     Checking login...
        //   </div>
        // );
    }
    return (<>
        <Navbar />
        <div className="bg-white text-black flex flex-row min-h-screen">
            <Menu className="w-3xs flex-1"/>
            <Content className="flex-6 bg-gray-200 px-20 py-10"/>
        </div>
    </>)
}