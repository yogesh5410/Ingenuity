import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const CLIST_USERNAME = process.env.CLIST_USERNAME;
const CLIST_API_KEY = process.env.CLIST_API_KEY;

export const getContests = async (req, res) => {
  try {
    const response = await axios.get("https://clist.by/api/v4/contest/", {
      params: {
        upcoming: true,
        order_by: "start",
        limit: 75,
      },
      headers: {
        Authorization: `ApiKey ${CLIST_USERNAME}:${CLIST_API_KEY}`,
      },
    });

    //console.log(response.data.objects);

    const allowedPlatforms = ['codeforces.com', 'leetcode.com', 'codechef.com'];

    const filteredContests = response.data.objects.filter(contest =>
      allowedPlatforms.includes(contest.resource.toLowerCase())
    );

    const contests = filteredContests.map(contest => ({
      id: contest.id,
      name: contest.event,
      start: contest.start,
      end: contest.end,
      duration: contest.duration,
      platform: contest.resource,
      url: contest.href,
    }));

    res.status(200).json({
      success: true,
      error: false,
      message: "Contests fetched successfully",
      data: contests,
    });
  } catch (error) {
    console.error("Error fetching contests:", error.message);
    res.status(500).json({
      success: false,
      error: true,
      message: "Failed to fetch contests",
    });
  }
};
