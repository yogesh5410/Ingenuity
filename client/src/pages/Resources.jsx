import React from "react";
import { BookOpen, Video, Globe, FileText, Layers } from "lucide-react";

const resourcesData = [
  {
    category: "📘 Books & PDFs",
    icon: <BookOpen className="w-6 h-6" />,
    items: [
      {
        name: "Competitive Programming (Steven & Felix Halim)",
        link: "https://pdfcoffee.com/competitive-programming-3pdf-pdf-free.html",
        description: "A go-to book for mastering competitive programming with practical problems."
      },
      {
        name: "Programming Challenges (Steven Skiena)",
        link: "https://archive.org/details/programmingchall0000skie",
        description: "Classic training manual with real contest problems."
      },
      {
        name: "Love Babbar DSA Cracker Sheet PDF",
        link: "https://pdfcoffee.com/love-babbar-dsa-cracker-sheet-pdf-free.html",
        description: "Popular DSA sheet with curated questions for placements and CP."
      }
    ]
  },
  {
    category: "🧠 CP Sheets & Guides",
    icon: <Layers className="w-6 h-6" />,
    items: [
      {
        name: "Striver's SDE Sheet",
        link: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/",
        description: "One of the most used coding interview prep sheets."
      },
      {
        name: "CP-31 by Eleminator",
        link: "https://www.tle-eliminators.com/cp-sheet",
        description: "Curated sheet for competitive programming with topic-wise problems."
      },
      {
        name: "A2OJ Ladders",
        link: "https://codeforces.com/blog/entry/57282",
        description: "Level-wise problem ladders for CP improvement."
      }
    ]
  },
  {
    category: "🌐 Indian Tutorial Platforms",
    icon: <Globe className="w-6 h-6" />,
    items: [
      {
        name: "GeeksforGeeks",
        link: "https://www.geeksforgeeks.org/",
        description: "Extensive tutorials, problems, and interview prep."
      },
      {
        name: "CodeChef Learn",
        link: "https://www.codechef.com/learn",
        description: "Learn CP fundamentals from India’s premier platform."
      },
      {
        name: "NPTEL Algorithms Course",
        link: "https://nptel.ac.in/courses/106106131",
        description: "Govt. of India video course for Algorithms & Data Structures."
      }
    ]
  },
  {
    category: "🎥 YouTube Channels",
    icon: <Video className="w-6 h-6" />,
    items: [
      {
        name: "Striver (Take U Forward)",
        link: "https://www.youtube.com/@takeUforward",
        description: "Interview and DSA-focused videos."
      },
      {
        name: "CodeChef Official",
        link: "https://www.youtube.com/@CodeChef1",
        description: "Editorials, contests, and coding bootcamps."
      },
      {
        name: "Errichto",
        link: "https://www.youtube.com/c/Errichto",
        description: "Popular coach known for advanced CP problem-solving."
      }
    ]
  },
  {
    category: "💻 Practice Platforms",
    icon: <FileText className="w-6 h-6" />,
    items: [
      {
        name: "Codeforces",
        link: "https://codeforces.com/",
        description: "Most active CP platform with frequent rated contests."
      },
      {
        name: "CodeChef",
        link: "https://www.codechef.com/",
        description: "India-based CP site with long and lunchtime contests."
      },
      {
        name: "LeetCode",
        link: "https://leetcode.com/",
        description: "Great for DSA and interview prep with real company questions."
      }
    ]
  }
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-200 dark:from-zinc-900 dark:to-indigo-950 p-6 md:p-12">
      <h1 className="text-4xl font-bold mb-12 text-center text-indigo-800 dark:text-indigo-300">
        🔗 CP Resources – IIT Bhilai
      </h1>

      <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {resourcesData.map(({ category, icon, items }) => (
          <section
            key={category}
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-indigo-100 dark:border-zinc-700 p-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
              {icon}
              <h2 className="text-xl font-semibold">{category}</h2>
            </div>

            <ul className="space-y-4 flex-grow overflow-auto">
              {items.map(({ name, link, description }) => (
                <li key={name} className="group">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-lg font-medium text-indigo-800 dark:text-indigo-300 hover:underline"
                  >
                    {name}
                  </a>
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition">
                    {description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
