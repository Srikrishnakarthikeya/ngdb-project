import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import {
  Calendar,
  MapPin,
  Building2,
  Users,
  Award,
  DollarSign,
  UserCheck,
  ArrowLeft,
  Share2,
  Phone,
  Mail,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

const PublicEventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isStudent, isCoordinator, switchRole } = useAuth();
  const {
    getEvent,
    getDepartment,
    getVenue,
    getEventCoordinators,
    getEventSponsors,
    getEventPublicity,
    getEventRegistrations
  } = useData();

  const event = getEvent(id);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registrationType, setRegistrationType] = useState('Individual Participant');

  // Form fields for registration
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Prasad',
    email: currentUser?.email || 'prasad45@gmail.com',
    phone: currentUser?.phone || '+91 9876543210',
    category: currentUser?.category || 'Student',
    institution: currentUser?.institution || 'National Institute of Technology, Tiruchirappalli',
    branch: currentUser?.branch || 'Computer Applications (MCA)',
    year: currentUser?.year || '2nd Year',
    paymentMode: 'Online UPI / Net Banking'
  });

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Event Not Found</h2>
        <p className="text-sm text-slate-500">The requested event ID could not be found.</p>
        <Link to="/events" className="inline-block px-4 py-2 bg-nitt-900 text-white rounded-lg text-xs font-bold">
          Back to Events
        </Link>
      </div>
    );
  }

  const dept = getDepartment(event.Dept_ID);
  const venue = getVenue(event.Venue_ID);
  const eventCoordinators = getEventCoordinators(event.Event_ID);
  const sponsors = getEventSponsors(event.Event_ID);
  const publicity = getEventPublicity(event.Event_ID);
  const registrations = getEventRegistrations(event.Event_ID);

  const availableCapacity = (venue?.Capacity || 100) - registrations.length;

  const handleOpenRegister = () => {
    if (isCoordinator) return;
    // If user is not authenticated, switch to student or guide
    if (!isAuthenticated) {
      switchRole('STUDENT');
    }
    setIsRegisterModalOpen(true);
  };

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    setIsRegisterModalOpen(false);
    navigate(`/events/${event.Event_ID}/payment`, {
      state: {
        participant: formData,
        registrationType
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Return link */}
      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-nitt-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Main Event Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-nitt-950 text-white border border-slate-800 shadow-xl">
        <div className="absolute inset-0">
          <img
            src={event.Banner}
            alt={event.Event_Name}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-nitt-950 via-nitt-950/80 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-10 lg:p-12 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge status={event.Status} />
            <span className="bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold px-3 py-0.5 rounded-full">
              {event.Event_Type}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Code: {event.Event_ID}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            {event.Event_Name}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2 text-slate-300">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <span className="block text-slate-400 font-medium">Dates</span>
                <span className="font-bold text-white">
                  {new Date(event.Start_Date).toLocaleDateString('en-GB')} - {new Date(event.End_Date).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <div>
                <span className="block text-slate-400 font-medium">Venue (HELD_AT)</span>
                <span className="font-bold text-white truncate block">
                  {venue?.Venue_Name || 'Campus Venue'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div>
                <span className="block text-slate-400 font-medium">Department (ORGANIZES)</span>
                <span className="font-bold text-white truncate block">
                  {dept?.Dept_Name?.replace('Department of ', '') || 'CA'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="block text-slate-400 font-medium">Available Seats</span>
                <span className="font-bold text-emerald-300">
                  {availableCapacity > 0 ? `${availableCapacity} of ${venue?.Capacity || 150} left` : 'Full'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description, Coordinators, Venue and Sponsors */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Overview */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-nitt-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Event Overview & Scope</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {event.Description}
            </p>
            {event.TargetAudience && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-800">Target Audience: </span>
                <span className="text-slate-600">{event.TargetAudience}</span>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-nitt-950 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-600" />
                <span>Event Coordinators & Faculty Conveners</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eventCoordinators.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No faculty coordinators currently assigned.</p>
              ) : (
                eventCoordinators.map((ec, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-nitt-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {ec.coordinator?.Name.split(' ')[1]?.[0] || 'DR'}
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-slate-900">{ec.coordinator?.Name || 'Coordinator'}</p>
                      <p className="text-slate-500 font-medium">{ec.coordinator?.Designation}</p>
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                        Role: {ec.Assigned_Role}
                      </span>
                      <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-2">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{ec.coordinator?.Email}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section: Venue Details (EVENT -> HELD_AT -> VENUE) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-nitt-950 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-600" />
                <span>Venue & Infrastructure Facilities</span>
              </h2>
            </div>

            {venue ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                    Hall Name & Code
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{venue.Venue_Name}</p>
                  <p className="text-slate-500">{venue.Location}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                    Capacity & Classification
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{venue.Capacity} Seats</p>
                  <p className="text-slate-500">{venue.Venue_Type}</p>
                </div>
                <div className="sm:col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 uppercase font-bold tracking-wider text-[10px] block mb-1">
                    Equipped Facilities
                  </span>
                  <p className="text-slate-700">{venue.Facilities}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Venue details not specified.</p>
            )}
          </div>

          {/* Section: Corporate Sponsors */}
          {sponsors.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-nitt-950 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>Corporate Sponsors & Partners</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sponsors.map((spon) => (
                  <div
                    key={spon.Sponsor_ID}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{spon.Sponsor_Name}</p>
                      <p className="text-[10px] text-slate-500">{spon.Tier}</p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      Rs. {spon.Amount_Contributed.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Registration Card & Action */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-nitt-800 p-6 shadow-lg space-y-5 sticky top-24">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Registration Status
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl font-extrabold text-nitt-950">
                  {event.RegistrationFee === 0 ? 'Free' : `Rs. ${event.RegistrationFee}`}
                </span>
                <span className="text-xs text-slate-500 font-medium">per delegate</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Event Status:</span>
                <Badge status={event.Status} />
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Capacity:</span>
                <span className="font-semibold text-slate-800">{venue?.Capacity || 100} Participants</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Confirmed Attendees:</span>
                <span className="font-semibold text-slate-800">{registrations.length}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Digital Certificate:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Included
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Hostel Accommodation:</span>
                <span className="font-semibold text-blue-600">Requestable</span>
              </div>
            </div>

            {/* Participant-only registration action */}
            <div className="pt-2">
              {isCoordinator ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-center text-xs font-bold text-amber-800">
                  Coordinator access is read-only. Event participation is not allowed.
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full font-bold shadow-md bg-nitt-900 hover:bg-nitt-800"
                  onClick={handleOpenRegister}
                >
                  REGISTER NOW
                </Button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Registration Modal Form */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Event Registration"
        subtitle={event.Event_Name}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmitRegistration} className="space-y-4 text-xs">
            <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200 text-blue-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>
                Logged in as <strong>{currentUser?.name || 'Student Participant'}</strong> ({currentUser?.email || 'prasad45@gmail.com'})
              </span>
            </div>

            {/* Participant Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Participant Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Participant Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Student">Internal NITT Student</option>
                  <option value="External Student">External College Student</option>
                  <option value="Research Scholar">Research Scholar</option>
                  <option value="Faculty / Delegate">Faculty / Delegate</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Institution Name</label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Branch / Degree</label>
                <input
                  type="text"
                  required
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Year of Study</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate / PhD">Postgraduate / PhD</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Registration Type</label>
                <select
                  value={registrationType}
                  onChange={(e) => setRegistrationType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Individual Participant">Individual Participant</option>
                  <option value="Symposium Delegate">Symposium Delegate</option>
                  <option value="Workshop Trainee">Workshop Trainee</option>
                  <option value="Student Volunteer">Student Volunteer</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Registration Fee</label>
                <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-900">
                  Rs. {event.RegistrationFee}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsRegisterModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
              >
                Continue to Payment
              </Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default PublicEventDetailPage;
