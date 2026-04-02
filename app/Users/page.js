"use client";

import { useEffect, useState } from "react";

export default function Users() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [orgFilter, setOrgFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, orgFilter, statusFilter, data]);

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

      if (!res.ok) throw new Error(result.error);

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Apply Filters
  const applyFilters = () => {
    let temp = [...data];

    // 🔍 Search
    if (search) {
      temp = temp.filter((user) =>
        [user.name, user.email, user.username]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    }

    // 🎯 Org filter
    if (orgFilter !== "all") {
      temp = temp.filter((user) => user.org === orgFilter);
    }

    // ✅ Status filter
    if (statusFilter !== "all") {
      temp = temp.filter((user) =>
        statusFilter === "active" ? user.isActive : !user.isActive,
      );
    }

    setFilteredData(temp);
  };

  if (loading) return <p style={styles.infoText}>Loading users...</p>;
  if (error) return <p style={styles.errorText}>{error}</p>;

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Users</h2>

      {/* 🔥 FILTER SECTION */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by name, email, username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={orgFilter}
          onChange={(e) => setOrgFilter(e.target.value)}
          style={styles.select}>
          <option value="all">All Orgs</option>
          <option value="Org 1">Org 1</option>
          <option value="Org 2">Org 2</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* TABLE */}
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
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.empty}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredData.map((user, index) => (
                <tr key={index} style={styles.row}>
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
                  <td style={tdStyle}>{user.profileName || "—"}</td>

                  {/* Status Badge */}
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

                  {/* Org Badge */}
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

  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  input: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    flex: 1,
  },

  select: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  tableWrapper: {
    maxHeight: "80vh",
    overflow: "auto",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },

  headerRow: {
    background: "#f1f5f9",
    position: "sticky",
    top: 0,
  },

  row: {
    borderBottom: "1px solid #eee",
    transition: "0.2s",
  },

  badge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
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
  padding: "12px",
  textAlign: "left",
  fontSize: "13px",
  color: "#6b7280",
};

const tdStyle = {
  padding: "12px",
};
