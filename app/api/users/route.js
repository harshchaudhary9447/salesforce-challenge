import axios from "axios";

export async function GET(req) {
  try {
    // 🔹 Get headers from frontend
    console.log("in the backend of user");
    const org1Token = req.headers.get("org1token");
    const org2Token = req.headers.get("org2token");

    const org1Instance = req.headers.get("org1instance");
    const org2Instance = req.headers.get("org2instance");

    console.log("org1 token: ", org1Token);
    console.log("org2 token: ", org2Token);

    // 🔹 Validation
    if (!org1Token || !org2Token || !org1Instance || !org2Instance) {
      return Response.json(
        { error: "Missing tokens or instance URLs" },
        { status: 400 },
      );
    }

    // 🔥 Call both Salesforce org APIs in parallel

    // let firstApi = `${org1Instance}/services/apexrest/user`;
    // let secondApi = `${org2Instance}/services/apexrest/user`;
    // console.log("first api: ", firstApi);
    // console.log("second api: ", secondApi);

    const [org1Res, org2Res] = await Promise.all([
      axios.get(`${org1Instance}/services/apexrest/user`, {
        headers: {
          Authorization: `Bearer ${org1Token}`,
          "Content-Type": "application/json",
        },
      }),
      axios.get(`${org2Instance}/services/apexrest/user`, {
        headers: {
          Authorization: `Bearer ${org2Token}`,
          "Content-Type": "application/json",
        },
      }),
    ]);

    // 🔹 Add org info to each user
    // let data1 = org1Res.data;
    // let data2 = org2Res.data;
    // console.log(data1);
    // console.log(data2);
    const org1Users = (org1Res.data || []).map((user) => ({
      ...user,
      org: "Org 1",
    }));

    const org2Users = (org2Res.data || []).map((user) => ({
      ...user,
      org: "Org 2",
    }));

    // 🔥 Merge both org data
    const mergedData = [...org1Users, ...org2Users];

    return Response.json(mergedData, { status: 200 });
  } catch (error) {
    console.error("Users API Error:", error.response?.data || error.message);

    return Response.json(
      {
        error: "Failed to fetch users",
        details: error.response?.data || error.message,
      },
      { status: 500 },
    );
  }
}
