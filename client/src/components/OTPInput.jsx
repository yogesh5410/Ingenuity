import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * OTPInput component
 * Props:
 * - length: number of digits (default 6)
 * - value: controlled string value (optional)
 * - onChange: (value: string) => void
 * - onComplete: (value: string) => void when value reaches length
 * - disabled: boolean
 * - autoFocus: boolean
 * - className / inputClassName: style overrides
 */
export default function OTPInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  disabled = false,
  autoFocus = true,
  className = "",
  inputClassName = "",
}) {
  const initial = useMemo(() => Array.from({ length }, (_, i) => value[i] || ""), [length, value]);
  const [digits, setDigits] = useState(initial);
  const inputsRef = useRef([]);

  // Keep local state in sync with external value length/changes
  useEffect(() => {
    const next = Array.from({ length }, (_, i) => value[i] || "");
    setDigits(next);
  }, [value, length]);

  useEffect(() => {
    if (!disabled && autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [disabled, autoFocus]);

  const joined = digits.join("");

  useEffect(() => {
    if (onChange) onChange(joined);
    if (onComplete && joined.length === length) onComplete(joined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined]);

  const setAt = (idx, val) => {
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
  };

  const focusAt = (idx) => {
    const el = inputsRef.current[idx];
    if (el) el.focus();
  };

  const handleInput = (idx, e) => {
    const raw = e.target.value;
    const num = raw.replace(/\D/g, "");
    if (!num) {
      setAt(idx, "");
      return;
    }
    if (num.length === 1) {
      setAt(idx, num);
      if (idx < length - 1) focusAt(idx + 1);
      return;
    }
    // If user types/pastes multiple digits into a single box
    const chars = num.slice(0, length - idx).split("");
    const next = [...digits];
    chars.forEach((c, i) => (next[idx + i] = c));
    setDigits(next);
    const lastIdx = Math.min(idx + chars.length, length - 1);
    focusAt(lastIdx);
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[idx]) {
        setAt(idx, "");
        return;
      }
      if (idx > 0) {
        setAt(idx - 1, "");
        focusAt(idx - 1);
      }
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (idx > 0) focusAt(idx - 1);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (idx < length - 1) focusAt(idx + 1);
      return;
    }
    if (e.key === "Enter") {
      if (onComplete && joined.length === length) {
        onComplete(joined);
      }
      return;
    }
  };

  const handlePaste = (e) => {
    if (disabled) return;
    const text = (e.clipboardData || window.clipboardData).getData("text");
    if (!text) return;
    e.preventDefault();
    const clean = text.replace(/\D/g, "").slice(0, length);
    if (!clean) return;
    const next = Array.from({ length }, (_, i) => clean[i] || "");
    setDigits(next);
    focusAt(Math.min(clean.length, length) - 1);
  };

  return (
    <div
      className={`flex items-center justify-between gap-2 ${className}`}
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={digits[i]}
          onChange={(e) => handleInput(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className={`w-11 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 shadow-sm hover:shadow ${
            disabled ? "opacity-60" : ""
          } ${inputClassName}`}
        />
      ))}
    </div>
  );
}
