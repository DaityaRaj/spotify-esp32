export default async function handler(req, res) {
  const refresh_token = "AQBtVpt0Utt7swFjM-xYh0SihXrVsurekN6jR2oFiKbnV5oyNE87XjqLEVrGtvXjup_u6r2sgSJy6AOl8jQQziAVutvLJBzhGa2uM3pAp327w2VCYHsDHu3pZ1qneaxz2iE";
  const client_id = "4aef14cc756048d08ac9859250650346";
  const client_secret = "92f3b032712b4401b5401b310ffb294c";

  async function refreshAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + btoa(client_id + ":" + client_secret),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
    });

    const data = await response.json();
    return data.access_token;
  }

  const access_token = await refreshAccessToken();

  const response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
