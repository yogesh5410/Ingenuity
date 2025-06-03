import React, { useState } from "react";

const cpRoadmap = [
  {
    id: "basics",
    title: "Basics",
    description: "Fundamental concepts to get started.",
    topics: [
      {
        id: "arrays",
        title: "Arrays",
        description: "Basics of arrays and operations.",
        problems: [
          {
            id: "two-sum",
            title: "Two Sum",
            link: "https://leetcode.com/problems/two-sum/",
            difficulty: "Easy",
          },
          {
            id: "max-subarray",
            title: "Maximum Subarray",
            link: "https://leetcode.com/problems/maximum-subarray/",
            difficulty: "Easy",
          },
        ],
      },
      {
        id: "strings",
        title: "Strings",
        description: "String manipulation techniques.",
        problems: [
          {
            id: "valid-palindrome",
            title: "Valid Palindrome",
            link: "https://leetcode.com/problems/valid-palindrome/",
            difficulty: "Easy",
          },
        ],
      },
    ],
  },
  {
    id: "ds",
    title: "Data Structures",
    description: "Important data structures for CP.",
    topics: [
      {
        id: "stacks",
        title: "Stacks & Queues",
        description: "LIFO and FIFO data structures.",
        problems: [
          {
            id: "valid-parentheses",
            title: "Valid Parentheses",
            link: "https://leetcode.com/problems/valid-parentheses/",
            difficulty: "Easy",
          },
        ],
      },
      {
        id: "trees",
        title: "Trees",
        description: "Tree traversal, binary search trees, etc.",
        problems: [
          {
            id: "lowest-common-ancestor",
            title: "Lowest Common Ancestor",
            link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
            difficulty: "Medium",
          },
        ],
      },
    ],
  },
  {
    id: "algorithms",
    title: "Algorithms",
    description: "Key algorithmic paradigms and techniques.",
    topics: [
      {
        id: "sorting",
        title: "Sorting Algorithms",
        description: "Merge Sort, Quick Sort, etc.",
        problems: [
          {
            id: "sort-colors",
            title: "Sort Colors",
            link: "https://leetcode.com/problems/sort-colors/",
            difficulty: "Medium",
          },
        ],
      },
      {
        id: "dp",
        title: "Dynamic Programming",
        description: "Overlapping subproblems and optimization.",
        problems: [
          {
            id: "climbing-stairs",
            title: "Climbing Stairs",
            link: "https://leetcode.com/problems/climbing-stairs/",
            difficulty: "Easy",
          },
          {
            id: "coin-change",
            title: "Coin Change",
            link: "https://leetcode.com/problems/coin-change/",
            difficulty: "Medium",
          },
        ],
      },
    ],
  },
];

// Helper for local storage progress key
const PROGRESS_KEY = "cpRoadmapProgress";

export default function CPSheet() {
  const [expandedTopics, setExpandedTopics] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [progress, setProgress] = useState(() => {
    // Load from localStorage or empty object
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
    } catch {
      return {};
    }
  });

  // Toggle expand/collapse for a topic
  function toggleTopic(id) {
    setExpandedTopics((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  // Mark problem as done/not done
  function toggleProgress(problemId) {
    setProgress((prev) => {
      const updated = { ...prev };
      if (updated[problemId]) {
        delete updated[problemId];
      } else {
        updated[problemId] = true;
      }
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  // Filter function for search
  function filterBySearch(topic) {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    if (topic.title.toLowerCase().includes(lowerSearch)) return true;
    if (topic.description.toLowerCase().includes(lowerSearch)) return true;
    for (const problem of topic.problems || []) {
      if (problem.title.toLowerCase().includes(lowerSearch)) return true;
    }
    return false;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 md:p-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6 text-center">
        Competitive Programming Roadmap
      </h1>

      <div className="mb-8 text-center">
        <input
          type="text"
          placeholder="Search topics or problems..."
          className="w-full max-w-md px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div>
        {cpRoadmap.map((section) => {
          // Filter topics by search term
          const filteredTopics = section.topics.filter(filterBySearch);
          if (filteredTopics.length === 0) return null;

          return (
            <section key={section.id} className="mb-10">
              <h2 className="text-3xl font-semibold mb-2 border-b border-indigo-500 inline-block">
                {section.title}
              </h2>
              <p className="mb-4 text-indigo-600 dark:text-indigo-400">
                {section.description}
              </p>

              <div>
                {filteredTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="mb-6 border rounded-lg border-gray-300 dark:border-gray-700"
                  >
                    <button
                      onClick={() => toggleTopic(topic.id)}
                      className="w-full text-left px-5 py-3 bg-indigo-100 dark:bg-indigo-900 rounded-t-lg flex justify-between items-center focus:outline-none"
                    >
                      <span className="font-semibold text-lg">{topic.title}</span>
                      <span>{expandedTopics[topic.id] ? "−" : "+"}</span>
                    </button>

                    {expandedTopics[topic.id] && (
                      <div className="px-5 py-4 bg-white dark:bg-gray-800 rounded-b-lg">
                        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                          {topic.description}
                        </p>

                        <ul>
                          {topic.problems.map((problem) => (
                            <li
                              key={problem.id}
                              className="flex items-center justify-between py-1"
                            >
                              <a
                                href={problem.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline text-indigo-700 dark:text-indigo-400"
                              >
                                {problem.title}
                              </a>
                              <div className="flex items-center space-x-4">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    problem.difficulty === "Easy"
                                      ? "bg-green-200 text-green-800"
                                      : problem.difficulty === "Medium"
                                      ? "bg-yellow-200 text-yellow-800"
                                      : "bg-red-200 text-red-800"
                                  }`}
                                >
                                  {problem.difficulty}
                                </span>
                                <label className="inline-flex items-center cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={!!progress[problem.id]}
                                    onChange={() => toggleProgress(problem.id)}
                                    className="form-checkbox h-5 w-5 text-indigo-600"
                                  />
                                  <span className="ml-2 text-sm">
                                    Done
                                  </span>
                                </label>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
