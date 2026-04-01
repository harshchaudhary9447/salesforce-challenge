"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");
    const org = params.get("state");
    console.log("authorization code: ", code);
    console.log("FULL URL:", window.location.href);
    console.log("code:", code);
    console.log("org (state):", org);

    if (code && org) {
      axios
        .post("/api/token", { code, org }) // 👈 org added
        .then((res) => {
          let accessTokenName = res.data.access_token;
          console.log(`${org}_access_token: `, accessTokenName);
          localStorage.setItem(`${org}_access_token`, res.data.access_token);
          localStorage.setItem(`${org}_instance_url`, res.data.instance_url);

          router.push("/");
        })
        .catch((err) => {
          console.error(err.response?.data || err.message);
        });
    }
  }, [router]);

  return <h2>Processing...</h2>;
}
