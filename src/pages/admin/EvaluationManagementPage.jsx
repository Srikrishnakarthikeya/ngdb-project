import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Badge from '../../components/common/Badge';
import { Star, MessageSquare, Filter, User, Calendar, BarChart2 } from 'lucide-react';

const EvaluationManagementPage = () => {
  const { evaluations, events, participants, coordinators, getEvent, getParticipant, getCoordinator } = useData();

  const [selectedEventFilter, setSelectedEventFilter] = useState('ALL');

  // Compute analytics
  const filteredEvals = evaluations.filter((ev) =>
    selectedEventFilter === 'ALL' || ev.Event_ID === selectedEventFilter
  );

  const avgOverallScore = filteredEvals.length > 0
    ? (filteredEvals.reduce((acc, curr) => acc + Number(curr.Score), 0) / filteredEvals.length).toFixed(2)
    : '0.00';

  // Rating bucket distribution
  const scoreBuckets = {
    '5 Stars': filteredEvals.filter((e) => Number(e.Score) >= 4.8).length,
    '4.5 - 4.7': filteredEvals.filter((e) => Number(e.Score) >= 4.5 && Number(e.Score) < 4.8).length,
    '4.0 - 4.4': filteredEvals.filter((e) => Number(e.Score) >= 4.0 && Number(e.Score) < 4.5).length,
    'Below 4.0': filteredEvals.filter((e) => Number(e.Score) < 4.0).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-nitt-950">
            Participant Evaluation & Quality Assurance
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Quantitative scores, qualitative feedback, and curriculum evaluation for CA department events
        </p>
      </div>

      {/* Analytics Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-50 text-amber-600">
            <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Average Feedback Score
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-0.5">
              {avgOverallScore} <span className="text-base text-slate-400 font-normal">/ 5.0</span>
            </div>
            <span className="text-xs text-emerald-600 font-semibold">96% Positive Feedback</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-50 text-blue-600">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Total Reviews Submitted
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-0.5">
              {filteredEvals.length}
            </div>
            <span className="text-xs text-slate-500">From registered attendees</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block">
            Score Distribution Breakdown
          </span>
          <div className="space-y-1.5 text-xs">
            {Object.entries(scoreBuckets).map(([bucket, count]) => {
              const pct = filteredEvals.length > 0 ? (count / filteredEvals.length) * 100 : 0;
              return (
                <div key={bucket} className="flex items-center justify-between">
                  <span className="text-slate-600 w-24 text-[11px] font-medium">{bucket}</span>
                  <div className="flex-1 mx-2 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-bold text-slate-800 text-[11px] w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter by Event */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter Event:</span>
          <select
            value={selectedEventFilter}
            onChange={(e) => setSelectedEventFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
          >
            <option value="ALL">All Events</option>
            {events.map((e) => (
              <option key={e.Event_ID} value={e.Event_ID}>
                {e.Event_Name} ({e.Event_ID})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Showing {filteredEvals.length} evaluations
        </div>
      </div>

      {/* Evaluations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-600 text-[10px]">
              <tr>
                <th className="px-4 py-3 text-left">Evaluation ID (PK)</th>
                <th className="px-4 py-3 text-left">Participant (Participant_ID FK)</th>
                <th className="px-4 py-3 text-left">Event (Event_ID FK)</th>
                <th className="px-4 py-3 text-left">Evaluator (Evaluator_ID FK)</th>
                <th className="px-4 py-3 text-left">Rating Score</th>
                <th className="px-4 py-3 text-left">Qualitative Feedback</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredEvals.map((ev) => {
                const part = getParticipant(ev.Participant_ID);
                const evt = getEvent(ev.Event_ID);
                const coord = getCoordinator(ev.Evaluator_ID);

                return (
                  <tr key={ev.Evaluation_ID} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-amber-700">
                      {ev.Evaluation_ID}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 block">{part?.Name || ev.Participant_ID}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{ev.Participant_ID}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-800 max-w-[180px] truncate">
                      <span className="font-bold block truncate">{evt?.Event_Name || ev.Event_ID}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{ev.Event_ID}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">
                      <span className="font-semibold block">{coord?.Name || ev.Evaluator_ID}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{ev.Evaluator_ID}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 font-bold border border-amber-200 inline-flex items-center gap-1 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{ev.Score} / 5.0</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 max-w-xs italic text-[11px] leading-relaxed">
                      "{ev.Feedback}"
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                      {ev.Evaluation_Date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EvaluationManagementPage;
