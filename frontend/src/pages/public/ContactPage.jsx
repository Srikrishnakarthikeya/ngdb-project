import React from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const ContactPage = () => {
  const { showToast } = useToast();

  const handleSendMessage = (e) => {
    e.preventDefault();
    showToast('Your message has been sent to the CA Department Event Secretariat.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Reach Out to Us
        </span>
        <h1 className="text-3xl font-extrabold text-nitt-950">
          Campus Contact & Secretariat
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Department of Computer Applications, National Institute of Technology, Tiruchirappalli
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-nitt-950 border-b border-slate-100 pb-3">
              Event Office Information
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Department Address</span>
                  <p className="text-slate-600 mt-0.5">
                    Lyceum Building, Department of Computer Applications, National Institute of Technology, Tanjore Main Road, National Highway 67, Tiruchirappalli - 620015, Tamil Nadu.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Department Office & Ext</span>
                  <p className="text-slate-600 mt-0.5">+91 431 2503731 / 2503730</p>
                  <p className="text-slate-600">HOD Office: +91 431 2503731</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Official Emails</span>
                  <p className="text-slate-600 mt-0.5">hodca@nitt.edu (Head of Department)</p>
                  <p className="text-slate-600">caevents@nitt.edu (Event Secretariat)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Office Working Hours</span>
                  <p className="text-slate-600 mt-0.5">Monday to Friday: 9:00 AM - 5:30 PM</p>
                  <p className="text-slate-500">Closed on Institute Holidays & Weekends</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-nitt-950">
              Send an Inquiry to the Organizing Committee
            </h3>
            <p className="text-xs text-slate-500">
              For queries related to symposium registrations, speaker invitations, or accommodation requests.
            </p>

            <form onSubmit={handleSendMessage} className="space-y-4 text-xs pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject / Event</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Version 2026 Registration or Accommodation Query"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your inquiry or requirement..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <Button variant="primary" type="submit" icon={Send}>
                  Submit Inquiry
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
