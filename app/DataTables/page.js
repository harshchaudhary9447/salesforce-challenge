"use client";

import { useEffect, useState } from "react";

export default function CRMViewer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedObject, setSelectedObject] = useState("accounts");

  useEffect(() => {
    fetchData(selectedObject);
  }, [selectedObject]);

  /* ---------- API ROUTES ---------- */

  const apiMap = {
    accounts: "/api/accounts",
    contacts: "/api/contacts",
    leads: "/api/leads",
    opportunities: "/api/opportunities",
  };

  /* ---------- FETCH ---------- */

  const fetchData = async (type) => {
    try {
      setLoading(true);
      setError("");
      setData([]); // remove previous data instantly

      const res = await fetch(apiMap[type], {
        method: "GET",
        headers: {
          org1token: localStorage.getItem("org1_access_token"),
          org2token: localStorage.getItem("org2_access_token"),
          org1instance: localStorage.getItem("org1_instance_url"),
          org2instance: localStorage.getItem("org2_instance_url"),
        },
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error);

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- COLUMNS ---------- */

  const columns = {
    accounts: ["Name", "Industry", "Type", "AnnualRevenue", "org"],
    contacts: ["FirstName", "LastName", "Email", "Phone", "org"],
    leads: ["Name", "Company", "Status", "Email", "org"],
    opportunities: ["Name", "StageName", "Amount", "CloseDate", "org"],
  };

  const truncateText = (text, max = 28) =>
    text && text.length > max ? text.substring(0, max) + "..." : text;

  /* ---------- UI ---------- */

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* OBJECT BUTTONS */}
        <div style={styles.tabs}>
          {Object.keys(apiMap).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedObject(key)}
              style={{
                ...styles.tab,
                ...(selectedObject === key ? styles.activeTab : {}),
              }}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>

        {/* TABLE CARD */}
        <div style={styles.tableCard}>
          {loading ? (
            <div style={styles.loader}>Loading...</div>
          ) : (
            <div style={styles.scrollArea}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {columns[selectedObject].map((col) => (
                      <th key={col} style={styles.th}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={styles.empty}>
                        No Data Found
                      </td>
                    </tr>
                  ) : (
                    data.map((row, i) => (
                      <tr
                        key={i}
                        style={styles.row}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f3f6f9")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "white")
                        }
                      >
                        {columns[selectedObject].map((col) => (
                          <td key={col} style={styles.td}>
                            {col === "org" ? (
                              <span
                                style={{
                                  ...styles.orgBadge,
                                  background:
                                    row.org === "Org 1"
                                      ? "#d8ecff"
                                      : "#ede9fe",
                                  color:
                                    row.org === "Org 1"
                                      ? "#0176d3"
                                      : "#6b21a8",
                                }}
                              >
                                {row.org}
                              </span>
                            ) : (
                              truncateText(String(row[col] ?? "—"))
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {error && <div style={styles.error}>{error}</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------- SALESFORCE STYLE UI ---------- */

const styles = {
  page: {
    background: "#f3f6f9",
    minHeight: "100vh",
    fontFamily: "Salesforce Sans, Arial, sans-serif",
    paddingTop: "40px",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },

  /* BUTTON TABS */

  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },

  tab: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #d8dde6",
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    color: "#16325c",
    transition: "0.15s",
  },

  activeTab: {
    background: "#0176d3",
    color: "white",
    border: "1px solid #0176d3",
  },

  /* TABLE CARD */

  tableCard: {
    background: "white",
    borderRadius: "8px",
    border: "1px solid #d8dde6",
    overflow: "hidden",
  },

  scrollArea: {
    maxHeight: "78vh",
    overflowY: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    position: "sticky",
    top: 0,
    background: "#f3f6f9",
    padding: "12px",
    textAlign: "left",
    fontSize: "12px",
    color: "#444",
    borderBottom: "1px solid #d8dde6",
    textTransform: "uppercase",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eef1f6",
    color: "#16325c",
    fontSize: "14px",
  },

  row: {
    transition: "0.15s",
  },

  loader: {
    padding: "40px",
    textAlign: "center",
  },

  empty: {
    textAlign: "center",
    padding: "30px",
    color: "#888",
  },

  error: {
    color: "red",
    padding: "15px",
  },

  /* ORG BADGE */

  orgBadge: {
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  },
};