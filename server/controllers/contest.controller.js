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

    const filtered = data
      .filter(contest => new Date(contest.endTime) > new Date()) // upcoming only
      .map(contest => ({
        id: contest.title + contest.startTime,
        name: contest.title,
        start: new Date(contest.startTime).toISOString(),
        end: new Date(contest.endTime).toISOString(),
        duration: (new Date(contest.endTime) - new Date(contest.startTime)) / 1000,
        platform: contest.site,
        url: contest.url,
      }))
      .sort((a, b) => new Date(a.start) - new Date(b.start));

    contestCache.set("allContests", filtered);

    return res.status(200).json({
      success: true,
      error: false,
      message: "Contests fetched from CompeteAPI",
      data: filtered,
    });
  } catch (error) {
    console.error("❌ Error fetching from CompeteAPI:", error.message);

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
