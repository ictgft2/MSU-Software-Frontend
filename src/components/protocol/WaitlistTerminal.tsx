"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Activity, Hourglass, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";
import type { QueueEntry } from "@src/dto/operations";
import operationsService from "@src/services/operations.service";
import encountersService from "@src/services/encounters.service";
import { getApiErrorMessage } from "@src/utils/api-error";

function entryId(item: QueueEntry) {
  return item.encounterId || item.id || "";
}

function displayName(item: QueueEntry) {
  return item.patientName || item.fullName || `Encounter ${entryId(item)}`;
}

export default function WaitlistTerminal() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await operationsService.getQueue();
      setQueue(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load queue"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue]);

  const handleSendToConsultation = async (item: QueueEntry) => {
    const id = entryId(item);
    if (!id) return;
    try {
      await encountersService.updateStatus(id, { status: "InConsultation" });
      setQueue((prev) => prev.filter((row) => entryId(row) !== id));
      toast.success(`${displayName(item)} moved to consultation`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update encounter status"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Live Queue
            </h3>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">
              GET /api/v1/queue
            </p>
          </div>
          <span className="bg-[#B71C1C] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wider">
            {queue.length} ACTIVE
          </span>
        </div>

        <div className="p-4 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <Activity size={12} />
              <span>Waiting Encounters ({queue.length})</span>
            </div>

            {isLoading && <p className="text-xs text-gray-400">Loading queue...</p>}
            {!isLoading && queue.length === 0 && (
              <p className="text-xs text-gray-400">No patients in queue.</p>
            )}

            {queue.map((item) => {
              const id = entryId(item);
              const isEmergency = String(item.admissionType || "")
                .toLowerCase()
                .includes("emergency");
              return (
                <div
                  key={id}
                  className={`bg-white border p-2.5 rounded-sm flex justify-between items-center ${
                    isEmergency
                      ? "border-y border-r border-l-4 border-l-[#C62828]"
                      : "border-gray-200"
                  }`}
                >
                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        isEmergency ? "text-[#C62828]" : "text-gray-900"
                      }`}
                    >
                      {displayName(item)}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      {item.position != null
                        ? `Position #${item.position}`
                        : `Encounter ${id.slice(0, 8)}`}
                      {item.estimatedWaitMinutes != null
                        ? ` · ~${item.estimatedWaitMinutes} min`
                        : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleSendToConsultation(item)}
                    className="rounded-sm tracking-wide uppercase text-[10px] font-bold bg-[#5A5A5A] hover:bg-black text-white px-2.5 py-1"
                  >
                    Consult
                  </button>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <Hourglass size={12} />
              <span>Controls</span>
            </div>
            <button
              type="button"
              onClick={() => void loadQueue()}
              className="w-full text-[10px] font-bold uppercase tracking-wide border border-gray-200 rounded-sm py-2 hover:bg-gray-50"
            >
              Sync Queue
            </button>
            <div className="flex items-start gap-2 text-[10px] text-gray-400 leading-relaxed">
              <ShieldAlert size={12} className="mt-0.5 shrink-0" />
              <span>
                Consult moves the encounter to InConsultation via PATCH
                /encounters/:id/status.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
