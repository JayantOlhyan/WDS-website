"use client";

import React from "react";
import { FolderArchive, Download } from "lucide-react";
import { AssetItem } from "@/lib/hub/types";

interface AssetViewProps {
  assets: AssetItem[];
}

export function AssetView({ assets }: AssetViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ WDS ASSET DRIVE</h1>
          <p className="text-xs text-wds-muted mt-0.5">
            Verified official logos, brand graphics, posters, and design documentation.
          </p>
        </div>
        <div className="px-3 py-1.5 border border-wds-yellow/30 bg-wds-card text-xs text-wds-yellow font-mono">
          REPOSITORY FILES: {assets.length}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="p-4 border-2 border-wds-yellow/50 bg-wds-card space-y-3">
            <div className="flex items-center justify-between">
              <FolderArchive className="w-6 h-6 text-wds-yellow" />
              <span className="font-pixel text-[9px] px-1.5 py-0.5 bg-wds-yellow/10 border border-wds-yellow/40 text-wds-yellow">
                {asset.format}
              </span>
            </div>
            <div>
              <div className="font-bold text-xs text-wds-white truncate">{asset.name}</div>
              <div className="text-[10px] text-wds-muted mt-0.5">
                {asset.category} • {asset.size}
              </div>
            </div>
            <div className="pt-2 border-t border-wds-yellow/20 flex justify-between items-center text-xs">
              <span className="text-[10px] text-wds-muted">Updated: {asset.updated}</span>
              <a
                href="/images/wds-logo.png"
                download
                className="text-wds-yellow hover:underline flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3 h-3" />
                DOWNLOAD
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
