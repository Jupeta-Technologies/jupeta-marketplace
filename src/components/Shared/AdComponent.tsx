import React from "react";

interface AdComponentProps {
  image: string;
  link?: string;
  tag?: string;
  alt?: string;
  style?: React.CSSProperties;
}

const AdComponent: React.FC<AdComponentProps> = ({ image, link, tag = "Ad", alt = "Advertisement", style }) => {
  const adContent = (
    <div style={{ position: "relative", width: "100%", ...style }}>
      <img
        src={image}
        alt={alt}
        style={{ width: "100%", height: "auto", borderRadius: 0, objectFit: "cover" }}
      />
      <span
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "#ffe066",
          color: "#a67c00",
          fontWeight: 600,
          fontSize: "0.85rem",
          borderRadius: "6px",
          padding: "2px 10px",
          zIndex: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {tag}
      </span>
    </div>
  );

  return link ? (
    <a href={link} style={{ display: "block", width: "100%" }}>
      {adContent}
    </a>
  ) : (
    adContent
  );
};

export default AdComponent;
