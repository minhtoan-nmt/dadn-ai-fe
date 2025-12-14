import { useEffect, useState, useRef } from "react";
import { GrMicrophone } from "react-icons/gr";

export default function MicrophoneInfo() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
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
        if (!recognitionRef.current) return;

        if (!isRecording) {
            // ==========================================
            // TRƯỜNG HỢP 1: MUỐN BẬT MIC
            // ==========================================
            try {
                // Thử khởi động Mic
                recognitionRef.current.start();
                
                // Nếu start thành công thì mới update state và reset biến
                console.log("🔴 BẮT ĐẦU thu âm...");
                setIsRecording(true); 
                setTranscript(""); 
                setApiResult(null); 
                transcriptRef.current = "";
                
            } catch (error) {
                console.warn("⚠️ Mic đang bận hoặc đã được bật từ trước:", error);
                // Nếu lỗi "already started", ta cứ coi như nó đang bật và cập nhật UI thành đang bật
                setIsRecording(true);
            }
        } else {
            // ==========================================
            // TRƯỜNG HỢP 2: MUỐN TẮT MIC
            // ==========================================
            recognitionRef.current.stop();
            console.log("🛑 ĐÃ TẮT MIC. Đang chờ xử lý text cuối cùng...");
            setIsRecording(false); // Cập nhật UI tắt ngay lập tức

            // Chờ 1s để trình duyệt xử lý xong chunk cuối cùng
            setTimeout(async () => {
                const finalContent = transcriptRef.current;
                console.log("📝 Nội dung sau khi chờ:", `"${finalContent}"`);

                if (!finalContent || finalContent.trim() === "") {
                    console.warn("⚠️ Không nghe thấy gì, hủy gửi API.");
                    return;
                }

                try {
                    console.log("🚀 Đang gửi text tới AI API:", finalContent);
                    
                    const aiRes = await fetch("http://localhost:3000/api/ai/command", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ text: finalContent }),
                    });

                    if (aiRes.ok) {
                        const data = await aiRes.json();
                        console.log("✅ API AI trả về:", data);
                        setApiResult(data);

                        // BẮN SỰ KIỆN ĐỂ CẬP NHẬT UI
                        if (data.label) {
                            console.log("📢 Dispatching event:", data.label);
                            const event = new CustomEvent("ai-command-completed", { 
                                detail: { label: data.label } 
                            });
                            window.dispatchEvent(event);
                        }
                    } else {
                        console.error("❌ API lỗi:", aiRes.status);
                        setApiResult({ error: `Lỗi API: ${aiRes.status}` });
                    }
                } catch (error) {
                    console.error("❌ Lỗi kết nối:", error);
                    setApiResult({ error: "Không thể kết nối đến server" });
                }
            }, 1000); 
        }

        // Gọi API Toggle microphone (giữ nguyên logic backend của bạn)
        try {
            await fetch(`http://localhost:3000/api/device/statusToggle/microphone`, {
                method: 'POST',
                credentials: "include"
            });
        } catch (error) {}
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

            {transcript && (
                <div className="p-3 bg-gray-100 rounded-lg text-sm border border-gray-300">
                    <b className="text-gray-600">Bạn đã nói:</b>
                    <p className="mt-1 text-gray-800">{transcript}</p>
                </div>
            )}

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