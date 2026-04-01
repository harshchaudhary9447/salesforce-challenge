export const getLoginUrl = (org, domain, client_id) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
    state: org, // ✅ THIS IS THE FIX
  });

  return `${domain}/services/oauth2/authorize?${params.toString()}`;
};
