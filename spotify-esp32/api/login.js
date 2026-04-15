export default function handler(req, res) {
  const client_id = "4aef14cc756048d08ac9859250650346";
  const redirect_uri = "https://spotify-esp32-ansh.vercel.app/api/callback";

  const scope = "user-read-playback-state user-read-currently-playing";

  const auth_url =
    "https://accounts.spotify.com/authorize" +
    "?response_type=code" +
    "&client_id=" + client_id +
    "&scope=" + encodeURIComponent(scope) +
    "&redirect_uri=" + encodeURIComponent(redirect_uri);

  res.writeHead(302, { Location: auth_url });
  res.end();
}