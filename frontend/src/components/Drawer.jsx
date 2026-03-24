import React from "react";
import { LuX, LuLightbulb, LuBookOpen } from "react-icons/lu";

const Drawer = ({ isOpen, onClose, title, children, answerTips, quickNotes }) => {
  return (
    <div
      className={`fixed top-[80px] right-0 z-40 h-[calc(100vh-80px)] 
overflow-y-auto transition-transform bg-white w-full 
md:w-[480px] shadow-2xl shadow-cyan-800/10 border-l border-gray-200
${isOpen ? "translate-x-0" : "translate-x-full"}`}
      tabIndex="-1"
      aria-labelledby="drawer-right-label"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h5 id="drawer-right-label" className="text-base font-semibold text-black">
          {title}
        </h5>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center"
        >
          <LuX className="text-lg" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="px-4 py-4 mb-6 space-y-5">

        {/* Section 1: Explanation */}
        {children}

        {/* Section 2: Answer Tips */}
        {answerTips && answerTips.length > 0 && (
          <div className="bg-cyan-50 border border-cyan-100 rounded-lg px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <LuLightbulb className="text-cyan-600 text-sm" />
              <span className="text-xs font-semibold text-cyan-700 uppercase tracking-wide">
                How to Answer
              </span>
            </div>
            <ul className="space-y-2">
              {answerTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-cyan-900 leading-5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section 3: Quick Notes */}
        {quickNotes && quickNotes.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <LuBookOpen className="text-amber-500 text-sm" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                Quick Notes
              </span>
            </div>
            <ul className="space-y-2">
              {quickNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-amber-900 leading-5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};

export default Drawer;