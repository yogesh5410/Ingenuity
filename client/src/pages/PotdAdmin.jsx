import React, { useState, useEffect } from 'react';
import { CalendarDays, Trash, Plus } from 'lucide-react';
import Axios from '../utils/axios';
import SummaryApi, { baseURL } from '../common/summaryApi.js';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/axiosToastError';

const PotdAdmin = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [mode, setMode] = useState('create');
  const [formData, setFormData] = useState({
    title: '',
    problemLink: '',
    platform: '', 
    hints: [{ id: 1, text: '', penalty: 1 }],
  });

  const fetchPotd = async (date) => {
    try {
      const res = await Axios({
        baseURL,
        method: SummaryApi.getPotd.method,
        url: `${SummaryApi.getPotd.url}/${date}`,
      });

      if (res.data.success) {
        const { title, problemLink, platform, hints } = res.data.data;
        const formattedHints = hints.map((h, idx) => ({ id: idx + 1, ...h }));
        setFormData({ title, problemLink, platform, hints: formattedHints });
        setMode('edit');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setFormData({ title: '', problemLink: '', platform: '', hints: [{ id: 1, text: '', penalty: 1 }] });
        setMode('create');
      } else {
        AxiosToastError(error);
      }
    }
  };

  useEffect(() => {
    if (selectedDate) fetchPotd(selectedDate);
  }, [selectedDate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleHintChange = (id, key, value) => {
    setFormData((prev) => ({
      ...prev,
      hints: prev.hints.map((h) => (h.id === id ? { ...h, [key]: value } : h)),
    }));
  };

  const addHint = () => {
    const newId = formData.hints.length ? formData.hints[formData.hints.length - 1].id + 1 : 1;
    setFormData((prev) => ({ ...prev, hints: [...prev.hints, { id: newId, text: '', penalty: 1 }] }));
  };

  const removeHint = (id) => {
    setFormData((prev) => ({ ...prev, hints: prev.hints.filter((h) => h.id !== id) }));
  };

  const handleSubmit = async () => {
    const payload = {
      title: formData.title,
      problemLink: formData.problemLink,
      platform: formData.platform,
      hints: formData.hints.map(({ id, ...rest }) => rest),
      date: selectedDate,
    };

    try {
      if (mode === 'create') {
        const res = await Axios({
          baseURL,
          method: SummaryApi.createPotd.method,
          url: SummaryApi.createPotd.url,
          data: payload,
        });
        if (res.data.success) {
          toast.success('POTD created!');
          setMode('edit');
        }
      } else {
        const res = await Axios({
          baseURL,
          method: SummaryApi.updatePotd.method,
          url: `${SummaryApi.updatePotd.url}/${selectedDate}`,
          data: payload,
        });
        if (res.data.success) {
          toast.success('POTD updated!');
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this POTD?')) return;

    try {
      const res = await Axios({
        baseURL,
        method: SummaryApi.deletePotd?.method || 'DELETE',
        url: `${SummaryApi.deletePotd?.url || '/api/potd/delete'}/${selectedDate}`,
      });

      if (res.data.success) {
        toast.success('POTD deleted!');
        setFormData({ title: '', problemLink: '', platform: '', hints: [{ id: 1, text: '', penalty: 1 }] });
        setMode('create');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
        <CalendarDays size={24} /> Admin Panel - {mode === 'create' ? 'Set' : 'Edit'} POTD
      </h1>

      <div className="mb-6">
        <label className="block font-semibold mb-1">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-3 rounded-md border dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      {selectedDate && (
        <div className="space-y-4 mb-6">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Problem Title"
            className="w-full p-3 rounded-md border dark:bg-gray-800 dark:border-gray-700"
          />
          <input
            type="text"
            name="problemLink"
            value={formData.problemLink}
            onChange={handleChange}
            placeholder="Problem Link"
            className="w-full p-3 rounded-md border dark:bg-gray-800 dark:border-gray-700"
          />
          {/* ✅ Replaced difficulty with platform dropdown */}
          <select
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            className="w-full p-3 rounded-md border dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">Select Platform</option>
            <option value="Codeforces">Codeforces</option>
            <option value="LeetCode">LeetCode</option>
          </select>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">💡 Hints</h2>
        {formData.hints.map((hint) => (
          <div
            key={hint.id}
            className="flex items-center gap-3 mb-3 bg-yellow-50 dark:bg-yellow-900 p-3 rounded-md"
          >
            <input
              type="text"
              placeholder={`Hint ${hint.id}`}
              value={hint.text}
              onChange={(e) => handleHintChange(hint.id, 'text', e.target.value)}
              className="flex-1 p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
            />
            <input
              type="number"
              min={0}
              value={hint.penalty}
              onChange={(e) => handleHintChange(hint.id, 'penalty', Number(e.target.value))}
              className="w-20 p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
              title="Penalty"
            />
            <button
              onClick={() => removeHint(hint.id)}
              className="text-red-600 dark:text-red-400 hover:text-red-800"
              title="Remove hint"
            >
              <Trash size={20} />
            </button>
          </div>
        ))}
        <button
          onClick={addHint}
          className="cursor-pointer mt-2 px-4 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded hover:bg-yellow-500 flex items-center gap-2"
        >
          <Plus size={16} /> Add Hint
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSubmit}
          className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
        >
          {mode === 'create' ? 'Create POTD' : 'Update POTD'}
        </button>

        {mode === 'edit' && (
          <button
            onClick={handleDelete}
            className="cursor-pointer px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold"
          >
            Delete POTD
          </button>
        )}
      </div>
    </div>
  );
};

export default PotdAdmin;
