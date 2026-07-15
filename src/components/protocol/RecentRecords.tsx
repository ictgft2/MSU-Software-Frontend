"use client";

import { useEffect, useState } from "react";
import { FileSpreadsheet, ArrowUpRight, FileText } from "lucide-react";
import { toast } from "react-toastify";
import type { Encounter } from "@src/dto/encounter";
import encountersService from "@src/services/encounters.service";
import { getApiErrorMessage } from "@src/utils/api-error";

export default function RecentRecords() {
  const [records, setRecords] = useState<Encounter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [queued, pharmacy, discharged] = await Promise.all([
          encountersService.listByStatus("Queued").catch(() => []),
          encountersService.listByStatus("PharmacyPending").catch(() => []),
          encountersService.listByStatus("Discharged").catch(() => []),
        ]);
        if (!active) return;
        setRecords([...(queued || []), ...(pharmacy || []), ...(discharged || [])].slice(0, 10));
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Unable to load encounters"));
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      <div className="bg-[#2D3134] text-white p-3.5 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <FileSpreadsheet size={16} />
          <span>Recent Encounters</span>
        </div>
        <button className="text-[10px] font-bold tracking-wider uppercase text-gray-300 hover:text-white flex items-center gap-1">
          View All <ArrowUpRight size={12} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#1A1C1E] text-gray-400 font-bold text-[10px] uppercase tracking-wider">
              <th className="p-3 pl-4">Encounter</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Complaint</th>
              <th className="p-3">Status</th>
              <th className="p-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={5} className="p-4 text-gray-400">
                  Loading encounters...
                </td>
              </tr>
            )}
            {!isLoading && records.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-gray-400">
                  No encounters found.
                </td>
              </tr>
            )}
            {records.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/60">
                <td className="p-3 pl-4 font-mono text-gray-500 font-semibold">
                  {item.id.slice(0, 8)}
                </td>
                <td className="p-3 font-bold text-gray-800">
                  {item.patientName || item.fullName || item.patientId || "—"}
                </td>
                <td className="p-3 text-gray-600">
                  {item.chiefComplaint || "—"}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-sm text-[9px] font-extrabold tracking-wide bg-amber-50 text-amber-700 border border-amber-200">
                    {item.status || "UNKNOWN"}
                  </span>
                </td>
                <td className="p-3 pr-4 text-right">
                  <button className="text-gray-400 hover:text-gray-700 p-1 inline-flex">
                    <FileText size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
