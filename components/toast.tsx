"use client";

import React, { useEffect, useState } from "react";

type Toast = { id: string; type: "success" | "error" | "info"; message: string };

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: any) => {
      const detail = e?.detail ?? {};
      const id = String(Date.now()) + Math.random().toString(36).slice(2, 6);
      const toast: Toast = {
        id,
        type: detail.type ?? "info",
        message: detail.message ?? "",
      };
      setToasts((t) => [...t, toast]);
      // auto remove
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 4500);
    };

    window.addEventListener("app:toast", handler);
    return () => window.removeEventListener("app:toast", handler);
  }, []);

  const remove = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <div className="fixed right-4 top-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`max-w-sm w-full p-3 rounded shadow-lg border ${t.type === "success" ? "bg-green-50 border-green-200" : t.type === "error" ? "bg-red-50 border-red-200" : "bg-sky-50 border-sky-200"}`}>
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm">{t.message}</div>
            <button onClick={() => remove(t.id)} className="text-xs opacity-60 hover:opacity-100 ml-2">×</button>
          </div>
        </div>
      ))}
    </div>
  );
}
