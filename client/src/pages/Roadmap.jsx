import React from "react";
import { Trophy, BookOpen, Cpu, Puzzle, GitBranch, Activity } from "lucide-react";

const tiers = [
  {
    title: "Newbie",
    color: "bg-blue-600",
    icon: <BookOpen className="w-6 h-6" />,
    description:
      "Basics of programming and problem solving. Get familiar with syntax and simple algorithms.",
    topics: [
      "Basic Syntax (Variables, Loops, Conditionals)",
      "Input/Output Handling",
      "Basic Math & Number Theory",
      "Simple Implementation Problems",
      "Arrays and Strings",
    ],
  },
  {
    title: "Pupil",
    color: "bg-green-600",
    icon: <Cpu className="w-6 h-6" />,
    description:
      "Learn fundamental algorithms and data structures. Start solving beginner CP problems.",
    topics: [
      "Sorting Algorithms (Bubble, Selection, Insertion)",
      "Searching (Linear & Binary Search)",
      "Basic Data Structures (Stacks, Queues, Lists)",
      "Introduction to STL (Vectors, Sets, Maps)",
      "Basic Greedy Algorithms",
      "Two Pointers Technique",
    ],
  },
  {
    title: "Specialist",
    color: "bg-yellow-600",
    icon: <Puzzle className="w-6 h-6" />,
    description:
      "Intermediate algorithms & data structures. Master greedy, sorting & searching variants.",
    topics: [
      "Greedy Algorithms Advanced",
      "Binary Search on Answer & Parameters",
      "Sorting with Custom Comparators",
      "Prefix Sums & Sliding Window",
      "Basic Graph Theory (DFS, BFS)",
      "Recursion & Backtracking",
      "Simple Dynamic Programming",
    ],
  },
  {
    title: "Expert",
    color: "bg-red-600",
    icon: <Activity className="w-6 h-6" />,
    description:
      "Advanced graph theory and dynamic programming. Solve complex and mixed problems.",
    topics: [
      "Advanced Dynamic Programming (DP on Trees, Bitmask DP)",
      "Graph Algorithms (Dijkstra, MST, Topological Sort)",
      "Data Structures (Segment Trees, Fenwick Trees)",
      "String Algorithms (KMP, Trie, Z-Algorithm)",
      "Mathematical Algorithms (Combinatorics, Number Theory)",
      "Game Theory Basics",
    ],
  },
  {
    title: "Candidate Master",
    color: "bg-purple-700",
    icon: <Trophy className="w-6 h-6" />,
    description:
      "Expert-level problem solving with deep theory and optimization techniques.",
    topics: [
      "Heavy-Light Decomposition",
      "Advanced Graph Algorithms (2-SAT, Network Flow)",
      "Advanced Data Structures (Persistent Segment Trees, Suffix Automata)",
      "Mathematical Optimization & Number Theory",
      "Computational Geometry",
      "Advanced Game Theory & DP",
    ],
  },
];

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-100 dark:text-gray-200 p-6 transition-colors duration-500">
      <h1 className="text-4xl font-extrabold mb-10 text-center drop-shadow-lg dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
        Codeforces Competitive Programming Roadmap
      </h1>

      <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map(({ title, color, icon, description, topics }) => (
          <div
            key={title}
            className={`rounded-xl shadow-2xl p-6 flex flex-col bg-gradient-to-tr ${color} dark:from-opacity-90 dark:to-opacity-90 dark:bg-opacity-90
              hover:scale-[1.03] transition-transform duration-300 cursor-pointer`}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="text-white">{icon}</div>
              <h2 className="text-2xl font-bold text-white dark:text-gray-100">{title}</h2>
            </div>
            <p className="mb-5 text-gray-200 dark:text-gray-300 font-medium leading-relaxed">{description}</p>
            <h3 className="font-semibold mb-3 text-gray-300 dark:text-gray-400">Topics & Skills</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-100 dark:text-gray-200 flex-grow">
              {topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 max-w-3xl mx-auto text-center text-gray-300 dark:text-gray-400 italic text-sm select-none">
        Start from <span className="font-semibold">Newbie</span> and gradually progress through <span className="font-semibold">Pupil</span>, <span className="font-semibold">Specialist</span>, <span className="font-semibold">Expert</span>, and <span className="font-semibold">Candidate Master</span>.  
        Practice regularly on Codeforces and other competitive programming platforms to level up your skills.
      </div>
    </div>
  );
}
