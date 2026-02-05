import React from "react";
import { Download } from "lucide-react";

export const HistoryPanel = ({ history = [], onExportCSV = null }) => {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Lịch sử quay</h3>
        {onExportCSV && (
          <button
            onClick={() => onExportCSV && onExportCSV()}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-600 text-white text-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-sm text-gray-500">Chưa có lịch sử quay</div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-auto custom-scrollbar">
          {history
            .slice()
            .reverse()
            .map((h, idx) => (
              <div key={idx} className="p-2 rounded-md bg-gray-50 border">
                <div className="text-sm font-semibold">{h.user.name}</div>
                <div className="text-xs text-gray-600">
                  Giải: {h.prize.name || h.prize.description}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(h.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
