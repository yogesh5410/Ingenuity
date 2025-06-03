import React, { useState, useEffect } from "react";
import Axios from "../utils/axios.js";
import SummaryApi from "../common/summaryApi.js";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/axiosToastError";
import uploadImage from "../utils/uploadImage";
import {
  Trash2,
  Plus,
  MapPin,
  PartyPopper,
  Link,
  Clock,
  Edit3,
  ImagePlus,
} from "lucide-react";

const Event = ({ fetchEvents, setShowForm, editingEventData }) => {
  const [eventMode, setEventMode] = useState("online");
  const [eventLinks, setEventLinks] = useState([{ title: "", url: "" }]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(editingEventData);

  const [form, setForm] = useState({
    eventName: "",
    startTime: "",
    endTime: "",
    description: "",
    location: "",
    image: "",
  });

  useEffect(() => {
    if (editingEvent) {
      setForm({
        eventName: editingEvent.name || "",
        startTime: editingEvent.start
          ? new Date(editingEvent.start).toISOString().slice(0, 16)
          : "",
        endTime: editingEvent.end
          ? new Date(editingEvent.end).toISOString().slice(0, 16)
          : "",
        description: editingEvent.desc || "",
        location: editingEvent.location || "",
        image: editingEvent.image || "",
      });
      setEventMode(editingEvent.mode || "online");
      setEventLinks(editingEvent.links || [{ title: "", url: "" }]);
      setImagePreview(editingEvent.image || null);
    }
  }, [editingEvent]);

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const ImageUrl = await uploadImage(file);
    setLoading(false);

    setImagePreview(URL.createObjectURL(file));
    setForm((prev) => ({
      ...prev,
      image: ImageUrl.data.data.secure_url,
    }));
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...eventLinks];
    updatedLinks[index][field] = value;
    setEventLinks(updatedLinks);
  };

  const addEventLink = () => {
    setEventLinks([...eventLinks, { title: "", url: "" }]);
  };

  const removeEventLink = (index) => {
    setEventLinks(eventLinks.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      id: editingEvent?._id || null,
      name: form.eventName,
      start: form.startTime,
      end: form.endTime,
      desc: form.description,
      location: form.location,
      mode: eventMode,
      links: eventLinks,
      image: form.image,
    };

    try {
      if (editingEvent) {
        await Axios({ ...SummaryApi.updateEvent, data: payload });
        toast.success("Event updated");
      } else {
        await Axios({ ...SummaryApi.createEvent, data: payload });
        toast.success("Event created");
      }

      fetchEvents();
      resetForm();
      setShowForm(false);
    } catch (err) {
      AxiosToastError(err);
    }
  };

  const resetForm = () => {
    setForm({
      eventName: "",
      startTime: "",
      endTime: "",
      description: "",
      location: "",
      image: "",
    });
    setEventMode("online");
    setEventLinks([{ title: "", url: "" }]);
    setImagePreview(null);
    setEditingEvent(null);
  };

  return (
    <div className="bg-blue-100 dark:bg-gray-900 dark:text-white min-h-screen py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-600 p-6 rounded-lg shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-400">
          {editingEvent ? "Edit Event" : "Create New Event"}
        </h2>

        <div className="flex gap-4 justify-center">
          {["online", "offline"].map((mode) => (
            <button
              type="button"
              key={mode}
              onClick={() => setEventMode(mode)}
              className={`px-4 py-2 rounded-lg font-semibold border ${
                eventMode === mode
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <div>
          <label className="flex items-center gap-2 font-semibold">
            <Edit3 size={18} /> Event Name
          </label>
          <input
            type="text"
            name="eventName"
            value={form.eventName}
            onChange={handleChange}
            required
            placeholder="e.g., CodeRush"
            className="w-full mt-1 px-4 py-2 border rounded-md"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 font-semibold">
              <Clock size={18} /> Start Time
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 font-semibold">
              <Clock size={18} /> End Time
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 font-semibold">
            <PartyPopper size={18} /> Description
          </label>
          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 font-semibold">
            <MapPin size={18} /> Location (Only if Offline)
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 font-semibold">
            <ImagePlus size={18} /> Event Banner
          </label>
          <input type="file" accept="image/*" onChange={handleUploadImage} />
          {loading && <p className="text-sm text-blue-500 mt-1">Uploading image...</p>}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-full max-w-xs max-h-60 object-contain"
            />
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 font-semibold">
            <Link size={18} /> Event Links
          </label>
          {eventLinks.map((link, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Title"
                value={link.title}
                onChange={(e) => handleLinkChange(index, "title", e.target.value)}
                className="w-1/3 px-3 py-2 border rounded"
              />
              <input
                type="url"
                placeholder="https://link.com"
                value={link.url}
                onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                className="w-2/3 px-3 py-2 border rounded"
              />
              <button type="button" onClick={() => removeEventLink(index)}>
                <Trash2 className="text-red-500" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addEventLink} className="mt-2 text-blue-600">
            <Plus size={16} /> Add Link
          </button>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-gray-600 dark:text-white hover:underline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition font-semibold"
          >
            {editingEvent ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Event;
