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
        const startTime = contest.startTime ? new Date(contest.startTime) : null;
        if (!startTime || isNaN(startTime)) return null;

        const platformStr = (contest.site || contest.platform || "").toString().toLowerCase();

        // For LeetCode contests: fix duration to 90 minutes and calculate endTime accordingly
        let durationSec = 0;
        let endTime = null;

        if (platformStr.includes("leetcode")) {
          durationSec = 90 * 60; // 90 minutes in seconds
          endTime = new Date(startTime.getTime() + durationSec * 1000);
        } else {
          endTime = contest.endTime ? new Date(contest.endTime) : null;
          if (!endTime || isNaN(endTime)) return null;

          durationSec = Math.floor((endTime - startTime) / 1000);
          if (durationSec <= 0) return null; // Invalid duration
        }

        return {
          id: contest.title + startTime.toISOString(),
          name: contest.title || "Unnamed Contest",
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          duration: durationSec,
          platform: contest.site || contest.platform || "unknown",
          url: contest.url || "#",
        };
      })
      .filter((contest) => contest !== null)
      .filter(
        (contest) =>
          new Date(contest.end) > now &&
          contest.duration > 0 &&
          contest.duration < 7 * 24 * 3600 // less than 7 days
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
