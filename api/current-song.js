export default async function handler(req, res) {
  let access_token = "BQB0wcnmd0GyJxLWA9-QtuWE3PltX_tclTZf4lj1P-0bp-gslIvxPqcLkiWRPqGP6JkXLEfI-qi_BmNa_0pNZ98bGrUsQM3fb8ijEdnT2ZrQ4S9BaDogeQR2j29jf9K26iHB7LoGOwATs0-wfgwWaRQ4rCR272x0HmXlgdMPFPdf4uGhKHXvmLBOntcL6gYxmK0TgA6D-ARFGAv6g6ks2nxSO8V3ZFoMv6bV8mQsOK2z2zVSvbM0eRlF6eU";
  const refresh_token = "AQBtVpt0Utt7swFjM-xYh0SihXrVsurekN6jR2oFiKbnV5oyNE87XjqLEVrGtvXjup_u6r2sgSJy6AOl8jQQziAVutvLJBzhGa2uM3pAp327w2VCYHsDHu3pZ1qneaxz2iE";

  const client_id = "4aef14cc756048d08ac9859250650346";
  const client_secret = "92f3b032712b4401b5401b310ffb294c";

  async function refreshAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
    });

    const data = await response.json();
    return data.access_token;
  }

  let response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  // 🔁 If expired → refresh
  if (response.status === 401) {
    access_token = await refreshAccessToken();

    response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
  }

  const data = await response.json();
  res.status(200).json(data);
}
