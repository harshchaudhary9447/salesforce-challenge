"use client";

import { useEffect, useState } from "react";

export default function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 Truncate helper
  const truncateText = (text, maxLength = 25) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const org1Token = localStorage.getItem("org1_access_token");
      const org2Token = localStorage.getItem("org2_access_token");

      const org1Instance = localStorage.getItem("org1_instance_url");
      const org2Instance = localStorage.getItem("org2_instance_url");

      if (!org1Token || !org2Token || !org1Instance || !org2Instance) {
        throw new Error("Missing authentication data. Please login again.");
      }

      const res = await fetch("/api/users", {
        method: "GET",
        headers: {
          org1token: org1Token,
          org2token: org2Token,
          org1instance: org1Instance,
          org2instance: org2Instance,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setData(result);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={styles.infoText}>Loading users...</p>;
  if (error) return <p style={styles.errorText}>Error: {error}</p>;

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Users</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Profile</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Org</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.empty}>
                  No users found
                </td>
              </tr>
            ) : (
              data.map((user, index) => (
                <tr
                  key={index}
                  style={styles.row}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f4f6f9")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }>
                  {/* Name */}
                  <td style={tdStyle} title={user.name}>
                    {truncateText(user.name)}
                  </td>

                  {/* Email */}
                  <td style={tdStyle} title={user.email}>
                    {truncateText(user.email)}
                  </td>

                  {/* Username */}
                  <td style={tdStyle} title={user.username}>
                    {truncateText(user.username)}
                  </td>

                  {/* Profile */}
                  <td style={tdStyle} title={user.profileName}>
                    {user.profileName ? (
                      truncateText(user.profileName)
                    ) : (
                      <span style={{ color: "#9ca3af" }}>—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td style={tdStyle}>
                    <span
                      style={{
                        ...styles.badge,
                        background: user.isActive ? "#e3fcef" : "#fdecea",
                        color: user.isActive ? "#067647" : "#b42318",
                      }}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Org */}
                  <td style={tdStyle}>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          user.org === "Org 1" ? "#e0f2fe" : "#ede9fe",
                        color: user.org === "Org 1" ? "#0176d3" : "#5b21b6",
                      }}>
                      {user.org}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🔥 STYLES */

const styles = {
  page: {
    marginTop: "20px",
    color: "#4b5563",
  },

  heading: {
    marginBottom: "16px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#1f2937",
  },

  tableWrapper: {
    maxHeight: "80vh",
    overflowY: "auto",
    overflowX: "auto",
    background: "white",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },

  headerRow: {
    background: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },

  row: {
    borderBottom: "1px solid #f1f5f9",
    transition: "0.2s",
  },

  badge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
    color: "#6b7280",
  },

  infoText: {
    color: "#6b7280",
  },

  errorText: {
    color: "red",
  },
};

const thStyle = {
  padding: "14px",
  fontSize: "13px",
  fontWeight: "600",
  textTransform: "uppercase",
  color: "#6b7280",
};

const tdStyle = {
  padding: "14px",
  fontSize: "14px",
};
