import React, { useEffect, useState } from 'react';
import {
  CalendarDays,
  Lock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Axios from '../utils/axios';
import SummaryApi from '../common/summaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/axiosToastError';

import { useUser } from '../context/userContext';

const PotdPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [potd, setPotd] = useState(null);
  const [hints, setHints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSolved, setIsSolved] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [verifing, setVerifing] = useState(false);

  const { user, setUser } = useUser();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const solvedDatesSet = new Set(user?.solvedDates || []);

  const [unlockedHints, setUnlockedHints] = useState([]);
  useEffect(() => {
    if (user?.todayHintUnlocks) {
      setUnlockedHints(user.todayHintUnlocks);
    }
  }, [user]);

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


  const updateUserData = async (data) => {
    try {
      const res = await Axios({
        ...SummaryApi.updateProgress,
        data: {
          email: data.email,
          todayHintDate: currentDate.toISOString().split('T')[0],
          todayHintUnlocks: data.todayHintUnlocks,
          solvedDates: data.solvedDates,
          points: data.points,
        },
      });
      if (res.data.success) {
        console.log('User data updated successfully');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchPotd = async (date) => {
    setIsLoading(true);
    try {
      const res = await Axios({
        method: SummaryApi.getPotd.method,
        url: `${SummaryApi.getPotd.url}/${date}`,
      });

      if (res.data.success) {
        const { title, problemLink, platform, difficulty, hints } = res.data.data;
        setPotd({ title, problemLink, platform, difficulty });
        setHints(hints);
        setIsSolved(solvedDatesSet.has(date));
      } else {
        setPotd(null);
        setHints([]);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setPotd(null);
        setHints([]);
      } else {
        AxiosToastError(error);
      }
    }
    setIsLoading(false);
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.getLeaderboard,
      });
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard || []);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleDateClick = (day) => {
    const selectedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
    const selected = new Date(selectedDate);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of today

    if (selected > todayEnd) {
      // Disable dates after today
      return;
    }

    setCurrentDate(selected);
    fetchPotd(selectedDate);
  };


  const goToPrevMonth = () => {
    const prevMonth = new Date(year, month - 1, 1);
    setCurrentDate(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(year, month + 1, 1);
    const today = new Date();
    if (nextMonth > today) {
      // Disable going to future months
      return;
    }
    setCurrentDate(nextMonth);
  };

  const handleMarkSolved = async () => {
    setVerifing(true);
    try {
      const res = await Axios({
        method: SummaryApi.checkSolved.method,
        url: SummaryApi.checkSolved.url,
        data: {
          problemLink: potd.problemLink,
          platform: potd.platform,
        },
      });

      if (res.data.success) {
        if (res.data.problemSolved) {
          toast.success('Marked as solved!');
          setIsSolved(res.data.problemSolved);
          const day = new Date().toISOString().split('T')[0];

          const updatedUser = {
            ...user,
            solvedDates: [...(user.solvedDates || []), day],
            points: (user.points) + 10,
          };

          setUser(updatedUser);

          await updateUserData(updatedUser);

          fetchLeaderboard();
        } else {
          toast.error('Problem not solved yet. Please try again later.');
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
    setVerifing(false);
  };

  const handleUnlockHint = (index) => {
    if (!unlockedHints.includes(index)) {
      if (user) {
        const updatedUser = {
          ...user,
          todayHintUnlocks: [...(user.todayHintUnlocks || []), index],
          points: user.points - hints[index].penalty,
        };

        setUnlockedHints([...unlockedHints, index]);
        setUser(updatedUser);
        updateUserData(updatedUser);
        fetchLeaderboard();
      } else {
        // Optional: show login prompt
        toast.error("Please log in to unlock hints.");
      }
    }
  };


  // New handler for locked hints (today only) to show unlock message
  const handleLocked = (penalty) => {
    toast(
      <div>
        Unlock this hint for <strong>{penalty} points</strong>?
        <button
          onClick={() => {
            toast.dismiss();
            // find the index of this penalty to unlock hint
            const idx = hints.findIndex((hint) => hint.penalty === penalty && !unlockedHints.includes(hints.indexOf(hint)));
            if (idx !== -1) {
              handleUnlockHint(idx);
            }
          }}
          className="ml-2 px-2 py-1 bg-blue-600 text-white rounded cursor-pointer"
        >
          Unlock
        </button>
      </div>,
      { duration: 4000 }
    );
  };

  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    fetchPotd(formattedToday);
    fetchLeaderboard();
  }, [user]);

  const today = new Date();
  const isToday =
    currentDate.getDate() === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  return (
    <div className="px-4 py-6 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <CalendarDays size={28} /> Problem of the Day
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - 2/3 Width */}
        <div className="md:col-span-2 space-y-6">
          {/* POTD Box */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 shadow-lg border border-blue-300 dark:border-blue-700">
            {isLoading ? (
              <p className="text-lg font-medium">Loading problem...</p>
            ) : potd ? (
              <>
                <a
                  href={potd.problemLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl font-bold text-blue-800 dark:text-blue-300 hover:underline"
                >
                  {potd.title}
                </a>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty: <strong>{potd.difficulty || 'N/A'}</strong> | Date: {currentDate.toDateString()}
                </p>
                <p className="text-md mb-4">Solve this to maintain your streak and earn points!</p>
                <button
                  onClick={handleMarkSolved}
                  disabled={isSolved || !isToday || verifing}
                  className={`px-4 py-2 font-semibold rounded-lg shadow-sm transition-colors duration-200 ${isSolved && isToday
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : !isToday
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : verifing
                          ? 'bg-yellow-500 text-white cursor-wait'
                          : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    }`}
                >
                  {isSolved && isToday
                    ? 'Solved ✅'
                    : !isToday
                      ? 'Not Today’s Problem'
                      : verifing
                        ? 'Verifying...'
                        : 'Mark as Solved'}
                </button>
              </>
            ) : (
              <p>No problem available for this date.</p>
            )}
          </div>

          {/* Hints Box */}
          {(hints.length > 0 && !isLoading) && (
            <div className="p-6 rounded-xl bg-yellow-100 dark:bg-yellow-900 shadow-lg border border-yellow-300 dark:border-yellow-700">
              <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-300 mb-4">💡 Hints</h2>
              <ul className="space-y-3">
                {hints.map((hint, idx) => {
                  if (isToday && !unlockedHints.includes(idx)) {
                    return (
                      <li
                        key={idx}
                        className="flex items-center gap-2 cursor-pointer text-yellow-700 dark:text-yellow-200 hover:text-yellow-600 dark:hover:text-yellow-100"
                        onClick={() => handleLocked(hint.penalty)}
                      >
                        <Lock size={18} /> Unlock Hint for <strong>{hint.penalty}</strong> points
                      </li>
                    );
                  }

                  return (
                    <li key={idx} className="text-md text-yellow-900 dark:text-yellow-100">
                      🔓 {hint.text}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Leaderboard */}
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">🏆 Leaderboard</h2>
            {leaderboard.length === 0 ? (
              <p>No one on the leaderboard yet.</p>
            ) : (
              <ul className="space-y-2">
                {leaderboard.map((entry, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600 pb-2"
                  >
                    <span className="font-medium">
                      {idx + 1}. {entry.name}
                    </span>
                    <span className="text-sm">{entry.points} pts</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column - 1/3 Width */}
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 h-fit sticky top-6">
          <div className="flex justify-between items-center mb-4">
            <button onClick={goToPrevMonth}>
              <ChevronLeft className="text-gray-700 dark:text-gray-200 hover:text-blue-500" />
            </button>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {currentDate.toLocaleString('default', { month: 'long' })} {year}
            </h3>
            <button onClick={goToNextMonth}>
              <ChevronRight className="text-gray-700 dark:text-gray-200 hover:text-blue-500" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-600 dark:text-gray-400 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="font-semibold">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day
                .toString()
                .padStart(2, '0')}`;
              const isSolvedDate = solvedDatesSet.has(formattedDate);
              const isTodayDate =
                today.getDate() === day &&
                today.getMonth() === month &&
                today.getFullYear() === year;

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`rounded-full p-2 cursor-pointer transition-all duration-150 ${isTodayDate
                      ? 'bg-blue-600 text-white font-bold'
                      : isSolvedDate
                        ? 'bg-green-500 text-white'
                        : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

};

export default PotdPage;
