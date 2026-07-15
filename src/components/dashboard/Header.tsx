"use client";

import { RefreshCw, Download } from "lucide-react";
import { PageHeader } from "@src/components/ui/page-header";
import { Button } from "@src/components/ui/button";

export default function DashboardHeader() {
  return (
    <PageHeader
      title="Facility Command Overview"
      description="Real-time status tracking for Medical Unit Head · Last updated: 14:22:08"
      actions={
        <>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Grid
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="w-3.5 h-3.5" />
            Export Log
          </Button>
        </>
      }
    />
  );
}
