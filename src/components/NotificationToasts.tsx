"use client";
import React from "react";
import { useNotification } from "@/context/NotificationContext";

const NotificationToasts: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div style={{
      position: "fixed",
      top: 20,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      minWidth: 320,
      maxWidth: 400,
    }}>
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            background: "#fff",
            borderRadius: 32,
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            padding: 8,
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderLeft: `5px solid ${getColor(n.type)}`,
            position: "relative",
          }}
        >
          {n.icon && <span>{n.icon}</span>}
          {n.image && (
            <img src={n.image} alt="notification" style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }} />
          )}
          <div style={{ flex: 1 ,textAlign:"center"}}>
            {n.title && <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>{n.title}</div>}
            <div style={{ fontSize: 12 }}>{n.message}</div>
          </div>
          <button
            onClick={() => removeNotification(n.id)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#888", position: "absolute", top: 8, right: 8 }}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

function getColor(type?: string) {
  switch (type) {
    case "success": return "#22c55e";
    case "error": return "#ef4444";
    case "info": return "#3b82f6";
    case "warning": return "#f59e42";
    default: return "#818cf8";
  }
}

export default NotificationToasts;
