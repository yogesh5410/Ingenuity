import React, { useState } from "react";
import { Mail, MapPin, Phone, Github, Linkedin } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("All fields are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email.");
      return;
    }

    setError("");
    setSuccess("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSuccess(""), 4000);
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Left: Contact Info */}
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">Get in Touch</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Got a question, suggestion, or looking to collaborate? Reach out to us — we’d love to hear from you.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-blue-500" />
              <p>ingenuity@iitbhilai.ac.in</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-green-500" />
              <p>+91 98765 43210</p>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-red-500" />
              <p>IIT Bhilai, GEC Campus, Sejbahar, Raipur - 492015</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 mt-6">
            <a href="https://github.com/IngenuityClub" target="_blank" rel="noopener noreferrer">
              <Github className="w-6 h-6 hover:text-black dark:hover:text-white" />
            </a>
            <a href="https://linkedin.com/company/ingenuity-iitbh" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-6 h-6 hover:text-blue-600" />
            </a>
          </div>

          {/* Role-based Contacts */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">Leadership Contacts</h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><span className="font-medium">Ankit Sharma</span> — President | ankit@iitbhilai.ac.in</p>
              <p><span className="font-medium">Priya Raj</span> — Tech Head | priya@iitbhilai.ac.in</p>
              <p><span className="font-medium">Rahul Yadav</span> — Event Coordinator | rahul@iitbhilai.ac.in</p>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-neutral-700 space-y-6"
        >
          <div>
            <label className="block mb-1 font-medium">Your Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Your Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
