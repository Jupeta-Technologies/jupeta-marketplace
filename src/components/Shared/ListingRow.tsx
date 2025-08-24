import React from "react";
import styles from "./ListingRow.module.css";
import SimpleItemCard from "@/components/Shared/SimpleItemCard";
import { Product } from "@/types/api";
import ItemCard from "../card/ItemCard";

interface ListingRowProps {
  heading: string;
  tag: "sponsored" | "featured"|"";
  items: Product[];
  viewMoreLink?: string;
}

const ListingRow: React.FC<ListingRowProps> = ({ heading, tag, items, viewMoreLink }) => {
  return (
    <div className="listing-row-container" style={{ padding: "1rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h2 style={{ fontWeight: 600, fontSize: "1.5rem", margin: 0 }}>{heading}</h2>
          <span
            style={{
              fontSize: "0.85rem",
              background: tag === "sponsored" ? "#ffe066" : tag === "featured" ?"#cce5ff": "none",
              color: tag === "sponsored" ? "#a67c00" : "#0056b3",
              fontWeight: 500,
              borderRadius: "6px",
              padding: "2px 8px",
              marginLeft: "2px",
            }}
          >
            {tag === "sponsored" ? "Sponsored" : tag == "featured"?"Featured":""}
          </span>
        </div>
        
      </div>
      <div style={{ position: "relative" }}>
        <button
          type="button"
          aria-label="Scroll left"
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            background: "rgba(255,255,255,0.8)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            cursor: "pointer",
            display: items.length > 3 ? "block" : "none"
          }}
          onClick={() => {
            const row = document.getElementById(`listing-row-scroll-${heading}`);
            if (row) row.scrollBy({ left: -220, behavior: "smooth" });
          }}
        >
          &#8592;
        </button>
        <div
          id={`listing-row-scroll-${heading}`}
          style={{
            display: "flex",
            gap: "1.5rem",
            overflowX: "scroll",
            paddingBottom: "1rem",
            scrollBehavior: "smooth",
            minHeight: "220px" // Adjust this value to match the max scaled card height
          }}
          className={styles["hide-scrollbar"]}
        >
          {items.map((item) => (
            <div key={item.id}>
              <ItemCard prodData={item}  variant="minimal"/>
            </div>
          ))}
        </div>
        <button
          type="button"
          aria-label="Scroll right"
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            background: "rgba(255,255,255,0.8)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            cursor: "pointer",
            display: items.length > 3 ? "block" : "none"
          }}
          onClick={() => {
            const row = document.getElementById(`listing-row-scroll-${heading}`);
            if (row) row.scrollBy({ left: 220, behavior: "smooth" });
          }}
        >
          &#8594;
        </button>
      </div>
      {viewMoreLink && (
          <a href={viewMoreLink} style={{ color: "#0070f3", textDecoration: "underline", fontWeight: 500 , position:'absolute', right:'48px'}}>View More</a>
        )}
    </div>
  );
};

export default ListingRow;
