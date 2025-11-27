import { marketingSite } from "@/lib/config/marketing";
import { ImageResponse } from "next/og";

export const alt = marketingSite.title;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px",
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(circle at 15% 20%, rgba(255, 196, 36, 0.45) 0%, rgba(251, 191, 36, 0.15) 40%, transparent 70%), linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #111827 100%)",
        color: "#f8fafc",
        fontFamily: "Inter, Arial",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <div
          style={{
            height: "72px",
            width: "72px",
            borderRadius: "20px",
            background: "rgba(251, 191, 36, 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "44px",
            fontWeight: 700,
            color: "#fbbf24",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.45)",
          }}
        >
          ⚡️
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {marketingSite.name}
          </span>
          <span
            style={{
              fontSize: "22px",
              opacity: 0.7,
            }}
          >
            {marketingSite.domain}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "960px",
        }}
      >
        <h1
          style={{
            fontSize: "72px",
            lineHeight: 1.05,
            margin: 0,
            letterSpacing: "-0.03em",
            color: "#f8fafc",
            textShadow:
              "0 18px 60px rgba(15, 23, 42, 0.65), 0 2px 14px rgba(251, 191, 36, 0.35)",
          }}
        >
          {marketingSite.title}
        </h1>
        <p
          style={{
            fontSize: "32px",
            lineHeight: 1.4,
            margin: 0,
            color: "rgba(226, 232, 240, 0.94)",
            textShadow: "0 12px 40px rgba(15, 23, 42, 0.55)",
          }}
        >
          {marketingSite.tagline}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {marketingSite.stack.slice(0, 3).map((item) => (
          <div
            key={item}
            style={{
              padding: "12px 20px",
              borderRadius: "9999px",
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(148, 163, 184, 0.45)",
              boxShadow: "0 12px 35px rgba(8, 47, 73, 0.45)",
              fontSize: "22px",
              fontWeight: 600,
              color: "#f8fafc",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>,
    {
      ...size,
    },
  );
}
