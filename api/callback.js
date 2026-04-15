export default async function handler(req, res) {
  const code = req.query.code;

  const client_id = "4aef14cc756048d08ac9859250650346";
  const client_secret = "92f3b032712b4401b5401b310ffb294c";
  const redirect_uri = "https://spotify-esp32.vercel.app/api/callback";

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri,
    }),
  });

  const data = await tokenResponse.json();

  res.status(200).json(data);
}
