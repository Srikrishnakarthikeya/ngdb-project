import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { Star, Send, CheckCircle2, MessageSquare, Calendar } from 'lucide-react';

const StudentFeedbackPage = () => {
  const { currentUser } = useAuth();
  const { registrations, events, evaluations, submitEvaluation, getEvent } = useData();
  const { showToast } = useToast();

  const studentId = currentUser?.id || 'PART-001';

  // Find all events registered by the student
  const registeredEventIds = [...new Set(registrations.filter((r) => r.Participant_ID === studentId).map((r) => r.Event_ID))];
  const registeredEvents = events.filter((e) => registeredEventIds.includes(e.Event_ID));

  const myEvaluations = evaluations.filter((ev) => ev.Participant_ID === studentId);

  const [selectedEventId, setSelectedEventId] = useState(registeredEvents[0]?.Event_ID || '');
  const [ratings, setRatings] = useState({
    overall: 5,
    organization: 5,
    contentQuality: 5,
    venueAndHospitality: 5
  });
  const [comments, setComments] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      showToast('Please select an event to submit feedback.', 'error');
      return;
    }

    const avgScore = Number(
      ((ratings.overall + ratings.organization + ratings.contentQuality + ratings.venueAndHospitality) / 4).toFixed(1)
    );

    const newEval = submitEvaluation({
      Participant_ID: studentId,
      Event_ID: selectedEventId,
      Evaluator_ID: 'COORD-01',
      Score: avgScore,
      RatingCategories: { ...ratings },
      Feedback: comments
    });

    showToast(`Feedback submitted! Evaluation ID: ${newEval.Evaluation_ID}`, 'success');
    setComments('');
  };

  const renderStars = (category, currentVal) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRatings({ ...ratings, [category]: star })}
            className="p-1 hover:scale-125 transition-transform"
          >
            <Star
              className={`w-5 h-5 ${
                star <= currentVal
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 font-bold text-slate-700 text-xs">{currentVal} / 5</span>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-nitt-950">
            Event Feedback & Evaluation
          </h1>
          {/* <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded font-mono">
            EVALUATION (M : N)
          </span> */}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Provide your honest evaluation for attended events to help NIT Trichy maintain high academic standards
        </p>
      </div>

      {/* Main Feedback Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-bold text-nitt-950 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          <span>Submit Evaluation for Attended Event</span>
        </h2>

        {registeredEvents.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
            You must be registered for at least one event to submit an evaluation.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                Select Event (Enrolled Events Only)
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {registeredEvents.map((evt) => (
                  <option key={evt.Event_ID} value={evt.Event_ID}>
                    {evt.Event_Name} ({evt.Event_ID}) &bull; {evt.Event_Type}
                  </option>
                ))}
              </select>
            </div>

            {/* 4 Multi-criteria Rating Tracks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 bg-slate-50/80 rounded-xl border border-slate-200">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 block">Overall Experience</span>
                {renderStars('overall', ratings.overall)}
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 block">Event Organization & Logistics</span>
                {renderStars('organization', ratings.organization)}
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 block">Content Quality & Keynotes</span>
                {renderStars('contentQuality', ratings.contentQuality)}
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 block">Venue Facilities & Hospitality</span>
                {renderStars('venueAndHospitality', ratings.venueAndHospitality)}
              </div>
            </div>

            {/* Comments Box */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                Comments & Qualitative Suggestions
              </label>
              <textarea
                rows={4}
                required
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share your thoughts on lab sessions, speaker depth, catering, and ideas for future editions..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" type="submit" icon={Send} size="md">
                Submit Feedback (Save Evaluation)
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Previously Submitted Evaluations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-nitt-950 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <span>My Submitted Evaluations ({myEvaluations.length})</span>
        </h3>

        {myEvaluations.length === 0 ? (
          <p className="text-xs text-slate-500">No evaluations submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {myEvaluations.map((ev) => {
              const evt = getEvent(ev.Event_ID);

              return (
                <div
                  key={ev.Evaluation_ID}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-nitt-950 text-sm">
                      {evt?.Event_Name || ev.Event_ID}
                    </span>
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{ev.Score} / 5.0</span>
                    </span>
                  </div>

                  <p className="text-slate-600 italic">"{ev.Feedback}"</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200">
                    <span className="font-mono">ID: {ev.Evaluation_ID}</span>
                    <span>Date: {ev.Evaluation_Date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFeedbackPage;
