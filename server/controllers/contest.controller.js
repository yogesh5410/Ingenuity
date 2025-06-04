import axios from "axios";
import NodeCache from "node-cache";

const contestCache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

export const getContests = async (req, res) => {
  try {
    const cached = contestCache.get("allContests");
    if (cached) {
      return res.status(200).json({
        success: true,
        error: false,
        message: "Contests served from cache",
        data: cached,
      });
    }

    console.log("Fetching contests from CompeteAPI...");

    const { data } = await axios.get("https://competeapi.vercel.app/contests/upcoming/");

    const now = new Date();

    const filtered = data
      .map((contest) => {
        // Defensive fallback values
        const startTime = contest.startTime ? new Date(contest.startTime) : null;
        const endTime = contest.endTime ? new Date(contest.endTime) : null;

        // Skip contests without valid times
        if (!startTime || isNaN(startTime) || !endTime || isNaN(endTime)) {
          return null;
        }

        let durationSec = Math.floor((endTime - startTime) / 1000);

        // Defensive check for platform key string
        const platformStr = (contest.site || contest.platform || "").toString().toLowerCase();

        // Fix LeetCode large duration problem:
        // Clamp LeetCode contests with duration > 6h to 90 minutes (5400 seconds)
        if (platformStr.includes("leetcode") && durationSec > 6 * 3600) {
          durationSec = 90 * 60; // 90 minutes in seconds
        }

        return {
          id: contest.title + (startTime ? startTime.toISOString() : ""),
          name: contest.title || "Unnamed Contest",
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          duration: durationSec,
          platform: contest.site || contest.platform || "unknown",
          url: contest.url || "#",
        };
      })
      .filter((contest) => contest !== null) // remove invalid contests
      .filter(
        (contest) =>
          new Date(contest.end) > now &&
          contest.duration > 0 &&
          contest.duration < 7 * 24 * 3600
      )
      .sort((a, b) => new Date(a.start) - new Date(b.start));

    contestCache.set("allContests", filtered);

    return res.status(200).json({
      success: true,
      error: false,
      message: "Contests fetched from CompeteAPI",
      data: filtered,
    });
  } catch (error) {
    console.error("❌ Error fetching from CompeteAPI:", error);

    const cached = contestCache.get("allContests");
    if (cached) {
      return res.status(200).json({
        success: true,
        error: false,
        message: "Contests served from cache due to API failure",
        data: cached,
      });
    }

    return res.status(500).json({
      success: false,
      error: true,
      message: "Failed to fetch contest data",
    });
  }
};
