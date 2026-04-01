import axios from "axios";
import { orgStore } from "@/lib/store";

export async function POST(req) {
  try {
    console.log("inside the token url call");
    const { code, org } = await req.json();

    const config = orgStore[org];

    if (!config) {
      return Response.json({ error: "Org config not found" }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("client_id", config.client_id);
    params.append("client_secret", config.client_secret);
    params.append(
      "redirect_uri",
      `${process.env.NEXT_PUBLIC_REDIRECT_URI}?org=${org}`,
    );

    const response = await axios.post(
      `${config.domain}/services/oauth2/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return Response.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);

    return Response.json({ error: "Token exchange failed" }, { status: 500 });
  }
}
