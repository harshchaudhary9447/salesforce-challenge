"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    org1: 0,
    org2: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
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

      calculateStats(result);
    } catch (err) {
      console.error("Dashboard Error:", err.message);
    }
  };

  const calculateStats = (users) => {
    let active = 0;
    let inactive = 0;
    let org1 = 0;
    let org2 = 0;

    users.forEach((u) => {
      u.isActive ? active++ : inactive++;
      u.org === "Org 1" ? org1++ : org2++;
    });

    setStats({
      total: users.length,
      active,
      inactive,
      org1,
      org2,
    });
  };

  const barData = [
    { name: "Org 1", users: stats.org1 },
    { name: "Org 2", users: stats.org2 },
  ];

  const pieData = [
    { name: "Active", value: stats.active },
    { name: "Inactive", value: stats.inactive },
  ];

  const COLORS = ["#0176d3", "#e5533d"];

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Dashboard</h2>

        {/* CARDS */}
        <div style={styles.cards}>
          <Card title="Total Users" value={stats.total} color="#111827" />
          <Card title="Active Users" value={stats.active} color="#059669" />
          <Card title="Inactive Users" value={stats.inactive} color="#dc2626" />
          <Card title="Org 1 Users" value={stats.org1} color="#0176d3" />
          <Card title="Org 2 Users" value={stats.org2} color="#7c3aed" />
        </div>

        {/* CHARTS */}
        <div style={styles.charts}>
          {/* BAR */}
          <div style={styles.chartBox}>
            <h3 style={styles.chartTitle}>Users per Org</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="users" fill="#0176d3" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* DONUT */}
          <div style={styles.chartBox}>
            <h3 style={styles.chartTitle}>Active vs Inactive</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={80}
                  outerRadius={110}
                  dataKey="value"
                  paddingAngle={4}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* CARD */
function Card({ title, value, color }) {
  return (
    <div style={styles.card}>
      <p style={styles.cardTitle}>{title}</p>
      <h2 style={{ ...styles.cardValue, color }}>{value}</h2>
    </div>
  );
}

/* STYLES */
const styles = {
  wrapper: {
    height: "100%",
    overflow: "hidden", // 🔥 prevents page scroll
  },

  container: {
    height: "100%",
    overflowY: "auto", // ✅ only dashboard scrolls
    padding: "20px",
    background: "linear-gradient(135deg, #f6f9fc, #eef2f7)",
  },

  heading: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "25px",
    color: "#111827",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
    marginBottom: "30px",
  },

  card: {
    background: "white",
    padding: "18px",
    borderRadius: "16px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "6px",
  },

  cardValue: {
    fontSize: "26px",
    fontWeight: "700",
  },

  charts: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  chartBox: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },

  chartTitle: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#374151",
  },
};
