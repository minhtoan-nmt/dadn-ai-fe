// import { useEffect, useState } from "react";
// import { GrMicrophone } from "react-icons/gr";

// export default function MicrophoneInfo() {
//     const [powerMode, setPowerMode] = useState(false);
//     useEffect(() => {
//         const getMicInfo = async () => {
//             try {
//                 const res = await fetch(`http://localhost:3000/api/device/getInfoDevice/microphone`, {
//                     method: 'GET',
//                     credentials: "include"
//                 });
//                 if (!res.ok)
//                     throw new Error(`${res.status}`);
//                 const data = await res.json();
//                 setPowerMode(data.isActive);
//             } catch (error) {
//                 console.error(error);
//             }    
//         }
//         getMicInfo();
//     }, [])
//     return (<div className="w-xs h-fit bg-white rounded-xl p-3 ">
//         <h1 className="text-center font-semibold text-2xl">Microphone</h1>
//         <div className="flex justify-center">
//             <GrMicrophone size={175} className={"p-5 cursor-pointer hover:bg-gray-200 rounded-full m-5 " + (powerMode && "text-blue-400")}
//                 onClick={async () => {
//                     setPowerMode(!powerMode);
//                     try {
//                         const data = await fetch(`http://localhost:3000/api/device/statusToggle/microphone`, {
//                             method: 'POST',
//                             credentials: "include"
//                         });
//                     } catch (error) {
//                         console.error('Error: ', error);
//                     }
//                 }}
//             />
//         </div>
//     </div>)
// }

import { useEffect, useState, useRef } from "react";
import { GrMicrophone } from "react-icons/gr";

export default function MicrophoneInfo() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");

    const recognitionRef = useRef(null);

    useEffect(() => {
        // SpeechRecognition init
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Trình duyệt không hỗ trợ SpeechRecognition API");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "vi-VN";            // tiếng Việt
        recognition.continuous = true;         // thu liên tục
        recognition.interimResults = false;    // chỉ lấy kết quả cuối

        recognition.onresult = (event) => {
            let text = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    text += event.results[i][0].transcript + " ";
                }
            }
            setTranscript((prev) => prev + text);
        };

        recognition.onerror = (e) => console.error("Speech error:", e);

        recognitionRef.current = recognition;
    }, []);

    const handleToggleRecord = () => {
        if (!recognitionRef.current) return;

        if (!isRecording) {
            // Start record
            setTranscript(""); // reset text
            recognitionRef.current.start();
            console.log("🔴 Bắt đầu thu âm...");
        } else {
            // Stop record
            recognitionRef.current.stop();
            console.log("🟢 Dừng thu âm. Kết quả:", transcript);
        }
        setIsRecording(!isRecording);
    };

    return (
        <div className="w-xs h-fit bg-white rounded-xl p-3">
            <h1 className="text-center font-semibold text-2xl">Microphone</h1>

            <div className="flex justify-center">
                <GrMicrophone
                    size={175}
                    className={
                        "p-5 cursor-pointer rounded-full m-5 transition " +
                        (isRecording ? "text-red-500 bg-red-100" : "hover:bg-gray-200")
                    }
                    onClick={handleToggleRecord}
                />
            </div>

            {/* Hiển thị text sau ghi âm */}
            {transcript && (
                <div className="p-3 bg-gray-100 rounded-lg text-sm">
                    <b>Kết quả thu âm:</b>
                    <p>{transcript}</p>
                </div>
            )}
        </div>
    );
}
