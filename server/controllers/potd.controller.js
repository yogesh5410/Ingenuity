import Potd from '../models/potd.model.js';
import UserModel from '../models/user.model.js';
import fetch from 'node-fetch';

// Utility: Normalize to 'yyyy-mm-dd'
const normalizeDate = (dateStr) => new Date(dateStr).toISOString().slice(0, 10);

// ===================== GET POTD BY DATE =====================
export const getPotdByDate = async (req, res) => {
  try {
    const date = normalizeDate(req.params.date);
    const potd = await Potd.findOne({ date });
    // console.log("POTD for date:", date, potd);

    if (!potd) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'No POTD found for the given date.',
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      data: potd,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: 'Failed to fetch POTD.',
      details: error.message,
    });
  }
};

// ===================== CREATE NEW POTD =====================
export const createPotd = async (req, res) => {
  try {
    const { date, title, problemLink, platform, hints } = req.body;

    if (!date || !title || !problemLink || !platform || !hints[0].text) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Date, title, problem link, hints and platform are required.',
      });
    }

    const normalizedDate = normalizeDate(date);

    const existingPotd = await Potd.findOne({ date: normalizedDate });
    if (existingPotd) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'A POTD already exists for the given date.',
      });
    }

    const newPotd = new Potd({
      date: normalizedDate,
      title,
      problemLink,
      platform,
      hints,
    });

    await newPotd.save();

    res.status(201).json({
      success: true,
      error: false,
      message: 'POTD created successfully.',
      data: newPotd,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: 'Failed to create POTD.',
      details: error.message,
    });
  }
};

// ===================== UPDATE POTD BY DATE =====================
export const updatePotdByDate = async (req, res) => {
  console.log(req.params.date, req.body);
  try {
    const date = normalizeDate(req.params.date);
    const { title, problemLink, platform, hints } = req.body;
    console.log(title, problemLink, platform, hints);

    const updatedPotd = await Potd.findOneAndUpdate(
      { date },
      { title, problemLink, platform, hints },
      { new: true }
    );

    if (!updatedPotd) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'No POTD found to update for the given date.',
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: 'POTD updated successfully.',
      data: updatedPotd,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: 'Failed to update POTD.',
      details: error.message,
    });
  }
};

// ===================== DELETE POTD BY DATE =====================
export const deletePotdByDate = async (req, res) => {
  try {
    const date = normalizeDate(req.params.date);

    const deletedPotd = await Potd.findOneAndDelete({ date });

    if (!deletedPotd) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'No POTD found to delete for the given date.',
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: 'POTD deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: 'Failed to delete POTD.',
      details: error.message,
    });
  }
};

// ===================== GET LEADERBOARD =====================
export const getLeaderboard = async (req, res) => {
  try {
    const users = await UserModel.find({}, 'name points')
      .sort({ points: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      error: false,
      leaderboard: users,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: true,
      message: 'Failed to fetch leaderboard.',
      details: error.message,
    });
  }
};


// ===================== CHECK IF POTD IS SOLVED =====================

export const postCheckPotdSolved = async (req, res) => {
  const { problemLink, platform } = req.body;
  const user = req.userId;
  console.log(platform, problemLink)


  if (!problemLink || !platform) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: problemLink, platform.",
    });
  }

  const targetTimestamp = Date.now(); // current time in milliseconds

  try {
    let isSolved = false;
    const platformLower = platform.toLowerCase();

    if (platformLower === "codeforces") {

      const userDoc = await UserModel.findById(user, 'codeforces_id');
      const username = userDoc?.codeforces_id;


      const cfRes = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
      const data = await cfRes.json();

      if (data.status !== "OK") {
        return res.status(400).json({
          success: false,
          message: "Invalid Codeforces username or API error.",
        });
      }

      const match = problemLink.match(/\/(?:contest|problemset)\/(\d+)\/problem\/([A-Z]\d*)/i);


      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Invalid Codeforces problem link format.",
        });
      }

      const [_, contestId, problemIndex] = match;

      isSolved = data.result.some(
        (sub) =>
          sub.verdict === "OK" &&
          sub.problem.contestId == contestId &&
          sub.problem.index === problemIndex &&
          sub.creationTimeSeconds * 1000 < targetTimestamp
      );
    } else if (platformLower === "leetcode") {

      const userDoc = await UserModel.findById(user, 'leetcode_id');
      const username = userDoc?.leetcode_id;
      console.log("Username:", username);

      const match = problemLink.match(/leetcode\.com\/problems\/([\w-]+)\//);
      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Invalid LeetCode problem link.",
        });
      }

      const slug = match[1];

      const response = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query userSubmissions($username: String!, $limit: Int!) {
              recentAcSubmissionList(username: $username, limit: $limit) {
                titleSlug
                timestamp
              }
            }
          `,
          variables: {
            username,
            limit: 100,
          },
        }),
      });

      const result = await response.json();
      const acList = result?.data?.recentAcSubmissionList;

      if (!acList) {
        return res.status(400).json({
          success: false,
          message: "Invalid LeetCode username or no submissions found.",
        });
      }

      isSolved = acList.some(
        (sub) =>
          sub.titleSlug === slug &&
          parseInt(sub.timestamp) * 1000 < targetTimestamp
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported platform.",
      });
    }

    return res.json({
      success: true,
      problemSolved: isSolved,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};
