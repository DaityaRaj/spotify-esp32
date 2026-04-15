export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  try {
    // 🔴 HARD CODED VALUES (for now)
    const refresh_token = "AQBtVpt0Utt7swFjM-xYh0SihXrVsurekN6jR2oFiKbnV5oyNE87XjqLEVrGtvXjup_u6r2sgSJy6AOl8jQQziAVutvLJBzhGa2uM3pAp327w2VCYHsDHu3pZ1qneaxz2iE";
    const client_id = "4aef14cc756048d08ac9859250650346";
    const client_secret = "92f3b032712b4401b5401b310ffb294c";

    // 🔐 Encode credentials
    const encoded = Buffer.from(
      `${client_id}:${client_secret}`
    ).toString("base64");

    // 🔁 STEP 1: Refresh access token
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
        error: "Token refresh failed",
        details: tokenData,
      });
    }

    const access_token = tokenData.access_token;

    // 🎵 STEP 2: Get current song
    const response = await fetch(
      "https://api.spotify.com/v1/me/player",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    // ⚠️ No music playing
    if (response.status === 204) {
      return res.status(200).json({
        message: "No active device or nothing playing",
      });
    }

    const data = await response.json();

    if (!data || !data.item) {
      return res.status(200).json({
        message: "No song data available",
      });
    }

    // 🎯 STEP 3: Extract useful info
    const progress_ms = data.progress_ms || 0;
    const duration_ms = data.item.duration_ms || 0;

    return res.status(200).json({
      song: data.item.name,
      artist: data.item.artists?.[0]?.name,
      isPlaying: data.is_playing,

      progress_ms: progress_ms,
      duration_ms: duration_ms,

      // 👇 easy for ESP32
      progress_sec: Math.floor(progress_ms / 1000),
      duration_sec: Math.floor(duration_ms / 1000),

      progress_percent: Math.floor(
        (progress_ms / duration_ms) * 100
      ),
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
