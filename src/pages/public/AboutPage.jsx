import React from 'react';
import { GraduationCap, ShieldCheck, Award, Users, BookOpen, Cpu, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
          <GraduationCap className="w-4 h-4" />
          <span>NIT Trichy &bull; Est. 1964</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-nitt-950">
          Department of Computer Applications
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Pioneering computer science education, postgraduate research, and industry-collaborative engineering since its inception at National Institute of Technology, Tiruchirappalli.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-nitt-950">Department Vision</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To become a globally recognized center of excellence in computer applications through research, innovation, human values, and transformative technological leadership.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-nitt-950">Department Mission</h3>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Deliver high quality postgraduate computing education (MCA & M.Sc CS).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Promote cutting-edge research in Machine Learning, Cloud Systems, and Cyber Security.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Host high-impact national symposia, hackathons, and technical workshops.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Programs Offered */}
      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 space-y-6">
        <h3 className="text-xl font-bold text-nitt-950 text-center">Academic Programs & Strengths</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-extrabold text-blue-700 text-sm block">Master of Computer Applications (MCA)</span>
            <p className="text-slate-600">
              3-year / 2-year premier master program admitted through NIMCET nationwide entrance examination.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-extrabold text-emerald-700 text-sm block">M.Sc. in Computer Science</span>
            <p className="text-slate-600">
              Rigorous postgraduate program admitted via CCMN focusing on advanced computing, algorithms, and AI.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-extrabold text-amber-700 text-sm block">Ph.D. Doctoral Research</span>
            <p className="text-slate-600">
              Interdisciplinary doctoral research funded by Ministry of Education, IEEE, and industry research labs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
