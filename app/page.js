"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getLoginUrl } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  const [org1, setOrg1] = useState({});
  const [org2, setOrg2] = useState({});

  const [connected1, setConnected1] = useState(false);
  const [connected2, setConnected2] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("org1_access_token")) setConnected1(true);
    if (localStorage.getItem("org2_access_token")) setConnected2(true);
  }, []);

  const handleConnect = async (orgKey, data) => {
    try {
      await axios.post("/api/save-org", {
        org: orgKey,
        ...data,
      });

      const url = getLoginUrl(orgKey, data.domain, data.client_id);
      window.location.href = url;
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const renderForm = (orgKey, state, setState, connected) => {

    const logoSrc =
      orgKey === "org1"
        ? "/cutebear.png"
        : "/lightking.avif";

    return (
      <div className="backdrop-blur-md bg-white/70 shadow-xl rounded-2xl p-6 border border-white/40 transition hover:scale-[1.02] min-h-[280px] flex flex-col">

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {orgKey.toUpperCase()}
          </h3>

          {connected && (
            <span className="text-green-700 text-sm font-medium bg-green-100 px-3 py-1 rounded-full">
              Connected
            </span>
          )}
        </div>

        {connected ? (

          <div className="flex flex-1 items-center justify-center">

            <Image
              src={logoSrc}
              alt="Org Logo"
              width={170}
              height={170}
              className="object-contain drop-shadow-md"
              priority
            />

          </div>

        ) : (

          <div className="space-y-4">

            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none bg-white/80"
              placeholder="Client ID"
              onChange={(e) =>
                setState({ ...state, client_id: e.target.value })
              }
            />

            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none bg-white/80"
              placeholder="Client Secret"
              onChange={(e) =>
                setState({ ...state, client_secret: e.target.value })
              }
            />

            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none bg-white/80"
              placeholder="https://xxx.my.salesforce.com"
              onChange={(e) =>
                setState({ ...state, domain: e.target.value })
              }
            />

            <button
              onClick={() => handleConnect(orgKey, state)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:scale-[1.02] transition"
            >
              Connect
            </button>

          </div>

        )}

      </div>
    );
  };

  return (

    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-white to-purple-300" />

      {/* pattern overlay */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="relative z-10 w-full max-w-5xl px-6">

        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Connect Salesforce Orgs
        </h1>

        <p className="text-center text-gray-500 mb-10">
          Securely connect multiple Salesforce organizations
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          {renderForm("org1", org1, setOrg1, connected1)}
          {renderForm("org2", org2, setOrg2, connected2)}

        </div>

        <div className="mt-10 text-center">

          <button
            disabled={!(connected1 && connected2)}
            onClick={() => router.push("/home")}
            className={`px-10 py-3 rounded-xl font-semibold transition text-lg
            ${
              connected1 && connected2
                ? "bg-black text-white hover:bg-gray-800 shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Enter Application →
          </button>

        </div>

      </div>

    </div>

  );
}