import React from "react";
import { Users, Target, Trophy, Lightbulb } from "lucide-react";

const coordinators = [
  {
    name: "Ankit Sharma",
    role: "President | Expert on Codeforces",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Priya Raj",
    role: "Tech Lead | 5⭐ on CodeChef",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    linkedin: "#",
    github: "#",
  },
];

const coreMembers = [
  { name: "Rahul Yadav", role: "Event Manager | Specialist", img: "https://randomuser.me/api/portraits/men/12.jpg" },
  { name: "Sneha Gupta", role: "Core Member | Problem Setter", img: "https://randomuser.me/api/portraits/women/22.jpg" },
  { name: "Karan Verma", role: "Core Member | Backend Dev", img: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Aisha Khan", role: "Core Member | Frontend Dev", img: "https://randomuser.me/api/portraits/women/30.jpg" },
  { name: "Vikram Singh", role: "Core Member | Designer", img: "https://randomuser.me/api/portraits/men/28.jpg" },
  { name: "Neha Patel", role: "Core Member | Content Creator", img: "https://randomuser.me/api/portraits/women/15.jpg" },
  { name: "Rohit Joshi", role: "Core Member | Tester", img: "https://randomuser.me/api/portraits/men/37.jpg" },
];

export default function About() {
  return (
    <div className="min-h-screen px-6 py-16 bg-gradient-to-tr from-gray-50 via-white to-gray-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 text-gray-900 dark:text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* Header */}
        <header className="text-center max-w-3xl mx-auto space-y-5">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight text-blue-700 dark:text-blue-400 drop-shadow-md">
            About <span className="text-indigo-600 dark:text-indigo-400">Ingenuity</span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            We are a passionate community of problem solvers, coding enthusiasts, and algorithmic explorers from IIT Bhilai, united under one goal — to foster a strong culture of Competitive Programming.
          </p>
        </header>

        {/* Illustration */}
        {/* <div className="flex justify-center">
          <img
            src="https://www.svgrepo.com/show/427362/programming-coding.svg"
            alt="Competitive Programming Illustration"
            className="w-full max-w-4xl drop-shadow-2xl"
            loading="lazy"
          />
        </div> */}

        {/* Vision & Mission */}
        <section className="grid sm:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {[
            {
              Icon: Lightbulb,
              title: "Our Vision",
              color: "text-yellow-500",
              description:
                "To become a nationally recognized hub for competitive programming, innovation, and technical excellence, preparing students for the toughest coding contests and top-tier placements.",
            },
            {
              Icon: Target,
              title: "Our Mission",
              color: "text-red-500",
              description:
                "To inspire and support coders through daily practice, contests, workshops, mentorship, and engaging events that challenge the mind and sharpen problem-solving skills.",
            },
          ].map(({ Icon, title, color, description }) => (
            <div
              key={title}
              className="bg-white dark:bg-neutral-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow border border-gray-200 dark:border-neutral-700"
            >
              <div className="flex items-center gap-4 mb-5">
                <Icon className={`w-8 h-8 ${color}`} />
                <h2 className="text-2xl font-semibold">{title}</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
            </div>
          ))}
        </section>

        {/* Achievements */}
        <section className="max-w-5xl mx-auto bg-white dark:bg-neutral-800 p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center gap-4 mb-5">
            <Trophy className="w-8 h-8 text-green-500" />
            <h2 className="text-2xl font-semibold">Our Achievements</h2>
          </div>
          <ul className="list-disc pl-8 space-y-2 text-gray-700 dark:text-gray-300 text-lg">
            <li>Conducted 20+ contests with 500+ participants.</li>
            <li>Hosted Codeforces-based coding leagues & story-based CP RPGs.</li>
            <li>Mentored juniors to reach Specialist and above on Codeforces.</li>
            <li>Built in-house platforms like POTD leaderboard and CP resource hub.</li>
          </ul>
        </section>

        {/* Team Section */}
        {/* <section className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Users className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Meet the Team</h2>
          </div> */}

          {/* Coordinators */}
          {/* <h3 className="text-2xl font-semibold mb-6">Coordinators</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14">
            {coordinators.map(({ name, role, img, linkedin, github }) => (
              <div
                key={name}
                className="group relative bg-white dark:bg-neutral-900 p-6 rounded-3xl shadow-lg border border-gray-200 dark:border-neutral-700 hover:shadow-2xl transition-shadow cursor-pointer"
              >
                <img
                  src={img}
                  alt={name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-blue-500 group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <h4 className="text-xl font-semibold text-center mb-1">{name}</h4>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-4">{role}</p>

                <div className="flex justify-center space-x-6 text-gray-500 dark:text-gray-400 opacity-70 group-hover:opacity-100 transition-opacity">
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} LinkedIn`}
                    className="hover:text-blue-700"
                  > */}
                    {/* LinkedIn SVG icon */}
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M4.98 3.5c0 1.381-1.116 2.5-2.49 2.5-1.373 0-2.49-1.119-2.49-2.5S1.117 1 2.49 1 4.98 2.119 4.98 3.5zM.5 6.75h4.98v14H.5v-14zM8.03 6.75h4.784v1.91h.068c.668-1.27 2.303-2.612 4.738-2.612 5.072 0 6.005 3.337 6.005 7.67v8.03h-5v-7.113c0-1.7-.031-3.888-2.37-3.888-2.37 0-2.734 1.855-2.734 3.77v7.23H8.03v-14z" />
                    </svg>
                  </a>
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} GitHub`}
                    className="hover:text-gray-900 dark:hover:text-white"
                  > */}
                    {/* GitHub SVG icon */}
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M12 .297c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61C4.422 17.07 3.633 16.7 3.633 16.7c-1.087-.744.083-.729.083-.729 1.205.085 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.304 3.495.997.108-.775.42-1.305.763-1.605-2.665-.305-5.466-1.335-5.466-5.933 0-1.31.467-2.38 1.235-3.22-.124-.303-.536-1.525.117-3.176 0 0 1.008-.322 3.3 1.23a11.49 11.49 0 013.003-.404c1.02.005 2.046.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23.654 1.651.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.804 5.625-5.476 5.921.43.372.823 1.104.823 2.227 0 1.607-.015 2.903-.015 3.296 0 .32.217.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div> */}

          {/* Core Members */}
          {/* <h3 className="text-2xl font-semibold mb-6">Core Members</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {coreMembers.map(({ name, role, img }) => (
              <div
                key={name}
                className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-md border border-gray-200 dark:border-neutral-700 hover:shadow-xl transition-shadow cursor-default"
              >
                <img
                  src={img}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-indigo-500"
                  loading="lazy"
                />
                <h4 className="text-lg font-semibold text-center">{name}</h4>
                <p className="text-center text-gray-600 dark:text-gray-400 text-sm">{role}</p>
              </div>
            ))}
          </div>
        </section> */}
      </div>
    </div>
  );
}
