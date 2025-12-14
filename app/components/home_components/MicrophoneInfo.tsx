import { useEffect, useState, useRef } from "react";
import { GrMicrophone } from "react-icons/gr";

export default function MicrophoneInfo() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");

    const transcriptRef = useRef("");
    const recognitionRef = useRef<any>(null);

    // Ref này dùng để chặn việc gửi API khi không phải do người dùng chủ động tắt
    // (Tuỳ chọn, nhưng tốt cho UX)
    const isManualStopRef = useRef(false);

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
                console.log("🦻 Vừa nghe được:", chunk);
                setTranscript((prev) => {
                    const newText = prev + chunk;
                    transcriptRef.current = newText; 
                    return newText;
                });
            }
        };

        // --- QUAN TRỌNG: Xử lý gửi API tại đây ---
        // Sự kiện onend chạy khi mic đã tắt hẳn và dữ liệu đã chốt xong
        recognition.onend = async () => {
            setIsRecording(false); // Đảm bảo icon tắt
            console.log("🛑 Microphone đã tắt hoàn toàn (onend triggered).");

            const finalContent = transcriptRef.current.trim();
            
            // Chỉ gửi nếu có nội dung và (tuỳ chọn) do người dùng bấm tắt
            if (finalContent && isManualStopRef.current) {
                console.log("🚀 Đang gửi nội dung:", finalContent);
                try {
                    const res = await fetch(`http://localhost:3000/api/voicecontrol`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: "include",
                        body: JSON.stringify({ 
                            text: finalContent 
                        })
                    });
                    
                    if (res.ok) console.log("✅ Gửi API thành công!");
                } catch (error) {
                    console.error('API Error:', error);
                }
            } else {
                console.log("⚠️ Không gửi API (Do không có nội dung hoặc mic tự tắt)");
            }
            
            // Reset cờ manual stop
            isManualStopRef.current = false;
        };

        recognition.onerror = (e: any) => {
            console.error("Speech error:", e);
            setIsRecording(false);
        };
        
        recognitionRef.current = recognition;
    }, []);

    const handleToggleRecord = () => {
        if (!recognitionRef.current) return;

        if (!isRecording) {
            // --- BẮT ĐẦU ---
            setTranscript("");
            transcriptRef.current = "";
            recognitionRef.current.start();
            setIsRecording(true);
            console.log("🔴 BẮT ĐẦU thu âm...");
        } else {
            // --- KẾT THÚC ---
            // Đánh dấu là người dùng chủ động tắt
            isManualStopRef.current = true;
            recognitionRef.current.stop();
            // KHÔNG gửi API ở đây nữa. Để onend lo.
            console.log("⏳ Đã bấm tắt, đợi xử lý...");
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

            {transcript && (
                <div className="p-3 bg-gray-100 rounded-lg text-sm max-h-40 overflow-y-auto border border-gray-300">
                    <b className="text-gray-600">Kết quả:</b>
                    <p className="mt-1 text-gray-800 font-medium">{transcript}</p>
                </div>
            )}
        </div>
    );
}