"use client";

import {
  TriangleAlert,
  HeartCrack,
  TrendingUp,
  Map,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";

export default function AlertsPanel() {
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader className="justify-start gap-2 text-brand-red">
          <TriangleAlert className="w-4 h-4" />
          <CardTitle className="text-brand-red">URGENT CRITICAL ALERTS</CardTitle>
        </CardHeader>

        <div className="m-3.5 p-3 border border-red-100 bg-red-50 rounded-lg">
          <div className="flex items-start justify-between mb-1.5">
            <div className="font-bold text-[12.5px] flex items-center gap-1.5">
              <HeartCrack className="w-4 h-4 text-brand-red" />
              Cardiac Arrest Risk
            </div>
            <Badge variant="stat">STAT</Badge>
          </div>
          <div className="text-[11.5px] text-[#5a5a5e] leading-relaxed mb-2.5">
            Patient GL-11204 vital sign dropped critically. Red alert triggered
            in Ward 4B.
          </div>
          <Button className="w-full text-[11.5px] font-bold tracking-wide py-2 h-auto rounded-md">
            RESPOND NOW
          </Button>
        </div>

        <div className="m-3.5 p-3 border border-red-100 bg-red-50 rounded-lg">
          <div className="flex items-start justify-between mb-1.5">
            <div className="font-bold text-[12.5px] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-brand-red" />
              Hypertensive Crisis
            </div>
            <Badge variant="priority">PRIORITY</Badge>
          </div>
          <div className="text-[11.5px] text-[#5a5a5e] leading-relaxed">
            Patient GL-88219 arterial line insertion. Doctor R. Vasquez notified.
          </div>
        </div>

        <div className="px-4 sm:px-5 py-3.5 border-t border-surface-border">
          <h4 className="text-[11.5px] uppercase tracking-wide font-semibold text-surface-muted mb-2.5">
            Facility Notes
          </h4>
          <ul className="list-disc pl-4 text-xs leading-loose">
            <li>MRI Scanner 2 undergoing maintenance.</li>
            <li>O-Negative blood supply at 15% threshold.</li>
            <li>Shift change in 37 minutes.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

export function UnitHeatmap() {
  return (
    <div className="bg-sidebar rounded-xl p-4 text-white">
      <h4 className="text-[12.5px] font-semibold mb-0.5">Unit Heatmap</h4>
      <p className="text-[11px] text-[#a5a5a9] mb-3.5">High traffic in Trauma A</p>
      <Button
        variant="outline"
        size="xs"
        className="border-[#4a4a4e] bg-transparent text-white hover:bg-sidebar-hover hover:text-white"
      >
        <Map className="w-3.5 h-3.5" /> Full Map View
      </Button>
    </div>
  );
}
