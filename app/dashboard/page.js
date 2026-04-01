"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [token, setToken] = useState("");
  const [instanceUrl, setInstanceUrl] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("access_token"));
    setInstanceUrl(localStorage.getItem("instance_url"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Dashboard</h2>
      <p>✅ Successfully Authenticated</p>

      <p>
        <strong>Instance URL:</strong> {instanceUrl}
      </p>
      <p>
        <strong>Access Token:</strong> {token}
      </p>
    </div>
  );
}
