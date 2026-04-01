"use client";

import { useEffect, useState } from "react";

export default function AppPage() {
  const [org1Token, setOrg1Token] = useState("");
  const [org2Token, setOrg2Token] = useState("");

  useEffect(() => {
    setOrg1Token(localStorage.getItem("org1_access_token"));
    setOrg2Token(localStorage.getItem("org2_access_token"));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Inside Application</h1>

      <h3>Org 1 Token:</h3>
      <p>{org1Token}</p>

      <h3>Org 2 Token:</h3>
      <p>{org2Token}</p>
    </div>
  );
}
