import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_VENUES,
  INITIAL_COORDINATORS,
  REMOVED_EVENT_IDS,
  LEGACY_SHARED_ACTIVITY_BANNERS,
  INITIAL_EVENTS,
  INITIAL_STUDENT_ACTIVITIES,
  INITIAL_EVENT_COORDINATORS,
  INITIAL_SPONSORS,
  INITIAL_PUBLICITY,
  INITIAL_PARTICIPANTS,
  INITIAL_REGISTRATIONS,
  INITIAL_ACCOMMODATIONS,
  INITIAL_HOSPITALITY,
  INITIAL_EVALUATIONS,
  INITIAL_CERTIFICATES,
  INITIAL_COMPLETION_REPORTS,
  INITIAL_PHOTOGRAPHS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';
import { getAccommodationFee } from '../data/accommodationPricing';

const DataContext = createContext(null);

const STORAGE_PREFIX = 'nitt_ca_ems_';
const DEFAULT_WALLET_BALANCE = 1000;
const REMOVED_EVENT_ID_SET = new Set(REMOVED_EVENT_IDS);
const LEGACY_ACTIVITY_BANNER_SET = new Set(LEGACY_SHARED_ACTIVITY_BANNERS);
const ANONYMIZED_TEXT = [
  ['Dr. S. Nickolas', 'Admin'],
  ['Dr. Rajeswari Sridhar', 'Admin'],
  ['Dr. G. Lakshmi Narayanan', 'Admin'],
  ['Dr. P. Sridevi', 'Admin'],
  ['Dr. B. Janet', 'Coordinator'],
  ['Dr. Michael Arock', 'Coordinator'],
  ['Dr. S. R. Balasundaram', 'Coordinator'],
  ['Dr. P. J. Alphonse', 'Coordinator'],
  ['Dr. (Mrs.) B. Shamila', 'Coordinator'],
  ['Sairam Lakum', 'Prasad'],
  ['Priya Sharma', 'xyz'],
  ['Karthik Raja', 'Student 3'],
  ['Ananya Deshmukh', 'Student 4'],
  ['Mohammed Farooq', 'Student 5'],
  ['Sneha Patel', 'Student 6'],
  ['janet@nitt.edu', 'coordinator@example.com'],
  ['michael@nitt.edu', 'coordinator2@example.com'],
  ['blsundar@nitt.edu', 'coordinator3@example.com'],
  ['alphonse@nitt.edu', 'coordinator4@example.com'],
  ['shamila@nitt.edu', 'coordinator5@example.com'],
  ['priya.s@nitk.edu.in', 'xyz@gmail.com'],
  ['karthik.r@iitm.ac.in', 'student3@example.com'],
  ['ananya.d@vit.ac.in', 'student4@example.com'],
  ['farooq.m@nitt.edu', 'student5@example.com'],
  ['sneha.p@psgtech.edu', 'student6@example.com'],
  ['sairam@nitt.edu', 'prasad45@gmail.com'],
  ['admin@nitt.edu', 'admin@gmail.com']
];

const anonymizeStoredValue = (value) => {
  if (Array.isArray(value)) return value.map(anonymizeStoredValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, anonymizeStoredValue(nested)]));
  }
  if (typeof value !== 'string') return value;
  return ANONYMIZED_TEXT.reduce((text, [name, replacement]) => text.replaceAll(name, replacement), value);
};

export const DataProvider = ({ children }) => {
  // Load initial from localStorage or fall back to mock data
  const loadState = (key, fallback) => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + key);
      return saved ? anonymizeStoredValue(JSON.parse(saved)) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const [departments, setDepartments] = useState(() => loadState('departments', INITIAL_DEPARTMENTS));
  const [venues, setVenues] = useState(() => loadState('venues', INITIAL_VENUES));
  const [coordinators, setCoordinators] = useState(() => loadState('coordinators', INITIAL_COORDINATORS));
  const [events, setEvents] = useState(() => {
    const savedEvents = loadState('events', INITIAL_EVENTS)
      .filter((event) => !REMOVED_EVENT_ID_SET.has(event.Event_ID));
    const initialBannersById = new Map(INITIAL_EVENTS.map((event) => [event.Event_ID, event.Banner]));
    const existingIds = new Set(savedEvents.map((event) => event.Event_ID));
    const refreshedEvents = savedEvents.map((event) => {
      const seededBanner = initialBannersById.get(event.Event_ID);
      const shouldRefreshBanner = LEGACY_ACTIVITY_BANNER_SET.has(event.Banner) && seededBanner;
      return {
        ...event,
        ...(shouldRefreshBanner ? { Banner: seededBanner } : {}),
        RegistrationFee: 99
      };
    });
    return [...refreshedEvents, ...INITIAL_STUDENT_ACTIVITIES.filter((event) => !existingIds.has(event.Event_ID))];
  });
  const [eventCoordinators, setEventCoordinators] = useState(() =>
    loadState('eventCoordinators', INITIAL_EVENT_COORDINATORS)
      .filter((assignment) => !REMOVED_EVENT_ID_SET.has(assignment.Event_ID))
  );
  const [sponsors, setSponsors] = useState(() => loadState('sponsors', INITIAL_SPONSORS));
  const [publicity, setPublicity] = useState(() => loadState('publicity', INITIAL_PUBLICITY));
  const [participants, setParticipants] = useState(() => loadState('participants', INITIAL_PARTICIPANTS).map((participant) =>
    participant.Participant_ID === 'PART-001'
      ? { ...participant, Name: 'Prasad', Email: 'prasad45@gmail.com' }
      : participant
  ));
  const [registrations, setRegistrations] = useState(() => {
    const removedPrasadEventIds = new Set(['EVT-101', 'EVT-102', 'EVT-104']);
    const registrations = loadState('registrations', INITIAL_REGISTRATIONS)
      .filter((registration) => !REMOVED_EVENT_ID_SET.has(registration.Event_ID))
      .filter((registration) => !(
        registration.Participant_ID === 'PART-001' && removedPrasadEventIds.has(registration.Event_ID)
      ))
      .map((registration) => registration.Participant_ID === 'PART-001'
        ? { ...registration, Fee_Paid: 99, Payment_Status: 'Confirmed' }
        : registration
      );
    const registeredEventIds = new Set(registrations
      .filter((registration) => registration.Participant_ID === 'PART-001')
      .map((registration) => registration.Event_ID));
    const myEventRegistrations = INITIAL_REGISTRATIONS.filter((registration) =>
      registration.Participant_ID === 'PART-001' &&
      !registeredEventIds.has(registration.Event_ID)
    ).map((registration) => ({ ...registration, Fee_Paid: 99, Payment_Status: 'Confirmed' }));
    return [...registrations, ...myEventRegistrations];
  });
  const [accommodations, setAccommodations] = useState(() =>
    loadState('accommodations', INITIAL_ACCOMMODATIONS).map((accommodation) => ({
      Payment_Status: 'Pending',
      Fee_Paid: 0,
      ...accommodation
    }))
  );
  const [hospitality, setHospitality] = useState(() => loadState('hospitality', INITIAL_HOSPITALITY));
  const [evaluations, setEvaluations] = useState(() => loadState('evaluations', INITIAL_EVALUATIONS));
  const [certificates, setCertificates] = useState(() => loadState('certificates', INITIAL_CERTIFICATES));
  const [completionReports, setCompletionReports] = useState(() => loadState('completionReports', INITIAL_COMPLETION_REPORTS));
  const [photographs, setPhotographs] = useState(() => loadState('photographs', INITIAL_PHOTOGRAPHS));
  const [notifications, setNotifications] = useState(() => loadState('notifications', INITIAL_NOTIFICATIONS));
  const [walletBalances, setWalletBalances] = useState(() => loadState('walletBalances', {}));
  const walletBalancesRef = useRef(walletBalances);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'venues', JSON.stringify(venues));
  }, [venues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'coordinators', JSON.stringify(coordinators));
  }, [coordinators]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'eventCoordinators', JSON.stringify(eventCoordinators));
  }, [eventCoordinators]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'sponsors', JSON.stringify(sponsors));
  }, [sponsors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'publicity', JSON.stringify(publicity));
  }, [publicity]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'accommodations', JSON.stringify(accommodations));
  }, [accommodations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'hospitality', JSON.stringify(hospitality));
  }, [hospitality]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'completionReports', JSON.stringify(completionReports));
  }, [completionReports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'photographs', JSON.stringify(photographs));
  }, [photographs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    walletBalancesRef.current = walletBalances;
    localStorage.setItem(STORAGE_PREFIX + 'walletBalances', JSON.stringify(walletBalances));
  }, [walletBalances]);

  // Lookup helper functions
  const getDepartment = (deptId) => departments.find((d) => d.Dept_ID === deptId);
  const getVenue = (venueId) => venues.find((v) => v.Venue_ID === venueId);
  const getCoordinator = (coordId) => coordinators.find((c) => c.Coordinator_ID === coordId);
  const getParticipant = (partId) => participants.find((p) => p.Participant_ID === partId);
  const getEvent = (eventId) => events.find((e) => e.Event_ID === eventId);
  const getWalletBalance = (participantId) =>
    walletBalancesRef.current[participantId] ?? DEFAULT_WALLET_BALANCE;

  const addWalletFunds = (participantId, amount) => {
    const credit = Number(amount);
    if (!Number.isFinite(credit) || credit <= 0) {
      return { success: false, error: 'Enter an amount greater than zero.' };
    }

    const balance = getWalletBalance(participantId);
    const newBalance = balance + credit;
    const nextWalletBalances = { ...walletBalancesRef.current, [participantId]: newBalance };
    walletBalancesRef.current = nextWalletBalances;
    setWalletBalances(nextWalletBalances);
    return { success: true, balance: newBalance };
  };

  const getEventCoordinators = (eventId) => {
    const mappings = eventCoordinators.filter((ec) => ec.Event_ID === eventId);
    return mappings.map((m) => {
      const coord = coordinators.find((c) => c.Coordinator_ID === m.Coordinator_ID);
      return {
        ...m,
        coordinator: coord
      };
    });
  };

  const getEventSponsors = (eventId) => sponsors.filter((s) => s.Event_ID === eventId);
  const getEventPublicity = (eventId) => publicity.filter((p) => p.Event_ID === eventId);
  const getEventRegistrations = (eventId) => registrations.filter((r) => r.Event_ID === eventId);
  const getParticipantRegistrations = (participantId) => registrations.filter((r) => r.Participant_ID === participantId);
  const getEventCompletionReport = (eventId) => completionReports.find((r) => r.Event_ID === eventId);
  const getReportPhotographs = (reportId) => photographs.filter((p) => p.Report_ID === reportId);
  const getEventPhotographs = (eventId) => {
    const report = completionReports.find((r) => r.Event_ID === eventId);
    if (!report) return [];
    return photographs.filter((p) => p.Report_ID === report.Report_ID);
  };

  // Event Mutations
  const addEvent = (newEvent) => {
    const eventId = newEvent.Event_ID || `EVT-${Date.now().toString().slice(-3)}`;
    const eventToAdd = { ...newEvent, Event_ID: eventId, RegistrationFee: 99 };
    setEvents((prev) => [eventToAdd, ...prev]);
    return eventToAdd;
  };

  const updateEvent = (eventId, updatedData) => {
    setEvents((prev) => prev.map((e) => (e.Event_ID === eventId ? { ...e, ...updatedData, RegistrationFee: 99 } : e)));
  };

  const deleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((e) => e.Event_ID !== eventId));
    setEventCoordinators((prev) => prev.filter((ec) => ec.Event_ID !== eventId));
    setRegistrations((prev) => prev.filter((r) => r.Event_ID !== eventId));
  };

  // Department Mutations
  const addDepartment = (dept) => {
    setDepartments((prev) => [...prev, dept]);
  };

  const updateDepartment = (deptId, data) => {
    setDepartments((prev) => prev.map((d) => (d.Dept_ID === deptId ? { ...d, ...data } : d)));
  };

  const deleteDepartment = (deptId) => {
    setDepartments((prev) => prev.filter((d) => d.Dept_ID !== deptId));
  };

  // Venue Mutations
  const addVenue = (venue) => {
    setVenues((prev) => [...prev, venue]);
  };

  const updateVenue = (venueId, data) => {
    setVenues((prev) => prev.map((v) => (v.Venue_ID === venueId ? { ...v, ...data } : v)));
  };

  const deleteVenue = (venueId) => {
    setVenues((prev) => prev.filter((v) => v.Venue_ID !== venueId));
  };

  // Coordinator Mutations
  const addCoordinator = (coord) => {
    setCoordinators((prev) => [...prev, coord]);
  };

  const updateCoordinator = (coordId, data) => {
    setCoordinators((prev) => prev.map((c) => (c.Coordinator_ID === coordId ? { ...c, ...data } : c)));
  };

  const deleteCoordinator = (coordId) => {
    setCoordinators((prev) => prev.filter((c) => c.Coordinator_ID !== coordId));
    setEventCoordinators((prev) => prev.filter((ec) => ec.Coordinator_ID !== coordId));
  };

  // Event Coordinator Mapping
  const assignEventCoordinator = (mapping) => {
    setEventCoordinators((prev) => {
      const exists = prev.some(
        (ec) => ec.Event_ID === mapping.Event_ID && ec.Coordinator_ID === mapping.Coordinator_ID
      );
      if (exists) {
        return prev.map((ec) =>
          ec.Event_ID === mapping.Event_ID && ec.Coordinator_ID === mapping.Coordinator_ID
            ? { ...ec, Assigned_Role: mapping.Assigned_Role }
            : ec
        );
      }
      return [...prev, mapping];
    });
  };

  const removeEventCoordinator = (eventId, coordId) => {
    setEventCoordinators((prev) =>
      prev.filter((ec) => !(ec.Event_ID === eventId && ec.Coordinator_ID === coordId))
    );
  };

  // Participant Mutations
  const addParticipant = (part) => {
    setParticipants((prev) => [...prev, part]);
  };

  const updateParticipant = (partId, data) => {
    setParticipants((prev) => prev.map((p) => (p.Participant_ID === partId ? { ...p, ...data } : p)));
  };

  const deleteParticipant = (partId) => {
    setParticipants((prev) => prev.filter((p) => p.Participant_ID !== partId));
  };

  // Registration Mutations
  const registerForEvent = (registrationData) => {
    const regId = `REG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newReg = {
      Registration_ID: regId,
      Registration_Date: new Date().toISOString().split('T')[0],
      Payment_Status: 'Confirmed',
      Status: 'Confirmed',
      ...registrationData
    };
    setRegistrations((prev) => [newReg, ...prev]);

    // Also add notification for student & admin
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        recipient: 'student',
        title: 'Registration Submitted',
        message: `Your registration ${regId} has been successfully submitted!`,
        time: 'Just now',
        read: false,
        type: 'success'
      },
      {
        id: `NOTIF-${Date.now() + 1}`,
        recipient: 'admin',
        title: 'New Event Registration',
        message: `New registration ${regId} received for ${newReg.Event_ID}`,
        time: 'Just now',
        read: false,
        type: 'info'
      },
      ...prev
    ]);

    return newReg;
  };

  const payForEvent = ({ participantId, eventId, registrationType }) => {
    const event = events.find((item) => item.Event_ID === eventId);
    if (!event) return { success: false, error: 'This event is no longer available.' };

    const existingRegistration = registrations.find((registration) =>
      registration.Participant_ID === participantId &&
      registration.Event_ID === eventId &&
      !['Cancelled', 'Rejected'].includes(registration.Status)
    );
    if (existingRegistration) {
      return { success: false, error: 'You are already registered for this event.' };
    }

    const amount = Number(event.RegistrationFee) || 99;
    const balance = getWalletBalance(participantId);
    if (balance < amount) {
      return { success: false, error: 'Your wallet balance is too low for this event.' };
    }

    const newBalance = balance - amount;
    const nextWalletBalances = { ...walletBalancesRef.current, [participantId]: newBalance };
    walletBalancesRef.current = nextWalletBalances;
    setWalletBalances(nextWalletBalances);

    const registration = registerForEvent({
      Participant_ID: participantId,
      Event_ID: eventId,
      Fee_Paid: amount,
      Payment_Status: 'Confirmed',
      Registration_Type: registrationType,
      Payment_Method: 'Student Wallet'
    });

    return { success: true, registration, balance: newBalance };
  };

  const updateRegistrationStatus = (regId, status, paymentStatus) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.Registration_ID === regId
          ? {
              ...r,
              Status: status || r.Status,
              Payment_Status: paymentStatus || r.Payment_Status
            }
          : r
      )
    );
  };

  // Accommodation Mutations
  const requestAccommodation = (accData) => {
    const accId = `ACC-${Math.floor(100 + Math.random() * 900)}`;
    const newAcc = {
      Accommodation_ID: accId,
      Status: 'Pending',
      Room_No: 'Pending Assignment',
      Hostel_Block: accData.Hostel_Block || 'Garnet Hostel',
      Payment_Status: 'Pending',
      Fee_Paid: 0,
      ...accData
    };
    setAccommodations((prev) => [newAcc, ...prev]);
    return newAcc;
  };

  const updateAccommodation = (accId, data) => {
    setAccommodations((prev) =>
      prev.map((a) => (a.Accommodation_ID === accId ? { ...a, ...data } : a))
    );
  };

  const payForAccommodation = (accommodationId, participantId) => {
    const accommodation = accommodations.find((item) => item.Accommodation_ID === accommodationId);
    if (!accommodation || accommodation.Participant_ID !== participantId) {
      return { success: false, error: 'Accommodation request not found.' };
    }
    if (accommodation.Status !== 'Approved' || !accommodation.Room_No || ['Pending Assignment', 'Unassigned'].includes(accommodation.Room_No)) {
      return { success: false, error: 'Payment is available after the admin assigns your room.' };
    }
    if (accommodation.Payment_Status === 'Confirmed') {
      return { success: false, error: 'This accommodation has already been paid.' };
    }

    const amount = getAccommodationFee(accommodation.Check_in_Date, accommodation.Check_out_Date);
    if (amount <= 0) return { success: false, error: 'Check-out date must be after check-in date.' };

    const balance = getWalletBalance(participantId);
    if (balance < amount) {
      return { success: false, error: `Insufficient wallet balance. Rs. ${amount} is due for accommodation.` };
    }

    const newBalance = balance - amount;
    const nextWalletBalances = { ...walletBalancesRef.current, [participantId]: newBalance };
    walletBalancesRef.current = nextWalletBalances;
    setWalletBalances(nextWalletBalances);
    setAccommodations((previous) => previous.map((item) => item.Accommodation_ID === accommodationId
      ? { ...item, Fee_Paid: amount, Payment_Status: 'Confirmed' }
      : item
    ));

    return { success: true, amount, balance: newBalance };
  };

  // Hospitality Mutations
  const addHospitality = (hospData) => {
    const hospId = `HOSP-${Math.floor(100 + Math.random() * 900)}`;
    const newHosp = {
      Hospitality_ID: hospId,
      ...hospData
    };
    setHospitality((prev) => [newHosp, ...prev]);
    return newHosp;
  };

  const updateHospitality = (hospId, data) => {
    setHospitality((prev) =>
      prev.map((h) => (h.Hospitality_ID === hospId ? { ...h, ...data } : h))
    );
  };

  const deleteHospitality = (hospId) => {
    setHospitality((prev) => prev.filter((h) => h.Hospitality_ID !== hospId));
  };

  // Evaluation / Feedback
  const submitEvaluation = (evalData) => {
    const evalId = `EVAL-${Math.floor(100 + Math.random() * 900)}`;
    const newEval = {
      Evaluation_ID: evalId,
      Evaluation_Date: new Date().toISOString().split('T')[0],
      ...evalData
    };
    setEvaluations((prev) => [newEval, ...prev]);
    return newEval;
  };

  // Certificate Mutations
  const generateCertificate = (certData) => {
    const certId = `CERT-${Math.floor(100 + Math.random() * 900)}`;
    const certNo = `NITT/CA/${new Date().getFullYear()}/${certId.split('-')[1]}`;
    const newCert = {
      Certificate_ID: certId,
      Certificate_No: certNo,
      Issue_Date: new Date().toISOString().split('T')[0],
      Title: certData.Certificate_Type || 'Certificate of Participation',
      ...certData
    };
    setCertificates((prev) => [newCert, ...prev]);
    return newCert;
  };

  // Completion Report & Photos
  const saveCompletionReport = (reportData) => {
    const reportId = reportData.Report_ID || `REP-${Math.floor(100 + Math.random() * 900)}`;
    const newReport = {
      Report_ID: reportId,
      Report_Date: new Date().toISOString().split('T')[0],
      ...reportData
    };
    setCompletionReports((prev) => {
      const exists = prev.some((r) => r.Report_ID === reportId || r.Event_ID === reportData.Event_ID);
      if (exists) {
        return prev.map((r) => (r.Event_ID === reportData.Event_ID ? newReport : r));
      }
      return [newReport, ...prev];
    });
    return newReport;
  };

  const uploadPhotograph = (photoData) => {
    const photoId = `PHT-${Math.floor(100 + Math.random() * 900)}`;
    const newPhoto = {
      Photo_ID: photoId,
      Uploaded_Date: new Date().toISOString().split('T')[0],
      ...photoData
    };
    setPhotographs((prev) => [newPhoto, ...prev]);
    return newPhoto;
  };

  const deletePhotograph = (photoId) => {
    setPhotographs((prev) => prev.filter((p) => p.Photo_ID !== photoId));
  };

  // Sponsor Mutations
  const addSponsor = (sponData) => {
    const sponId = `SPON-0${sponsors.length + 1}`;
    const newSpon = { Sponsor_ID: sponId, ...sponData };
    setSponsors((prev) => [...prev, newSpon]);
    return newSpon;
  };

  const updateSponsor = (sponId, data) => {
    setSponsors((prev) => prev.map((s) => (s.Sponsor_ID === sponId ? { ...s, ...data } : s)));
  };

  const deleteSponsor = (sponId) => {
    setSponsors((prev) => prev.filter((s) => s.Sponsor_ID !== sponId));
  };

  // Publicity Mutations
  const addPublicity = (pubData) => {
    const adId = `PUB-0${publicity.length + 1}`;
    const newPub = {
      Ad_ID: adId,
      Publish_Date: new Date().toISOString().split('T')[0],
      ...pubData
    };
    setPublicity((prev) => [...prev, newPub]);
    return newPub;
  };

  const updatePublicity = (adId, data) => {
    setPublicity((prev) => prev.map((p) => (p.Ad_ID === adId ? { ...p, ...data } : p)));
  };

  const deletePublicity = (adId) => {
    setPublicity((prev) => prev.filter((p) => p.Ad_ID !== adId));
  };

  // Reset to initial mock database
  const resetToDefaultData = () => {
    setDepartments(INITIAL_DEPARTMENTS);
    setVenues(INITIAL_VENUES);
    setCoordinators(INITIAL_COORDINATORS);
    setEvents(INITIAL_EVENTS
      .filter((event) => !REMOVED_EVENT_ID_SET.has(event.Event_ID))
      .map((event) => ({ ...event, RegistrationFee: 99 })));
    setWalletBalances({});
    setEventCoordinators(INITIAL_EVENT_COORDINATORS);
    setSponsors(INITIAL_SPONSORS);
    setPublicity(INITIAL_PUBLICITY);
    setParticipants(INITIAL_PARTICIPANTS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setAccommodations(INITIAL_ACCOMMODATIONS.map((accommodation) => ({
      Payment_Status: 'Pending',
      Fee_Paid: 0,
      ...accommodation
    })));
    setHospitality(INITIAL_HOSPITALITY);
    setEvaluations(INITIAL_EVALUATIONS);
    setCertificates(INITIAL_CERTIFICATES);
    setCompletionReports(INITIAL_COMPLETION_REPORTS);
    setPhotographs(INITIAL_PHOTOGRAPHS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
  };

  return (
    <DataContext.Provider
      value={{
        // 15 Entities State
        departments,
        venues,
        coordinators,
        events,
        eventCoordinators,
        sponsors,
        publicity,
        participants,
        registrations,
        accommodations,
        hospitality,
        evaluations,
        certificates,
        completionReports,
        photographs,
        notifications,
        walletBalances,

        // Relational Lookups
        getDepartment,
        getVenue,
        getCoordinator,
        getParticipant,
        getEvent,
        getWalletBalance,
        addWalletFunds,
        getEventCoordinators,
        getEventSponsors,
        getEventPublicity,
        getEventRegistrations,
        getParticipantRegistrations,
        getEventCompletionReport,
        getReportPhotographs,
        getEventPhotographs,

        // CRUD Actions
        addEvent,
        updateEvent,
        deleteEvent,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addVenue,
        updateVenue,
        deleteVenue,
        addCoordinator,
        updateCoordinator,
        deleteCoordinator,
        assignEventCoordinator,
        removeEventCoordinator,
        addParticipant,
        updateParticipant,
        deleteParticipant,
        registerForEvent,
        payForEvent,
        updateRegistrationStatus,
        requestAccommodation,
        updateAccommodation,
        payForAccommodation,
        addHospitality,
        updateHospitality,
        deleteHospitality,
        submitEvaluation,
        generateCertificate,
        saveCompletionReport,
        uploadPhotograph,
        deletePhotograph,
        addSponsor,
        updateSponsor,
        deleteSponsor,
        addPublicity,
        updatePublicity,
        deletePublicity,
        resetToDefaultData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
