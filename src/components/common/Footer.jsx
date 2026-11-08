import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-nitt-950 text-slate-300 pt-14 pb-8 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Institute Profile */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-nitt-800 flex items-center justify-center text-amber-400 border border-amber-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base block tracking-tight">
                  NIT Trichy
                </span>
                <span className="text-xs text-amber-400 font-medium">
                  Department of CA
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Established in 1964, National Institute of Technology Tiruchirappalli is an autonomous institute of national importance under the Ministry of Education, Govt. of India.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>NIRF Ranked Premier Institute</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">
                  Portal Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-amber-400 transition-colors">
                  Upcoming & Active Events
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-amber-400 transition-colors">
                  Event Photographs & Archive
                </Link>
              </li>
              <li>
                <Link to="/student-login" className="hover:text-amber-400 transition-colors">
                  Student / Participant Login
                </Link>
              </li>
              <li>
                <Link to="/admin-login" className="hover:text-amber-400 transition-colors">
                  Staff & Coordinator Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Programs & Events */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              CA Department Events
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Version - National MCA Symposium</li>
              <li>AI & Machine Learning Bootcamps</li>
              <li>CyberSecurity & Cloud Conclaves</li>
              <li>CodeCraft Algorithmic Hackathons</li>
              <li>National Data Science Summits</li>
              <li>Annual Project Innovation Expo</li>
            </ul>
          </div>

          {/* Col 4: Campus Address & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Campus Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  Department of Computer Applications, Lyceum Building, NIT Tiruchirappalli - 620015, Tamil Nadu, India.
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+91 431 2503731 / 2503000</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>hodca@nitt.edu | events@nitt.edu</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://www.nitt.edu"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-medium"
                >
                  <span>Official Institute Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & ER Schema Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Department of Computer Applications, NIT Trichy. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">
              Designed strictly as per Relational ER Model (15 Tables)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
