import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import EmptyState from '../../components/common/EmptyState';
import { UtensilsCrossed, Bus, Calendar, Clock, CheckCircle, ShieldCheck } from 'lucide-react';

const StudentHospitalityPage = () => {
  const { currentUser } = useAuth();
  const { hospitality, getEvent } = useData();

  const studentId = currentUser?.id || 'PART-001';
  const myHospitality = hospitality.filter((h) => h.Participant_ID === studentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-nitt-950">
            Hospitality & Dining Passes
          </h1>
          {/* <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded font-mono">
            HOSPITALITY (1 : M)
          </span> */}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Authorized food passes, banquet luncheons, and campus transit arrangements
        </p>
      </div>

      {/* Cards Grid */}
      {myHospitality.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No hospitality passes assigned"
          description="Your catering and transportation passes will appear here once your event attendance is registered."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myHospitality.map((hosp) => {
            const evt = getEvent(hosp.Event_ID);

            return (
              <div
                key={hosp.Hospitality_ID}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Visual Top Band */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Pass Code
                      </span>
                      <p className="text-xs font-mono font-bold text-slate-800">
                        {hosp.Hospitality_ID}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Pass</span>
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Event Name:</span>
                    <p className="font-bold text-nitt-950 text-sm">
                      {evt?.Event_Name || hosp.Event_ID}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Meal Arrangement:</span>
                      <span className="font-bold text-slate-900">{hosp.Meal_Type}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Valid Date:</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {hosp.Date}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500 font-medium">Transit Logistics:</span>
                      <span className="font-bold text-blue-700 flex items-center gap-1">
                        <Bus className="w-3.5 h-3.5 text-blue-600" />
                        {hosp.Transport_Provided}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 italic">
                  Show this digital pass at the Mega Mess / Dining Hall entrance.
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentHospitalityPage;
