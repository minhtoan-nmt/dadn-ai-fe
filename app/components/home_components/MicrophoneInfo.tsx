import { useEffect, useState, useRef } from "react";
import { GrMicrophone } from "react-icons/gr";

export default function MicrophoneInfo() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    
    // 1. Thêm state để lưu kết quả trả về từ API AI
    const [apiResult, setApiResult] = useState<any>(null); 

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
                console.log("🦻 Vừa nghe được:", chunk);
                setTranscript((prev) => {
                    const newText = prev + chunk;
                    transcriptRef.current = newText;
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
                setApiResult(null); // Reset kết quả cũ khi bắt đầu nói mới
                transcriptRef.current = "";
                recognitionRef.current.start();
                console.log("🔴 BẮT ĐẦU thu âm...");
            } else {
                // --- KẾT THÚC ---
                recognitionRef.current.stop();
                console.log("🛑 ĐÃ TẮT MIC.");
                
                const finalContent = transcriptRef.current;
                console.log("Final content ", finalContent);

                // === GỌI API AI COMMAND ===
                if (finalContent && finalContent.trim()) {
                    console.log("Đã thu được và vào if")
                    try {
                        console.log("🚀 Đang gửi text tới AI API:", finalContent);
                        
                        const aiRes = await fetch("http://localhost:3000/api/ai/command", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ text: finalContent }),
                        });

                        // 2. Xử lý dữ liệu trả về
                        if (aiRes.ok) {
                            const data = await aiRes.json();
                            console.log("✅ API AI trả về:", data); // Log ra console (F12)
                            setApiResult(data); // Lưu vào state để hiện lên màn hình
                        } else {
                            console.error("❌ API lỗi:", aiRes.status);
                            setApiResult({ error: `Lỗi API: ${aiRes.status}` });
                        }
                    } catch (error) {
                        console.error("❌ Lỗi kết nối:", error);
                        setApiResult({ error: "Không thể kết nối đến server" });
                    }
                }
            }
        }
        
        setIsRecording(!isRecording);

        // Gọi API Toggle microphone (giữ nguyên)
        try {
            await fetch(`http://localhost:3000/api/device/statusToggle/microphone`, {
                method: 'POST',
                credentials: "include"
            });
        } catch (error) {
            console.error('API Device Toggle Error:', error);
        }
    };

    return (
        <div className="w-xs h-fit bg-white rounded-xl p-3 flex flex-col gap-3">
            <h1 className="text-center font-semibold text-2xl">Microphone</h1>

            <div className="flex justify-center">
                <GrMicrophone
                    size={175}
                    className={
                        "p-5 cursor-pointer rounded-full transition " +
                        (isRecording ? "text-red-500 bg-red-100" : "hover:bg-gray-200")
                    }
                    onClick={handleToggleRecord}
                />
            </div>

            {/* Hiển thị Text người dùng nói */}
            {transcript && (
                <div className="p-3 bg-gray-100 rounded-lg text-sm border border-gray-300">
                    <b className="text-gray-600">Bạn đã nói:</b>
                    <p className="mt-1 text-gray-800">{transcript}</p>
                </div>
            )}

            {/* 3. Hiển thị Kết quả từ API AI (JSON) */}
            {apiResult && (
                <div className="p-3 bg-blue-50 rounded-lg text-sm border border-blue-200 overflow-x-auto">
                    <b className="text-blue-700">Phản hồi từ AI:</b>
                    <pre className="mt-2 text-xs text-blue-900 font-mono whitespace-pre-wrap">
                        {JSON.stringify(apiResult, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}