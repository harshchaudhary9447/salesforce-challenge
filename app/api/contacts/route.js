import axios from "axios";

export async function GET(req) {
  try {
    console.log("in backend of contacts");

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
      axios.get(`${org1Instance}/services/apexrest/contact`, {
        headers: { Authorization: `Bearer ${org1Token}` },
      }),
      axios.get(`${org2Instance}/services/apexrest/contact`, {
        headers: { Authorization: `Bearer ${org2Token}` },
      }),
    ]);

    const org1Data = org1Res.data.map((c) => ({ ...c, org: "Org 1" }));
    const org2Data = org2Res.data.map((c) => ({ ...c, org: "Org 2" }));

    return Response.json([...org1Data, ...org2Data]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}