"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import astreaLogo from "@/assets/astrea-logo.jpg";
import Dashboard from "../dashboard/page";
import DataTables from "../DataTables/page";
import Orders from "../Orders/page";
import Users from "../Users/page";

export default function HomePage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("dashboard");

  const [org1Token, setOrg1Token] = useState("");
  const [org2Token, setOrg2Token] = useState("");

  const [org1Instance, setOrg1Instance] = useState("");
  const [org2Instance, setOrg2Instance] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token1 = localStorage.getItem("org1_access_token");
    const token2 = localStorage.getItem("org2_access_token");

    const instance1 = localStorage.getItem("org1_instance_url");
    const instance2 = localStorage.getItem("org2_instance_url");

    if (!token1 || !token2 || !instance1 || !instance2) {
      localStorage.clear();
      router.push("/");
      return;
    }

    setOrg1Token(token1);
    setOrg2Token(token2);
    setOrg1Instance(instance1);
    setOrg2Instance(instance2);

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;

      case "data":
        return <DataTables />;

      case "orders":
        return <Orders />;

      case "users":
        return <Users />;

      default:
        return null;
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div>
          {/* LOGO */}
          <div style={styles.logoContainer}>
            <Image
              src={astreaLogo}
              alt="Astrea Logo"
              width={40}
              height={40}
              style={{ borderRadius: "8px" }}
            />
            <h2 style={styles.logoText}>Salesforce App</h2>
          </div>

          {/* MENU */}
          <SidebarItem
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarItem
            label="Data Tables"
            active={activeTab === "data"}
            onClick={() => setActiveTab("data")}
          />
          <SidebarItem
            label="Orders"
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          />
          <SidebarItem
            label="Users"
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
          />
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
          }>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>{renderContent()}</div>
    </div>
  );
}

/* Sidebar Item */
function SidebarItem({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px 14px",
        marginBottom: "12px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600",
        letterSpacing: "0.3px",

        background: active
          ? "linear-gradient(90deg, #ffffff, #f1f5ff)"
          : "transparent",

        color: active ? "#014486" : "#e6f0ff",

        boxShadow: active ? "0 2px 8px rgba(0,0,0,0.15)" : "none",

        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
        }
      }}>
      {label}
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },

  sidebar: {
    width: "250px",
    background: "linear-gradient(180deg, #0176d3, #014486)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "22px 18px",
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "35px",
  },

  logoText: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },

  main: {
    flex: 1,
    background: "#f6f8fb",
    padding: "30px",
  },

  logoutBtn: {
    background: "rgba(255,255,255,0.12)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s",
  },
};
