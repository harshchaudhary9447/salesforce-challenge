import axios from "axios";

export async function GET(req) {
  try {
    console.log("in backend of accounts");

    const org1Token = req.headers.get("org1token");
    const org2Token = req.headers.get("org2token");

    const org1Instance = req.headers.get("org1instance");
    const org2Instance = req.headers.get("org2instance");

    if (!org1Token || !org2Token || !org1Instance || !org2Instance) {
      return Response.json(
        { error: "Missing tokens or instance URLs" },
        { status: 400 }
      );
    }

    const [org1Res, org2Res] = await Promise.all([
      axios.get(`${org1Instance}/services/apexrest/account`, {
        headers: {
          Authorization: `Bearer ${org1Token}`,
          "Content-Type": "application/json",
        },
      }),
      axios.get(`${org2Instance}/services/apexrest/account`, {
        headers: {
          Authorization: `Bearer ${org2Token}`,
          "Content-Type": "application/json",
        },
      }),
    ]);

    const org1Accounts = (org1Res.data || []).map((acc) => ({
      ...acc,
      org: "Org 1",
    }));

    const org2Accounts = (org2Res.data || []).map((acc) => ({
      ...acc,
      org: "Org 2",
    }));

    return Response.json([...org1Accounts, ...org2Accounts], {
      status: 200,
    });
  } catch (error) {
    console.error("Accounts API Error:", error.response?.data || error.message);

    return Response.json(
      {
        error: "Failed to fetch accounts",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}