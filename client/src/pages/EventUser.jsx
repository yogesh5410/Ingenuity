import React, { useState, useEffect } from "react";
import Axios from "../utils/axios.js";
import SummaryApi from "../common/summaryApi.js";
import Event from "./Event.jsx";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/axiosToastError.js";
import { useUser } from '../context/userContext';


const EventUser = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEventData, setEditingEventData] = useState(null);
  const { user, setUser } = useUser();
  const isAdmin = user?.role === "ADMIN";
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
        setLoadingEvents(true);
      const res = await Axios({ ...SummaryApi.getEvents });
      setEvents(res.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
    } finally {
      setLoadingEvents(false); // End loading
    }
  };

  const handleDelete = async (id) => {
    try {
      await Axios({ ...SummaryApi.deleteEvent, data: { id } });
      toast.success("Event deleted");
      fetchEvents();
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleEdit = (event) => {
    setEditingEventData(event);
    setShowForm(true);
  };

  const handleCreateEvent = () => {
    setEditingEventData(null);
    setShowForm(true);
  };

  useEffect(() => {
    const fetchUser = async () => {

        try {
          const res = await Axios({
            ...SummaryApi.userDetails,
          })
    
          if (res.data.success) {
            setUser(res.data.data);
          } 
        } catch (error) {
           //AxiosToastError(error)
        }
      }
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-800 dark:text-white drop-shadow">
              📅 Explore All Events
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Stay updated with the latest and upcoming events happening around you.
            </p>
          </div>

          {isAdmin && (<button
            onClick={handleCreateEvent}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md shadow transition-all text-sm"
          >
            ➕ Create New Event
          </button>)}
        </div>

        {/* 🔄 Loader */}
        {loadingEvents ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : showForm ? (
          <Event
            fetchEvents={fetchEvents}
            setShowForm={setShowForm}
            editingEventData={editingEventData}
          />
        ) : events.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div
                            key={event._id}
                            className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col transition hover:scale-[1.01]"
                        >
                            {/* Image */}
                            <div className="flex items-center justify-center w-full sm:w-auto">
                                <div className="relative max-w-xs w-36 h-56 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                    <img
                                        src={event.image || "/placeholder.jpg"}
                                        alt={event.name}
                                        className="max-h-full max-w-full object-contain"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/placeholder.jpg";
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col justify-between flex-grow">
                                <div>
                                    <h4 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-1">
                                        🎯 {event.name}
                                    </h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                                        📝 {event.desc}
                                    </p>

                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <p>
                                            🕒 <strong>Start:</strong>{" "}
                                            {new Date(event.start).toLocaleString()}
                                        </p>
                                        <p>
                                            🕓 <strong>End:</strong>{" "}
                                            {new Date(event.end).toLocaleString()}
                                        </p>
                                        <p>
                                            {event.mode === "offline" ? "🏫" : "💻"} <strong>Mode:</strong>{" "}
                                            {event.mode}
                                        </p>
                                        {event.mode === "offline" && (
                                            <p>
                                                📍 <strong>Location:</strong> {event.location}
                                            </p>
                                        )}
                                    </div>

                                    {event.links?.length > 0 && (
                                        <div className="mt-3">
                                            <p className="font-medium text-sm text-gray-700 dark:text-gray-200 mb-1">
                                                🔗 Links:
                                            </p>
                                            <ul className="space-y-1 text-sm">
                                                {event.links.map((link, idx) => (
                                                    <li key={idx}>
                                                        <a
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                                                        >
                                                            🌐 {link.title || "Link"}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Buttons */}
                                {isAdmin && (<div className="mt-5 flex gap-3">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-md text-sm"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event._id)}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md text-sm"
                                    >
                                        🗑 Delete
                                    </button>
                                </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

        )}
      </div>
    </div>
  );
};

export default EventUser;
