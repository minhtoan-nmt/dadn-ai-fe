import React, { useState } from "react";

interface HistoryItem {
  time: string;
  action: string;
  trigger: string;
}

interface HistoryTableProps {
  data: HistoryItem[];
  entriesPerPage?: number;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ data, entriesPerPage = 7 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentData = data.slice(startIndex, startIndex + entriesPerPage);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
      <h2 className="text-2xl font-semibold mb-4">History</h2>

      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600">
          Show{" "}
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={entriesPerPage}
            onChange={() => {}}
            disabled
          >
            <option>{entriesPerPage}</option>
          </select>{" "}
          entries
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 font-medium text-gray-700 w-1/6">Time</th>
              <th className="px-4 py-2 font-medium text-gray-700 w-1/6">Action</th>
              <th className="px-4 py-2 font-medium text-gray-700">Trigger</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={index}
                className="odd:bg-gray-50 even:bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <td className="px-4 py-2">{item.time}</td>
                <td className="px-4 py-2">{item.action}</td>
                <td className="px-4 py-2">{item.trigger}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-1 mt-4 text-sm">
        <button
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === idx + 1
                ? "bg-gray-800 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HistoryTable;
