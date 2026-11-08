import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const DataContext = createContext(null);
const API_PREFIX = '/api';
const request = async (path, options = {}) => {
  let response;
  try {
    response = await fetch(`${API_PREFIX}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('nitt_ca_auth_token') ? { Authorization: `Bearer ${localStorage.getItem('nitt_ca_auth_token')}` } : {}), ...(options.headers || {}) },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
  } catch {
    throw new Error('Backend unavailable. Start the backend on http://localhost:5000.');
  }
  if (response.status === 204) return null;
  const value = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(value.error || 'Request failed');
  return value;
};

const upsert = (collection, idField, record) => collection.some((item) => item[idField] === record[idField]) ? collection.map((item) => item[idField] === record[idField] ? { ...item, ...record } : item) : [record, ...collection];

export const DataProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]); const [venues, setVenues] = useState([]); const [coordinators, setCoordinators] = useState([]);
  const [events, setEvents] = useState([]); const [eventCoordinators, setEventCoordinators] = useState([]); const [sponsors, setSponsors] = useState([]);
  const [publicity, setPublicity] = useState([]); const [participants, setParticipants] = useState([]); const [registrations, setRegistrations] = useState([]);
  const [accommodations, setAccommodations] = useState([]); const [hospitality, setHospitality] = useState([]); const [evaluations, setEvaluations] = useState([]);
  const [certificates, setCertificates] = useState([]); const [completionReports, setCompletionReports] = useState([]); const [photographs, setPhotographs] = useState([]);
  const [notifications, setNotifications] = useState([]); const [walletBalances, setWalletBalances] = useState({}); const walletBalancesRef = useRef(walletBalances);
  const [backendLoading, setBackendLoading] = useState(true); const [backendError, setBackendError] = useState(null);

  const refresh = async () => {
    setBackendLoading(true);
    setBackendError(null);
    try {
      const data = await request('/bootstrap');
      setDepartments(data.departments || []); setVenues(data.venues || []); setCoordinators(data.coordinators || []); setEvents(data.events || []);
      setEventCoordinators(data.eventCoordinators || []); setSponsors(data.sponsors || []); setPublicity(data.publicity || []);
      setParticipants((data.participants || []).map((participant) => ({ ...participant, Wallet: (data.wallets || []).find((wallet) => wallet.participantId === participant.Participant_ID)?.balance ?? participant.Wallet ?? 1000 })));
      setRegistrations(data.registrations || []); setAccommodations(data.accommodations || []); setHospitality(data.hospitality || []); setEvaluations(data.evaluations || []);
      setCertificates(data.certificates || []); setCompletionReports(data.completionReports || []); setPhotographs(data.photographs || []); setNotifications(data.notifications || []);
      const balances = {};
      for (const wallet of data.wallets || []) balances[wallet.participantId] = wallet.balance;
      walletBalancesRef.current = balances; setWalletBalances(balances);
      setBackendLoading(false);
    } catch (error) {
      console.error('Unable to load backend data:', error);
      setBackendError(error.message || 'Unable to connect to the backend.');
      setBackendLoading(false);
    }
  };
  useEffect(() => { refresh(); }, []);
  useEffect(() => { walletBalancesRef.current = walletBalances; }, [walletBalances]);

  const create = async (resource, record, idField) => { const saved = await request(`/${resource}`, { method: 'POST', body: record }); const setter = { departments:setDepartments, venues:setVenues, coordinators:setCoordinators, events:setEvents, eventCoordinators:setEventCoordinators, sponsors:setSponsors, publicity:setPublicity, participants:setParticipants, registrations:setRegistrations, accommodations:setAccommodations, hospitality:setHospitality, evaluations:setEvaluations, certificates:setCertificates, completionReports:setCompletionReports, photographs:setPhotographs, notifications:setNotifications }[resource]; if (setter) setter((previous) => upsert(previous, idField, saved)); return saved; };
  const update = async (resource, value, record, idField) => { const saved = await request(`/${resource}/${encodeURIComponent(value)}`, { method: 'PUT', body: record }); const setter = { departments:setDepartments, venues:setVenues, coordinators:setCoordinators, events:setEvents, sponsors:setSponsors, publicity:setPublicity, participants:setParticipants, registrations:setRegistrations, accommodations:setAccommodations, hospitality:setHospitality, evaluations:setEvaluations, certificates:setCertificates, completionReports:setCompletionReports, photographs:setPhotographs }[resource]; if (setter) setter((previous) => previous.map((item) => item[idField] === value ? { ...item, ...saved } : item)); return saved; };
  const remove = async (resource, value) => { await request(`/${resource}/${encodeURIComponent(value)}`, { method: 'DELETE' }); await refresh(); };

  const getDepartment = (id) => departments.find((item) => item.Dept_ID === id); const getVenue = (id) => venues.find((item) => item.Venue_ID === id);
  const getCoordinator = (id) => coordinators.find((item) => item.Coordinator_ID === id); const getParticipant = (id) => participants.find((item) => item.Participant_ID === id);
  const getEvent = (id) => events.find((item) => item.Event_ID === id);
  const getWalletBalance = (id) => walletBalancesRef.current[id] ?? 1000;
  const applyWalletBalance = (participantId, balance) => {
    walletBalancesRef.current = { ...walletBalancesRef.current, [participantId]: balance };
    setWalletBalances(walletBalancesRef.current);
    setParticipants((previous) => previous.map((participant) => participant.Participant_ID === participantId ? { ...participant, Wallet: balance } : participant));
  };
  const addWalletFunds = (participantId, amount) => { const credit = Number(amount); if (!Number.isFinite(credit) || credit <= 0) return { success:false, error:'Enter an amount greater than zero.' }; const optimisticBalance=getWalletBalance(participantId)+credit; applyWalletBalance(participantId, optimisticBalance); request(`/wallets/${encodeURIComponent(participantId)}/credit`, { method:'POST', body:{ amount:credit } }).then((wallet) => applyWalletBalance(participantId, wallet.balance)).catch((error)=>console.error(error)); return {success:true,balance:optimisticBalance}; };
  const getEventCoordinators = (eventId) => eventCoordinators.filter((item) => item.Event_ID === eventId).map((item) => ({...item, coordinator:getCoordinator(item.Coordinator_ID)}));
  const getEventSponsors = (eventId) => sponsors.filter((item) => item.Event_ID === eventId); const getEventPublicity = (eventId) => publicity.filter((item) => item.Event_ID === eventId);
  const getEventRegistrations = (eventId) => registrations.filter((item) => item.Event_ID === eventId); const getParticipantRegistrations = (participantId) => registrations.filter((item) => item.Participant_ID === participantId);
  const getEventCompletionReport = (eventId) => completionReports.find((item) => item.Event_ID === eventId); const getReportPhotographs = (reportId) => photographs.filter((item) => item.Report_ID === reportId);
  const getEventPhotographs = (eventId) => { const report=getEventCompletionReport(eventId); return report ? getReportPhotographs(report.Report_ID) : []; };

  const addEvent = (data) => { const record={...data, Event_ID:data.Event_ID || `EVT-${Date.now().toString().slice(-6)}`, RegistrationFee:99}; create('events',record,'Event_ID'); return record; };
  const updateEvent = (id,data) => { update('events',id,{...data,RegistrationFee:99},'Event_ID'); }; const deleteEvent = (id) => remove('events',id);
  const addDepartment=(data)=>create('departments',data,'Dept_ID'); const updateDepartment=(id,data)=>update('departments',id,data,'Dept_ID'); const deleteDepartment=(id)=>remove('departments',id);
  const addVenue=(data)=>create('venues',data,'Venue_ID'); const updateVenue=(id,data)=>update('venues',id,data,'Venue_ID'); const deleteVenue=(id)=>remove('venues',id);
  const addCoordinator=async (data)=>{ const saved=await request('/coordinator-management',{method:'POST',body:data}); await refresh(); return saved; };
  const updateCoordinator=async (id,data)=>{ const saved=await request(`/coordinator-management/${encodeURIComponent(id)}`,{method:'PUT',body:data}); await refresh(); return saved; };
  const deleteCoordinator=async (id)=>{ await request(`/coordinator-management/${encodeURIComponent(id)}`,{method:'DELETE'}); await refresh(); };
  const assignEventCoordinator=async (data)=>{ const saved=await request('/event-coordinators',{method:'POST',body:data}); await refresh(); return saved; };
  const removeEventCoordinator=async (eventId,coordId)=>{ await request(`/event-coordinators/${encodeURIComponent(eventId)}/${encodeURIComponent(coordId)}`,{method:'DELETE'}); await refresh(); };
  const addParticipant=(data)=>create('participants',data,'Participant_ID'); const updateParticipant=(id,data)=>update('participants',id,data,'Participant_ID'); const deleteParticipant=(id)=>remove('participants',id);
  const registerForEvent=(data)=>{ const record={Registration_ID:`REG-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,Registration_Date:new Date().toISOString().split('T')[0],Payment_Status:'Confirmed',Status:'Confirmed',...data}; create('registrations',record,'Registration_ID'); setNotifications((previous)=>[{id:`NOTIF-${Date.now()}`,recipient:'student',title:'Registration Submitted',message:`Your registration ${record.Registration_ID} was submitted.`,time:'Just now',read:false,type:'success'},...previous]); return record; };
  const payForEvent=({participantId,eventId,registrationType})=>{ const event=getEvent(eventId); if(!event)return{success:false,error:'This event is no longer available.'}; if(registrations.some((item)=>item.Participant_ID===participantId&&item.Event_ID===eventId&&!['Cancelled','Rejected'].includes(item.Status)))return{success:false,error:'You are already registered for this event.'}; const amount=Number(event.RegistrationFee)||99; if(getWalletBalance(participantId)<amount)return{success:false,error:'Your wallet balance is too low for this event.'}; const balance=getWalletBalance(participantId)-amount; applyWalletBalance(participantId,balance); request(`/wallets/${encodeURIComponent(participantId)}/debit`,{method:'POST',body:{amount}}).then((wallet)=>applyWalletBalance(participantId,wallet.balance)).catch((error)=>console.error(error)); const registration=registerForEvent({Participant_ID:participantId,Event_ID:eventId,Fee_Paid:amount,Payment_Status:'Confirmed',Registration_Type:registrationType,Payment_Method:'Student Wallet'}); return{success:true,registration,balance}; };
  const updateRegistrationStatus=(id,status,paymentStatus)=>update('registrations',id,{Status:status,Payment_Status:paymentStatus},'Registration_ID');
  const requestAccommodation=(data)=>{ const record={Accommodation_ID:`ACC-${Date.now().toString().slice(-5)}`,Status:'Pending',Payment_Status:'Pending',Fee_Paid:0,...data}; create('accommodations',record,'Accommodation_ID'); return record; }; const updateAccommodation=(id,data)=>update('accommodations',id,data,'Accommodation_ID'); const payForAccommodation=(participantId,id,amount)=>{ const paidAmount=Number(amount||0); if(paidAmount<=0)return{success:false,error:'Invalid payment amount.'}; const balance=getWalletBalance(participantId)-paidAmount; if(balance<0)return{success:false,error:'Insufficient wallet balance.'}; applyWalletBalance(participantId,balance); updateAccommodation(id,{Payment_Status:'Paid',Fee_Paid:paidAmount}); request(`/wallets/${encodeURIComponent(participantId)}/debit`,{method:'POST',body:{amount:paidAmount}}).then((wallet)=>applyWalletBalance(participantId,wallet.balance)).catch((error)=>console.error(error)); return{success:true,balance,amount:paidAmount}; };
  const addHospitality=(data)=>create('hospitality',{Hospitality_ID:`HOSP-${Date.now().toString().slice(-5)}`,...data},'Hospitality_ID'); const updateHospitality=(id,data)=>update('hospitality',id,data,'Hospitality_ID'); const deleteHospitality=(id)=>remove('hospitality',id);
  const submitEvaluation=(data)=>{const record={Evaluation_ID:`EVAL-${Date.now().toString().slice(-5)}`,...data};create('evaluations',record,'Evaluation_ID');return record;};
  const generateCertificate=(data)=>{const record={Certificate_ID:`CERT-${Date.now().toString().slice(-5)}`,Issue_Date:new Date().toISOString().split('T')[0],...data};create('certificates',record,'Certificate_ID');return record;};
  const saveCompletionReport=(data)=>{const record={Report_ID:data.Report_ID||`REP-${Date.now().toString().slice(-5)}`,...data};create('completionReports',record,'Report_ID');return record;};
  const uploadPhotograph=(data)=>{const record={Photo_ID:`PHT-${Date.now().toString().slice(-5)}`,Uploaded_Date:new Date().toISOString().split('T')[0],...data};create('photographs',record,'Photo_ID');return record;}; const deletePhotograph=(id)=>remove('photographs',id);
  const addSponsor=(data)=>create('sponsors',{Sponsor_ID:data.Sponsor_ID||`SP-${Date.now().toString().slice(-5)}`,...data},'Sponsor_ID'); const updateSponsor=(id,data)=>update('sponsors',id,data,'Sponsor_ID'); const deleteSponsor=(id)=>remove('sponsors',id);
  const addPublicity=(data)=>create('publicity',{Ad_ID:data.Ad_ID||`AD-${Date.now().toString().slice(-5)}`,...data},'Ad_ID'); const updatePublicity=(id,data)=>update('publicity',id,data,'Ad_ID'); const deletePublicity=(id)=>remove('publicity',id);
  const resetToDefaultData=()=>{ localStorage.removeItem('nitt_ca_auth_user'); refresh(); };

  return <DataContext.Provider value={{departments,venues,coordinators,events,eventCoordinators,sponsors,publicity,participants,registrations,accommodations,hospitality,evaluations,certificates,completionReports,photographs,notifications,walletBalances,backendLoading,backendError,refresh,getDepartment,getVenue,getCoordinator,getParticipant,getEvent,getWalletBalance,addWalletFunds,getEventCoordinators,getEventSponsors,getEventPublicity,getEventRegistrations,getParticipantRegistrations,getEventCompletionReport,getReportPhotographs,getEventPhotographs,addEvent,updateEvent,deleteEvent,addDepartment,updateDepartment,deleteDepartment,addVenue,updateVenue,deleteVenue,addCoordinator,updateCoordinator,deleteCoordinator,assignEventCoordinator,removeEventCoordinator,addParticipant,updateParticipant,deleteParticipant,registerForEvent,payForEvent,updateRegistrationStatus,requestAccommodation,updateAccommodation,payForAccommodation,addHospitality,updateHospitality,deleteHospitality,submitEvaluation,generateCertificate,saveCompletionReport,uploadPhotograph,deletePhotograph,addSponsor,updateSponsor,deleteSponsor,addPublicity,updatePublicity,deletePublicity,resetToDefaultData}}>{children}</DataContext.Provider>;
};
export const useData=()=>{const context=useContext(DataContext);if(!context)throw new Error('useData must be used within a DataProvider');return context;};
