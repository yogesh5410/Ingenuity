import React, { useEffect, useState } from "react";
import { CalendarDays, ExternalLink, Loader, AlertCircle } from "lucide-react";
import Axios from "../utils/axios.js";
import SummaryApi from "../common/summaryApi.js";
import Cf_logo from "../assets/cf_logo.png";

// Platform logos
const platformLogos = {
  "codeforces.com": (
    <img src={Cf_logo} alt="Codeforces Logo" className="w-8 h-8 object-contain" loading="lazy" />
  ),
  "leetcode.com": (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
      alt="LeetCode Logo"
      className="w-8 h-8 object-contain"
      loading="lazy"
    />
  ),
  "codechef.com": (
    <img
      src="https://cdn.codechef.com/images/cc-logo.svg"
      alt="CodeChef Logo"
      className="w-8 h-8 object-contain"
      loading="lazy"
    />
  ),
  "geeksforgeeks.org": (
    <img
      src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200X200.png"
      alt="GeeksforGeeks Logo"
      className="w-8 h-8 object-contain rounded"
      loading="lazy"
    />
  ),
};

// Platform theme colors
const platformColors = {
  "codeforces.com": {
    border: "border-[#1F8ACB]",
    bg: "bg-[#D0E8FF] dark:bg-[#0D2B4E]",
    text: "text-[#1F8ACB] dark:text-[#6BB8FF]",
  },
  "leetcode.com": {
    border: "border-[#FFA116]",
    bg: "bg-[#FFF3E0] dark:bg-[#402C11]",
    text: "text-[#FFA116] dark:text-[#FFB94F]",
  },
  "codechef.com": {
    border: "border-[#CA7842]",
    bg: "bg-[#F8EBDD] dark:bg-[#332519]",
    text: "text-[#5B4636] dark:text-[#D7BBA4]",
  },
  "geeksforgeeks.org": {
    border: "border-[#3C873A]",
    bg: "bg-[#E6F1DD] dark:bg-[#1D3320]",
    text: "text-[#3C873A] dark:text-[#8BC88A]",
  },
};

// Convert UTC to IST
const formatIST = (utcString) => {
  const utcDate = new Date(utcString);
  return utcDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

// Format duration
const formatDuration = (seconds) => {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
};

// Normalize platform key
const normalizePlatformKey = (platform, site) => {
  const key = (platform || site || "").toLowerCase();
  if (key.includes("codeforces")) return "codeforces.com";
  if (key.includes("leetcode")) return "leetcode.com";
  if (key.includes("codechef")) return "codechef.com";
  if (key.includes("geeksforgeeks")) return "geeksforgeeks.org";
  return "unknown";
};

const Calender = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Axios({ ...SummaryApi.getContest });
      if (response.data.success) {
        setContests(response.data.data);
      } else {
        setError("Failed to fetch contests.");
      }
    } catch (err) {
      setError("Network error: Could not fetch contests.");
      console.error("Error fetching contests:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContests();
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 select-none">
        <CalendarDays className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        Upcoming Contests
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-10 h-10" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      ) : contests.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10 text-lg">
          No upcoming contests found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {contests.map((contest) => {
            const platformKey = normalizePlatformKey(contest.platform, contest.site);
            const colors = platformColors[platformKey] || {
              border: "border-gray-300 dark:border-gray-700",
              bg: "bg-white dark:bg-neutral-800",
              text: "text-gray-900 dark:text-white",
            };
            const logo = platformLogos[platformKey] || (
              <CalendarDays className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            );

            return (
              <div
                key={contest.id}
                className={`${colors.border} ${colors.bg} border-2 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white dark:bg-neutral-900 p-1 rounded shadow-sm">
                    {logo}
                  </div>
                  <h2 className="text-xl font-semibold line-clamp-2">{contest.name}</h2>
                </div>

                <p className="text-sm mb-1 text-gray-700 dark:text-gray-300">
                  Platform:{" "}
                  <span className={`font-semibold capitalize ${colors.text}`}>
                    {platformKey.replace(".com", "").replace(".org", "")}
                  </span>
                </p>

                <p className="text-sm mb-1">
                  <span className="font-medium">Start:</span>{" "}
                  <time dateTime={contest.start}>
                    {formatIST(contest.start)}
                  </time>
                </p>

                <p className="text-sm mb-1">
                  <span className="font-medium">End:</span>{" "}
                  <time dateTime={contest.end}>
                    {formatIST(contest.end)}
                  </time>
                </p>

                {contest.duration && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Duration: {formatDuration(contest.duration)}
                  </p>
                )}

                <a
                  href={contest.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Visit Contest <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calender;
