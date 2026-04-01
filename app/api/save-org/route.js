import { orgStore } from "@/lib/store";

export async function POST(req) {
  const { org, client_id, client_secret, domain } = await req.json();

  if (!org || !client_id || !client_secret || !domain) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  orgStore[org] = {
    client_id,
    client_secret,
    domain,
  };

  return Response.json({ success: true });
}
