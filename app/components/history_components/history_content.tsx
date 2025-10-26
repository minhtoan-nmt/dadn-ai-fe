// history_content.tsx

import { useState, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import type { ContentProp } from "../home_components/Content";
import HistoryTable from "./HistoryTable";
import Pagination from "./Pagination";

// 1. Định nghĩa kiểu dữ liệu cho một hàng action từ API
type ActionFromAPI = {
    _id: string;
    time: string; // API trả về string, không phải Date
    action: string;
    trigger: string;
};

// 2. Đây là kiểu prop mà HistoryTable sẽ nhận
export type DataProp = ActionFromAPI[];

export default function HistoryContent({ className = "" }: ContentProp) {
    // --- State Management ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [actions, setActions] = useState<DataProp>([]); // State để lưu data từ API
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true); // Bắt đầu tải
            setError(null);
            
            try {
                // 3. Gọi API với page hiện tại và đính kèm credentials
                const response = await fetch(
                    `http://localhost:3000/api/actionHistory?page=${currentPage}`,
                    { credentials: 'include' }
                );

                if (!response.ok) {
                    throw new Error(`API request failed: ${response.statusText}`);
                }

                const data: { totalPages: number, actions: DataProp } = await response.json();
                console.log(data);
                // Kiểm tra data cơ bản
                if (!data.actions || typeof data.totalPages !== 'number') {
                    throw new Error("Invalid data format from API response.");
                }
                console.log(`Fetched page ${currentPage}, number of rows: ${data.actions.length}`);
                // 4. Cập nhật state với dữ liệu từ API
                setActions(data.actions);
                setTotalPages(data.totalPages);

            } catch (e) {
                const error = e as Error;
                setError(error.message || "An unknown error occurred.");
                // Reset state nếu có lỗi
                setActions([]);
                setTotalPages(1);
            } finally {
                setIsLoading(false); // Kết thúc tải
            }
        };

        fetchHistory();
    }, [currentPage]); // Hook này sẽ chạy lại mỗi khi `currentPage` thay đổi

    // Hàm để Pagination component gọi khi đổi trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

return (
        <div className={`${className} flex flex-col`}>
            
            {/* 1. THÊM 'text-gray-900' VÀO ĐÂY */}
            <div className="w-full rounded-xl bg-white p-10 flex-1 min-h-0 overflow-y-auto text-gray-900">
                
                <h1 className="font-bold text-2xl px-3">History</h1>
                <div className="my-6" />

                {isLoading ? (
                    <div className="p-10 text-center text-gray-500">Loading history...</div>
                ) : error ? (
                    <div className="p-10 text-center text-red-600">
                        <strong>Error:</strong> {error}
                    </div>
                ) : (
                    <>
                        {/* 2. Bảng này sẽ kế thừa màu chữ 'text-gray-900' */}
                        <HistoryTable data={actions} />
                        <div className="mt-6 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}