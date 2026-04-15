export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  try {
    const refresh_token =
      "AQBtVpt0Utt7swFjM-xYh0SihXrVsurekN6jR2oFiKbnV5oyNE87XjqLEVrGtvXjup_u6r2sgSJy6AOl8jQQziAVutvLJBzhGa2uM3pAp327w2VCYHsDHu3pZ1qneaxz2iE";

    const client_id =
      "4aef14cc756048d08ac9859250650346";

    const client_secret =
      "92f3b032712b4401b5401b310ffb294c";

    const encoded = Buffer.from(
      `${client_id}:${client_secret}`
    ).toString("base64");

    // 🔁 Refresh access token
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + encoded,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(500).json({
        error: "Token failed",
        details: tokenData,
      });
    }

    const access_token = tokenData.access_token;

    // 🎵 Get current song
    const response = await fetch(
      "https://api.spotify.com/v1/me/player",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.status === 204) {
      return res.status(200).json({
        message: "Nothing playing",
      });
    }

    const data = await response.json();

    return res.status(200).json({
      song: data.item?.name,
      artist: data.item?.artists?.[0]?.name,
      isPlaying: data.is_playing,
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
