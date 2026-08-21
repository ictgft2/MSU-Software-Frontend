"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Activity, Hourglass, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";
import type { QueueEntry, QueuePosition, ServiceWindow } from "@src/dto/operations";
import operationsService from "@src/services/operations.service";
import encountersService from "@src/services/encounters.service";
import { getApiErrorMessage } from "@src/utils/api-error";
import { isServiceWindowOpen } from "@src/utils/service-window";

function entryId(item: QueueEntry) {
  return item.encounterId || item.id || "";
}

function displayName(item: QueueEntry) {
  return item.patientName || item.fullName || `Encounter ${entryId(item)}`;
}

function isEmergencyEntry(item: QueueEntry) {
  return String(item.admissionType || "")
    .toLowerCase()
    .includes("emergency");
}

export default function WaitlistTerminal() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [position, setPosition] = useState<QueuePosition | null>(null);
  const [windowInfo, setWindowInfo] = useState<ServiceWindow | null>(null);

  const loadQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      const [data, currentWindow] = await Promise.all([
        operationsService.getQueue().catch(() => []),
        operationsService.getServiceWindow().catch(() => null),
      ]);
      const rows = Array.isArray(data) ? data : [];
      setQueue(rows.filter((item) => !isEmergencyEntry(item)));
      setWindowInfo(currentWindow);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load queue"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue]);

  useEffect(() => {
    if (!selectedId) {
      setPosition(null);
      return;
    }
    let active = true;
    operationsService
      .getQueuePosition(selectedId)
      .then((data) => {
        if (active) setPosition(data);
      })
      .catch(() => {
        if (active) setPosition(null);
      });
    return () => {
      active = false;
    };
  }, [selectedId]);

  const windowOpen = isServiceWindowOpen(windowInfo);

  const handleSendToConsultation = async (item: QueueEntry) => {
    const id = entryId(item);
    if (!id) return;
    if (!windowOpen) {
      toast.error("Cold-case consultation window is closed.");
      return;
    }
    try {
      await encountersService.updateStatus(id, { status: "InConsultation" });
      setQueue((prev) => prev.filter((row) => entryId(row) !== id));
      if (selectedId === id) setSelectedId("");
      toast.success(`${displayName(item)} moved to consultation`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update encounter status"));
    }
  };

  const handleLeaveQueue = async (item: QueueEntry) => {
    const id = entryId(item);
    if (!id) return;
    try {
      await operationsService.leaveQueue(id);
      setQueue((prev) => prev.filter((row) => entryId(row) !== id));
      if (selectedId === id) setSelectedId("");
      toast.success(`${displayName(item)} removed from queue`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to remove from queue"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Cold-case queue
            </h3>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">
              Emergencies skip this waitlist
            </p>
          </div>
          <span className="bg-[#B71C1C] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wider">
            {queue.length} WAITING
          </span>
        </div>

        <div className="p-4 space-y-5">
          <div
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border ${
              windowOpen
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {windowOpen ? "Consult window open" : "Consult window closed"}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <Activity size={12} />
              <span>Waiting for doctor ({queue.length})</span>
            </div>

            {isLoading && <p className="text-xs text-gray-400">Loading queue...</p>}
            {!isLoading && queue.length === 0 && (
              <p className="text-xs text-gray-400">No cold-case patients in queue.</p>
            )}

            {queue.map((item) => {
              const id = entryId(item);
              const isSelected = selectedId === id;
              return (
                <div
                  key={id}
                  className="bg-white border border-gray-200 p-2.5 rounded-sm space-y-2"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(isSelected ? "" : id)}
                    className="w-full text-left"
                  >
                    <h4 className="text-xs font-bold text-gray-900">{displayName(item)}</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      {item.position != null
                        ? `Position #${item.position}`
                        : `Encounter ${id.slice(0, 8)}`}
                      {item.estimatedWaitMinutes != null
                        ? ` · ~${item.estimatedWaitMinutes} min`
                        : ""}
                    </p>
                    {isSelected && position && (
                      <p className="text-[10px] text-gray-600 mt-1">
                        Live position #{position.position ?? "—"}
                        {position.estimatedWaitMinutes != null
                          ? ` · ~${position.estimatedWaitMinutes} min`
                          : ""}
                      </p>
                    )}
                  </button>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => void handleLeaveQueue(item)}
                      className="rounded-sm tracking-wide uppercase text-[10px] font-bold border border-gray-300 hover:bg-gray-50 text-gray-700 px-2.5 py-1"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      disabled={!windowOpen}
                      onClick={() => void handleSendToConsultation(item)}
                      className="rounded-sm tracking-wide uppercase text-[10px] font-bold bg-[#5A5A5A] hover:bg-black text-white px-2.5 py-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Consult
                    </button>
                  </div>
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
                Cold cases only. Consult is blocked when the service window is closed.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
