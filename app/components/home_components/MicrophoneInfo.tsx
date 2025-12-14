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

    // Dùng ref để lưu giá trị transcript mới nhất phục vụ cho việc log khi tắt
    // (Vì state trong hàm đóng event listener đôi khi không cập nhật kịp để log)
    const transcriptRef = useRef(""); 
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Trình duyệt không hỗ trợ SpeechRecognition API");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "vi-VN";            
        recognition.continuous = true;         
        recognition.interimResults = false;    

        recognition.onresult = (event: any) => {
            let chunk = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    chunk += event.results[i][0].transcript + " ";
                }
            }

            if (chunk.trim() !== "") {
                // LOG 1: Log ngay đoạn vừa nói xong
                console.log("🦻 Vừa nghe được:", chunk);
                
                setTranscript((prev) => {
                    const newText = prev + chunk;
                    transcriptRef.current = newText; // Cập nhật ref để log sau
                    return newText;
                });
            }
        };

        recognition.onerror = (e: any) => console.error("Speech error:", e);
        recognitionRef.current = recognition;
    }, []);

    const handleToggleRecord = async () => {
        if (recognitionRef.current) {
            if (!isRecording) {
                // --- BẮT ĐẦU ---
                setTranscript(""); 
                transcriptRef.current = "";
                recognitionRef.current.start();
                console.log("🔴 BẮT ĐẦU thu âm...");
            } else {
                // --- KẾT THÚC ---
                recognitionRef.current.stop();
                
                // LOG 2: Log tổng kết toàn bộ nội dung
                console.log("🛑 ĐÃ TẮT MIC. Tổng nội dung thu được:");
                console.log("👉 " + (transcriptRef.current || "Chưa nói gì hoặc chưa nhận diện được"));
            }
        }
        
        const nextState = !isRecording;
        setIsRecording(nextState);

        // Gọi API Toggle
        try {
            // console.log("Gọi API toggle microphone...");
            const res = await fetch(`http://localhost:3000/api/device/statusToggle/microphone`, {
                method: 'POST',
                credentials: "include"
            });
            // if (res.ok) console.log("API Toggle OK");
        } catch (error) {
            console.error('API Error:', error);
        }
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

            {/* Hiển thị text trên giao diện */}
            {transcript && (
                <div className="p-3 bg-gray-100 rounded-lg text-sm max-h-40 overflow-y-auto border border-gray-300">
                    <b className="text-gray-600">Kết quả (Real-time):</b>
                    <p className="mt-1 text-gray-800 font-medium">{transcript}</p>
                </div>
            )}
        </div>
    );
}