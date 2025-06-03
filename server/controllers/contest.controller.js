import axios from "axios";
import NodeCache from "node-cache";
import dotenv from "dotenv";

dotenv.config();

const contestCache = new NodeCache({ stdTTL: 3600 }); // 60 min cache
const CLIST_USERNAME = process.env.CLIST_USERNAME;
const CLIST_API_KEY = process.env.CLIST_API_KEY;

export const getContests = async (req, res) => {
  const clistPromise = fetchContestsFromClist();
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("CLIST Timeout")), 2000)
  );

  try {
    const contests = await Promise.race([clistPromise, timeoutPromise]);

    // 🛑 Ensure contests is valid before caching
    if (Array.isArray(contests) && contests.length > 0) {
      contestCache.set("contests", contests);
      console.log("✅ Cache set with", contests.length, "contests");
    } else {
      console.warn("⚠️ Invalid or empty contest data received; cache not updated.");
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Contests fetched successfully from CLIST",
      data: contests,
    });
  } catch (error) {
    const cachedData = contestCache.get("contests");
    console.error("❌ Error or timeout from CLIST:", error.message);

    if (cachedData) {
      res.status(200).json({
        success: true,
        error: false,
        message: "Contests served from cache (CLIST was slow)",
        data: cachedData,
      });

      // Background update attempt
      clistPromise
        .then((freshData) => {
          if (Array.isArray(freshData) && freshData.length > 0) {
            contestCache.set("contests", freshData);
            console.log("✅ Cache updated in background.");
          } else {
            console.warn("⚠️ Background fetch returned invalid data. Cache not updated.");
          }
        })
        .catch((err) => {
          console.warn("⚠️ Failed to update contest cache in background:", err.message);
        });

    } else {
      res.status(500).json({
        success: false,
        error: true,
        message: "Failed to fetch contests and no cache available",
      });
    }
  }
};


// 📡 CLIST fetch function
const fetchContestsFromClist = async () => {
  const response = await axios.get("https://clist.by/api/v4/contest/", {
    params: { upcoming: true, order_by: "start", limit: 75 },
    headers: {
      Authorization: `ApiKey ${CLIST_USERNAME}:${CLIST_API_KEY}`,
    },
    timeout: 10000, // Max time to wait for CLIST
  });

  const allowedPlatforms = new Set([
    "codeforces.com",
    "leetcode.com",
    "codechef.com",
  ]);

  const filtered = response.data.objects.filter(contest =>
    allowedPlatforms.has(contest.resource.toLowerCase())
  );

  return filtered.map(contest => ({
    id: contest.id,
    name: contest.event,
    start: contest.start,
    end: contest.end,
    duration: contest.duration,
    platform: contest.resource,
    url: contest.href,
  }));
};
