export default async function handler(req, res) {
  const code = req.query.code;

  const client_id = "4aef14cc756048d08ac9859250650346";
  const client_secret = "92f3b032712b4401b5401b310ffb294c";
  const redirect_uri = "https://spotify-esp32-ansh.vercel.app/api/callback";

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await response.json();

  res.send(`
    <h2>Access Token:</h2>
    <p>${data.access_token}</p>
  `);
}