// NIT Trichy - Department of Computer Applications
// Comprehensive Referential Mock Database corresponding 1:1 with ER Diagram

export const REMOVED_EVENT_IDS = ['EVT-101', 'EVT-102', 'EVT-103', 'EVT-104', 'EVT-105', 'EVT-106'];

export const INITIAL_DEPARTMENTS = [
  {
    Dept_ID: 'DEPT-CA',
    Dept_Name: 'Department of Computer Applications',
    HOD_Name: 'Admin',
    Contact_Email: 'hodca@nitt.edu',
    Contact_Phone: '+91 431 2503731',
    Description: 'Premier department offering MCA, M.Sc Computer Science, and Ph.D. programs with state-of-the-art computing labs.'
  },
  {
    Dept_ID: 'DEPT-CSE',
    Dept_Name: 'Department of Computer Science & Engineering',
    HOD_Name: 'Admin',
    Contact_Email: 'hodcse@nitt.edu',
    Contact_Phone: '+91 431 2503201',
    Description: 'Focuses on core computing systems, distributed computing, algorithms, and artificial intelligence.'
  },
  {
    Dept_ID: 'DEPT-ECE',
    Dept_Name: 'Department of Electronics & Communication',
    HOD_Name: 'Admin',
    Contact_Email: 'hodece@nitt.edu',
    Contact_Phone: '+91 431 2503301',
    Description: 'Specializes in signal processing, VLSI systems, embedded systems, and telecommunications.'
  },
  {
    Dept_ID: 'DEPT-DOMS',
    Dept_Name: 'Department of Management Studies',
    HOD_Name: 'Admin',
    Contact_Email: 'hodmba@nitt.edu',
    Contact_Phone: '+91 431 2503701',
    Description: 'Interdisciplinary business analytics, techno-management, and entrepreneurship incubation.'
  }
];

export const INITIAL_VENUES = [
  {
    Venue_ID: 'VEN-01',
    Venue_Name: 'CA Seminar Hall',
    Location: 'Department of CA Ground Floor, Lyceum Complex',
    Capacity: 160,
    Venue_Type: 'Seminar Hall',
    Facilities: '4K Laser Projector, Surround Audio, Central AC, High-speed Wi-Fi, Stage Podium'
  },
  {
    Venue_ID: 'VEN-02',
    Venue_Name: 'Barn Hall Auditorium',
    Location: 'Administrative Quadrangle, Central Zone',
    Capacity: 500,
    Venue_Type: 'Auditorium',
    Facilities: 'Tiered Seating, Professional Acoustic Panels, Dual Stage Displays, Green Rooms'
  },
  {
    Venue_ID: 'VEN-03',
    Venue_Name: 'Orion Lecture Complex - Audi 1',
    Location: 'East Academic Zone, Near Chemical Engg',
    Capacity: 850,
    Venue_Type: 'Mega Auditorium',
    Facilities: 'Conference Streaming Setup, Dolby Atmos, VIP Lounge, Press Media Box'
  },
  {
    Venue_ID: 'VEN-04',
    Venue_Name: 'Octagon Computer Center - Lab 3',
    Location: 'Octagon Computer Center 1st Floor',
    Capacity: 120,
    Venue_Type: 'Computer Lab',
    Facilities: '120 High-End Dell Workstations (GPU enabled), Gigabit LAN, UPS Backup'
  },
  {
    Venue_ID: 'VEN-05',
    Venue_Name: 'CSG Training Hall',
    Location: 'Computer Support Group Building',
    Capacity: 90,
    Venue_Type: 'Hands-on Lab',
    Facilities: 'Dual-monitor developer desks, Cloud sandbox access, interactive smartboards'
  }
];

export const INITIAL_COORDINATORS = [
  {
    Coordinator_ID: 'COORD-01',
    Name: 'Coordinator 1',
    Designation: 'Associate Professor',
    Email: 'coordinator1@example.com',
    Contact: '+91 9486001122',
    Role: 'Faculty Coordinator',
    Department: 'DEPT-CA',
    Specialization: 'Machine Learning, Intelligent Systems, Data Mining'
  },
  {
    Coordinator_ID: 'COORD-02',
    Name: 'Coordinator 2',
    Designation: 'Professor',
    Email: 'coordinator2@example.com',
    Contact: '+91 9486002233',
    Role: 'Symposium Convener',
    Department: 'DEPT-CA',
    Specialization: 'Parallel Algorithms, Data Structures, High-Performance Computing'
  },
  {
    Coordinator_ID: 'COORD-03',
    Name: 'Coordinator 3',
    Designation: 'Professor',
    Email: 'coordinator3@example.com',
    Contact: '+91 9486003344',
    Role: 'Technical Chair',
    Department: 'DEPT-CA',
    Specialization: 'Cloud Computing, Software Engineering, Web Technologies'
  },
  {
    Coordinator_ID: 'COORD-04',
    Name: 'Coordinator 4',
    Designation: 'Professor',
    Email: 'coordinator4@example.com',
    Contact: '+91 9486004455',
    Role: 'Staff Advisor',
    Department: 'DEPT-CA',
    Specialization: 'Computer Networks, Cyber Security, Cryptography'
  },
  {
    Coordinator_ID: 'COORD-05',
    Name: 'Coordinator 5',
    Designation: 'Assistant Professor',
    Email: 'coordinator5@example.com',
    Contact: '+91 9486005566',
    Role: 'Organizing Secretary',
    Department: 'DEPT-CA',
    Specialization: 'Database Systems, Big Data Analytics, NLP'
  }
];

export const INITIAL_EVENTS = [
  {
    Event_ID: 'EVT-101',
    Event_Name: 'AI & Deep Learning National Bootcamp',
    Event_Type: 'Workshop',
    Start_Date: '2026-10-15',
    End_Date: '2026-10-17',
    Description: 'An intensive 3-day hands-on boot camp covering Deep Learning architectures, PyTorch, Large Language Model fine-tuning, and deployment on edge devices.',
    Budget: 125000,
    Status: 'Upcoming',
    Dept_ID: 'DEPT-CA',
    Venue_ID: 'VEN-01',
    RegistrationFee: 99,
    MaxParticipants: 150,
    Banner: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1000&q=80',
    TargetAudience: 'MCA, M.Tech, B.Tech, Ph.D. Scholars & Industry Professionals'
  },
  {
    Event_ID: 'EVT-102',
    Event_Name: 'Version 2026 - All India MCA Symposium',
    Event_Type: 'Symposium',
    Start_Date: '2026-10-25',
    End_Date: '2026-10-26',
    Description: 'The flagship national-level technical symposium hosted annually by the Department of Computer Applications, NIT Trichy, featuring 14+ technical events and hackathons.',
    Budget: 350000,
    Status: 'Upcoming',
    Dept_ID: 'DEPT-CA',
    Venue_ID: 'VEN-02',
    RegistrationFee: 99,
    MaxParticipants: 450,
    Banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    TargetAudience: 'MCA & Computer Science students from all Indian Universities'
  },
  {
    Event_ID: 'EVT-103',
    Event_Name: 'CyberSecurity & Ethical Hacking Conclave',
    Event_Type: 'Seminar',
    Start_Date: '2026-11-05',
    End_Date: '2026-11-06',
    Description: 'Conclave focusing on modern zero-trust architecture, red-teaming fundamentals, threat hunting, vulnerability assessment, and live Capture the Flag (CTF) demos.',
    Budget: 95000,
    Status: 'Upcoming',
    Dept_ID: 'DEPT-CA',
    Venue_ID: 'VEN-04',
    RegistrationFee: 99,
    MaxParticipants: 120,
    Banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80',
    TargetAudience: 'Cyber Security Enthusiasts, Researchers & Developers'
  },
  {
    Event_ID: 'EVT-104',
    Event_Name: 'National Data Science & Analytics Summit',
    Event_Type: 'Conference',
    Start_Date: '2026-09-10',
    End_Date: '2026-09-12',
    Description: 'A high-impact conference bringing premier researchers from academia and silicon valley leaders together to present state-of-the-art predictive analytics and AI systems.',
    Budget: 180000,
    Status: 'Completed',
    Dept_ID: 'DEPT-CA',
    Venue_ID: 'VEN-03',
    RegistrationFee: 99,
    MaxParticipants: 350,
    Banner: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
    TargetAudience: 'Data Scientists, Researchers, Postgraduate Scholars'
  },
  {
    Event_ID: 'EVT-105',
    Event_Name: 'CodeCraft - National Algorithmic Hackathon',
    Event_Type: 'Competition',
    Start_Date: '2026-11-12',
    End_Date: '2026-11-13',
    Description: 'A 24-hour continuous coding hackathon testing algorithmic efficiency, system design, competitive programming, and rapid MVP development.',
    Budget: 110000,
    Status: 'Upcoming',
    Dept_ID: 'DEPT-CA',
    Venue_ID: 'VEN-05',
    RegistrationFee: 99,
    MaxParticipants: 90,
    Banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
    TargetAudience: 'Competitive Programmers & Software Engineers'
  },
  {
    Event_ID: 'EVT-106',
    Event_Name: 'Department Project Expo & Industry Fair',
    Event_Type: 'Exhibition',
    Start_Date: '2026-11-20',
    End_Date: '2026-11-21',
    Description: 'Final year MCA & M.Sc student innovation demonstration showcasing sponsored R&D products to prominent tech recruiters and venture incubators.',
    Budget: 85000,
    Status: 'Upcoming',
    Dept_ID: 'DEPT-CA',
    Venue_ID: 'VEN-01',
    RegistrationFee: 99,
    MaxParticipants: 200,
    Banner: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
    TargetAudience: 'Students, Faculty, Industry Mentors & Alumni'
  }
];

const STUDENT_ACTIVITY_CATEGORIES = [
  { type: 'Technical', names: ['Hackathon', 'Seminars', 'Workshops', 'Technical Quiz', 'Web Design Challenge'] },
  { type: 'Non-Technical', names: ['Debate', 'Just A Minute (JAM)', 'Meme Making', 'Short Film', 'Talent Show'] },
  { type: 'Fun Activity', names: ['Treasure Hunt', 'Dumb Charades', 'Guess the Song', 'Blind Drawing'] }
];

const activityDates = ['2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22'];
const activityBanners = {
  Hackathon: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
  Seminars: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
  Workshops: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
  'Technical Quiz': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
  'Web Design Challenge': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
  Debate: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80',
  'Just A Minute (JAM)': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
  'Meme Making': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=80',
  'Short Film': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=80',
  'Talent Show': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80',
  'Treasure Hunt': 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80',
  'Dumb Charades': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
  'Guess the Song': 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=80',
  'Blind Drawing': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80'
};

export const LEGACY_SHARED_ACTIVITY_BANNERS = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=80'
];

export const INITIAL_STUDENT_ACTIVITIES = STUDENT_ACTIVITY_CATEGORIES.flatMap(({ type, names }) =>
  names.map((name, index) => ({
    Event_ID: `EVT-${201 + STUDENT_ACTIVITY_CATEGORIES.slice(0, STUDENT_ACTIVITY_CATEGORIES.findIndex((category) => category.type === type)).reduce((total, category) => total + category.names.length, 0) + index}`,
    Event_Name: name,
    Event_Type: type,
    Start_Date: activityDates[index % activityDates.length],
    End_Date: activityDates[index % activityDates.length],
    Description: `${name} — join this ${type.toLowerCase()} activity at NIT Trichy. Register to take part and view event updates.`,
    Budget: 0,
    Status: 'Upcoming',
    Dept_ID: 'DEPT-CA',
    Venue_ID: 'VEN-01',
    RegistrationFee: 99,
    MaxParticipants: 100,
    Banner: activityBanners[name],
    TargetAudience: 'Students'
  }))
);

INITIAL_EVENTS.push(...INITIAL_STUDENT_ACTIVITIES);

export const INITIAL_EVENT_COORDINATORS = [
  { Event_ID: 'EVT-101', Coordinator_ID: 'COORD-01', Assigned_Role: 'Chief Organizing Secretary' },
  { Event_ID: 'EVT-101', Coordinator_ID: 'COORD-03', Assigned_Role: 'Hands-on Lab Supervisor' },
  { Event_ID: 'EVT-102', Coordinator_ID: 'COORD-02', Assigned_Role: 'Symposium Convener' },
  { Event_ID: 'EVT-102', Coordinator_ID: 'COORD-04', Assigned_Role: 'Sponsorship & Finance Lead' },
  { Event_ID: 'EVT-102', Coordinator_ID: 'COORD-05', Assigned_Role: 'Events & Scheduling Manager' },
  { Event_ID: 'EVT-103', Coordinator_ID: 'COORD-04', Assigned_Role: 'Technical Program Chair' },
  { Event_ID: 'EVT-104', Coordinator_ID: 'COORD-01', Assigned_Role: 'Conference General Chair' },
  { Event_ID: 'EVT-104', Coordinator_ID: 'COORD-05', Assigned_Role: 'Editorial & Proceedings Head' },
  { Event_ID: 'EVT-105', Coordinator_ID: 'COORD-02', Assigned_Role: 'Lead Problem Setter & Judge' },
  { Event_ID: 'EVT-106', Coordinator_ID: 'COORD-03', Assigned_Role: 'Exhibition Coordinator' }
];

export const INITIAL_SPONSORS = [
  {
    Sponsor_ID: 'SPON-01',
    Sponsor_Name: 'Tata Consultancy Services (TCS)',
    Contact: '+91 80 67890000',
    Amount_Contributed: 150000,
    Event_ID: 'EVT-102',
    LogoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80',
    Tier: 'Platinum Title Sponsor'
  },
  {
    Sponsor_ID: 'SPON-02',
    Sponsor_Name: 'Google Cloud Education',
    Contact: '+91 124 4567890',
    Amount_Contributed: 200000,
    Event_ID: 'EVT-101',
    LogoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=150&q=80',
    Tier: 'Cloud Computing Partner'
  },
  {
    Sponsor_ID: 'SPON-03',
    Sponsor_Name: 'Zoho Corporation',
    Contact: '+91 44 67447000',
    Amount_Contributed: 80000,
    Event_ID: 'EVT-105',
    LogoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=150&q=80',
    Tier: 'Associate Sponsor'
  },
  {
    Sponsor_ID: 'SPON-04',
    Sponsor_Name: 'Infosys Springboard',
    Contact: '+91 80 28520261',
    Amount_Contributed: 100000,
    Event_ID: 'EVT-104',
    LogoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80',
    Tier: 'Knowledge Partner'
  }
];

export const INITIAL_PUBLICITY = [
  {
    Ad_ID: 'PUB-01',
    Event_ID: 'EVT-101',
    Medium: 'Institute Website & Circular',
    Publish_Date: '2026-09-01',
    Reach_Count: 14200,
    Content_Link: 'https://nitt.edu/events/aiml-bootcamp-2026',
    Status: 'Active'
  },
  {
    Ad_ID: 'PUB-02',
    Event_ID: 'EVT-102',
    Medium: 'Instagram Official Handle (@nitt_ca_version)',
    Publish_Date: '2026-09-15',
    Reach_Count: 18500,
    Content_Link: 'https://instagram.com/nitt_ca_version',
    Status: 'Active'
  },
  {
    Ad_ID: 'PUB-03',
    Event_ID: 'EVT-102',
    Medium: 'Campus Posters & Flyers Across Colleges',
    Publish_Date: '2026-09-18',
    Reach_Count: 4200,
    Content_Link: 'https://nitt.edu/ca/version/poster.pdf',
    Status: 'Active'
  },
  {
    Ad_ID: 'PUB-04',
    Event_ID: 'EVT-104',
    Medium: 'LinkedIn Professional Outreach',
    Publish_Date: '2026-08-15',
    Reach_Count: 22600,
    Content_Link: 'https://linkedin.com/events/nitt-datascience-2026',
    Status: 'Completed'
  },
  {
    Ad_ID: 'PUB-05',
    Event_ID: 'EVT-105',
    Medium: 'College WhatsApp & Telegram Networks',
    Publish_Date: '2026-09-20',
    Reach_Count: 8900,
    Content_Link: 'https://t.me/nitt_codecraft_official',
    Status: 'Active'
  }
];

export const INITIAL_PARTICIPANTS = [
  {
    Participant_ID: 'PART-001',
    Name: 'Prasad',
    Email: 'prasad45@gmail.com',
    Phone: '+91 9876543210',
    Category: 'Student',
    Institution_Name: 'National Institute of Technology, Tiruchirappalli',
    Branch: 'Computer Applications (MCA)',
    Year_of_Study: '2nd Year',
    Roll_No: '205123045',
    Avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  {
    Participant_ID: 'PART-002',
    Name: 'xyz',
    Email: 'xyz@gmail.com',
    Phone: '+91 9876543211',
    Category: 'External Student',
    Institution_Name: 'National Institute of Technology Karnataka, Surathkal',
    Branch: 'Information Technology',
    Year_of_Study: '3rd Year',
    Roll_No: '21IT089',
    Avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    Participant_ID: 'PART-003',
    Name: 'Student 3',
    Email: 'student3@example.com',
    Phone: '+91 9876543212',
    Category: 'Research Scholar',
    Institution_Name: 'Indian Institute of Technology, Madras',
    Branch: 'Computer Science & Engineering',
    Year_of_Study: 'PhD 2nd Year',
    Roll_No: 'CS22D014',
    Avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
  },
  {
    Participant_ID: 'PART-004',
    Name: 'Student 4',
    Email: 'student4@example.com',
    Phone: '+91 9876543213',
    Category: 'External Student',
    Institution_Name: 'Vellore Institute of Technology, Vellore',
    Branch: 'Software Engineering',
    Year_of_Study: '4th Year',
    Roll_No: '20BSE0112',
    Avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80'
  },
  {
    Participant_ID: 'PART-005',
    Name: 'Student 5',
    Email: 'student5@example.com',
    Phone: '+91 9876543214',
    Category: 'Student',
    Institution_Name: 'National Institute of Technology, Tiruchirappalli',
    Branch: 'M.Sc Computer Science',
    Year_of_Study: '1st Year',
    Roll_No: '205224018',
    Avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    Participant_ID: 'PART-006',
    Name: 'Student 6',
    Email: 'student6@example.com',
    Phone: '+91 9876543215',
    Category: 'External Student',
    Institution_Name: 'PSG College of Technology, Coimbatore',
    Branch: 'B.Tech IT',
    Year_of_Study: '3rd Year',
    Roll_No: '21IT502',
    Avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  }
];

export const INITIAL_REGISTRATIONS = [
  {
    Registration_ID: 'REG-2026-009',
    Participant_ID: 'PART-001',
    Event_ID: 'EVT-201',
    Registration_Date: '2026-09-29',
    Fee_Paid: 99,
    Payment_Status: 'Confirmed',
    Registration_Type: 'Individual Participant',
    Status: 'Confirmed'
  },
  {
    Registration_ID: 'REG-2026-010',
    Participant_ID: 'PART-001',
    Event_ID: 'EVT-205',
    Registration_Date: '2026-09-29',
    Fee_Paid: 99,
    Payment_Status: 'Confirmed',
    Registration_Type: 'Individual Participant',
    Status: 'Confirmed'
  },
  {
    Registration_ID: 'REG-2026-011',
    Participant_ID: 'PART-001',
    Event_ID: 'EVT-211',
    Registration_Date: '2026-09-29',
    Fee_Paid: 99,
    Payment_Status: 'Confirmed',
    Registration_Type: 'Individual Participant',
    Status: 'Confirmed'
  },
  {
    Registration_ID: 'REG-2026-004',
    Participant_ID: 'PART-002',
    Event_ID: 'EVT-101',
    Registration_Date: '2026-09-21',
    Fee_Paid: 500,
    Payment_Status: 'Confirmed',
    Registration_Type: 'Individual Participant',
    Status: 'Confirmed'
  },
  {
    Registration_ID: 'REG-2026-005',
    Participant_ID: 'PART-002',
    Event_ID: 'EVT-102',
    Registration_Date: '2026-09-22',
    Fee_Paid: 750,
    Payment_Status: 'Pending',
    Registration_Type: 'Symposium Delegate',
    Status: 'Pending'
  },
  {
    Registration_ID: 'REG-2026-006',
    Participant_ID: 'PART-003',
    Event_ID: 'EVT-104',
    Registration_Date: '2026-08-28',
    Fee_Paid: 600,
    Payment_Status: 'Confirmed',
    Registration_Type: 'Research Presenter',
    Status: 'Completed'
  },
  {
    Registration_ID: 'REG-2026-007',
    Participant_ID: 'PART-004',
    Event_ID: 'EVT-101',
    Registration_Date: '2026-09-24',
    Fee_Paid: 500,
    Payment_Status: 'Confirmed',
    Registration_Type: 'Individual Participant',
    Status: 'Confirmed'
  },
  {
    Registration_ID: 'REG-2026-008',
    Participant_ID: 'PART-005',
    Event_ID: 'EVT-104',
    Registration_Date: '2026-08-20',
    Fee_Paid: 0,
    Payment_Status: 'Exempted',
    Registration_Type: 'Student Volunteer',
    Status: 'Completed'
  }
];

export const INITIAL_ACCOMMODATIONS = [
  {
    Accommodation_ID: 'ACC-101',
    Participant_ID: 'PART-001',
    Room_No: 'B-304',
    Hostel_Block: 'Garnet-A Hostel',
    Check_in_Date: '2026-10-14',
    Check_out_Date: '2026-10-18',
    Status: 'Approved',
    Notes: 'Allocated for AI Bootcamp duration. Key collection from Warden office.'
  },
  {
    Accommodation_ID: 'ACC-102',
    Participant_ID: 'PART-002',
    Room_No: 'G-112',
    Hostel_Block: 'Opal-B Hostel (Girls)',
    Check_in_Date: '2026-10-14',
    Check_out_Date: '2026-10-18',
    Status: 'Approved',
    Notes: 'External student allocation with complimentary linen kit.'
  },
  {
    Accommodation_ID: 'ACC-103',
    Participant_ID: 'PART-004',
    Room_No: 'Unassigned',
    Hostel_Block: 'Opal-C Hostel (Girls)',
    Check_in_Date: '2026-10-24',
    Check_out_Date: '2026-10-27',
    Status: 'Pending',
    Notes: 'Requested room for Version 2026 symposium.'
  }
];

export const INITIAL_HOSPITALITY = [
  {
    Hospitality_ID: 'HOSP-201',
    Participant_ID: 'PART-001',
    Event_ID: 'EVT-101',
    Meal_Type: 'Breakfast + Lunch + High Tea + Banquet Dinner',
    Date: '2026-10-15',
    Transport_Provided: 'Campus Shuttle Bus (Hostel to Venue)'
  },
  {
    Hospitality_ID: 'HOSP-202',
    Participant_ID: 'PART-001',
    Event_ID: 'EVT-101',
    Meal_Type: 'Breakfast + Working Lunch + High Tea',
    Date: '2026-10-16',
    Transport_Provided: 'Campus Shuttle Bus'
  },
  {
    Hospitality_ID: 'HOSP-203',
    Participant_ID: 'PART-002',
    Event_ID: 'EVT-101',
    Meal_Type: 'Full Day Vegetarian / Non-Veg Buffet',
    Date: '2026-10-15',
    Transport_Provided: 'Trichy Junction Railway Station Pickup (Bus #4)'
  },
  {
    Hospitality_ID: 'HOSP-204',
    Participant_ID: 'PART-001',
    Event_ID: 'EVT-104',
    Meal_Type: 'Executive Conference Luncheon + High Tea',
    Date: '2026-09-11',
    Transport_Provided: 'Airport / Station Direct Cab'
  }
];

export const INITIAL_EVALUATIONS = [
  {
    Evaluation_ID: 'EVAL-501',
    Participant_ID: 'PART-001',
    Event_ID: 'EVT-104',
    Evaluator_ID: 'COORD-01',
    Score: 4.8,
    RatingCategories: {
      overall: 5,
      organization: 5,
      contentQuality: 5,
      venueAndHospitality: 4
    },
    Feedback: 'Exceptional hands-on lab sessions on Large Language Models. Logistics, keynote speakers, and food arrangements were truly world-class.',
    Evaluation_Date: '2026-09-13'
  },
  {
    Evaluation_ID: 'EVAL-502',
    Participant_ID: 'PART-003',
    Event_ID: 'EVT-104',
    Evaluator_ID: 'COORD-01',
    Score: 4.6,
    RatingCategories: {
      overall: 5,
      organization: 4,
      contentQuality: 5,
      venueAndHospitality: 4.5
    },
    Feedback: 'The research tracks offered rigorous peer reviews. Looking forward to more high-performance computing workshops in the Department of CA.',
    Evaluation_Date: '2026-09-14'
  },
  {
    Evaluation_ID: 'EVAL-503',
    Participant_ID: 'PART-005',
    Event_ID: 'EVT-104',
    Evaluator_ID: 'COORD-05',
    Score: 4.9,
    RatingCategories: {
      overall: 5,
      organization: 5,
      contentQuality: 5,
      venueAndHospitality: 5
    },
    Feedback: 'As a student volunteer and participant, this was a transformative learning journey. Seamless execution across all sessions.',
    Evaluation_Date: '2026-09-14'
  }
];

export const INITIAL_CERTIFICATES = [
  {
    Certificate_ID: 'CERT-901',
    Participant_ID: 'PART-001',
    Event_ID: 'EVT-104',
    Certificate_Type: 'Outstanding Research Presenter (1st Place)',
    Issue_Date: '2026-09-15',
    Certificate_No: 'NITT/CA/2026/DS-001',
    Title: 'Certificate of Excellence',
    IssuedBy: 'Admin & Coordinator'
  },
  {
    Certificate_ID: 'CERT-902',
    Participant_ID: 'PART-003',
    Event_ID: 'EVT-104',
    Certificate_Type: 'Certificate of Participation',
    Issue_Date: '2026-09-15',
    Certificate_No: 'NITT/CA/2026/DS-045',
    Title: 'Certificate of Participation',
    IssuedBy: 'Admin & Coordinator'
  },
  {
    Certificate_ID: 'CERT-903',
    Participant_ID: 'PART-005',
    Event_ID: 'EVT-104',
    Certificate_Type: 'Certificate of Appreciation (Volunteer)',
    Issue_Date: '2026-09-15',
    Certificate_No: 'NITT/CA/2026/VOL-012',
    Title: 'Certificate of Appreciation',
    IssuedBy: 'Admin & Coordinator'
  }
];

export const INITIAL_COMPLETION_REPORTS = [
  {
    Report_ID: 'REP-301',
    Event_ID: 'EVT-104',
    Prepared_By: 'COORD-01',
    Report_Date: '2026-09-16',
    Summary: 'The 3-day National Data Science & Analytics Summit concluded successfully with 320 registered participants from 28 premier universities across India. The summit featured 6 keynote addresses by distinguished IEEE fellows, 4 hands-on deep-dive workshops, and an active research poster track with 42 submitted research papers. Total expenditure remained within the allocated budget of Rs. 1,80,000 with a surplus of Rs. 18,500. Feedback scores averaged 4.78 / 5.0.',
    No_of_Participants: 320,
    KeyOutcomes: [
      '32 research papers accepted for indexed proceedings publication',
      '2 Memorandums of Understanding (MoU) initiated with Cloud partners',
      'Hands-on training provided to 180 postgraduate scholars in modern LLM fine-tuning'
    ],
    FinancialSummary: {
      ApprovedBudget: 180000,
      TotalExpenditure: 161500,
      SponsorshipCollected: 100000,
      RegistrationRevenue: 192000,
      Surplus: 130500
    }
  }
];

export const INITIAL_PHOTOGRAPHS = [
  {
    Photo_ID: 'PHT-701',
    Report_ID: 'REP-301',
    Photo_URL: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    Caption: 'Inauguration Ceremony & Lighting of Kuthu Vilakku by Director & HOD CA in Barn Hall',
    Uploaded_Date: '2026-09-16'
  },
  {
    Photo_ID: 'PHT-702',
    Report_ID: 'REP-301',
    Photo_URL: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    Caption: 'Interactive hands-on practical session on PyTorch in Octagon Computer Center',
    Uploaded_Date: '2026-09-16'
  },
  {
    Photo_ID: 'PHT-703',
    Report_ID: 'REP-301',
    Photo_URL: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    Caption: 'Keynote lecture on Next-Gen Generative AI Architectures delivered in Orion Audi 1',
    Uploaded_Date: '2026-09-16'
  },
  {
    Photo_ID: 'PHT-704',
    Report_ID: 'REP-301',
    Photo_URL: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    Caption: 'Valedictory function and distribution of Certificate of Excellence to top performers',
    Uploaded_Date: '2026-09-16'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-1',
    recipient: 'student',
    title: 'Registration Confirmed: AI Bootcamp 2026',
    message: 'Your registration REG-2026-001 for AI & Deep Learning Bootcamp is verified and confirmed.',
    time: '2 hours ago',
    read: false,
    type: 'success'
  },
  {
    id: 'NOTIF-2',
    recipient: 'student',
    title: 'Hostel Accommodation Approved',
    message: 'Room B-304 in Garnet-A Hostel is allocated for your stay from 14-Oct-2026.',
    time: '5 hours ago',
    read: false,
    type: 'info'
  },
  {
    id: 'NOTIF-3',
    recipient: 'student',
    title: 'Certificate Ready for Download',
    message: 'Your Certificate of Excellence for Data Science Summit is now available under My Certificates.',
    time: '1 day ago',
    read: true,
    type: 'certificate'
  },
  {
    id: 'NOTIF-4',
    recipient: 'admin',
    title: 'New Accommodation Request',
    message: 'Student 4 (PART-004) requested accommodation for Version 2026.',
    time: '30 minutes ago',
    read: false,
    type: 'warning'
  },
  {
    id: 'NOTIF-5',
    recipient: 'admin',
    title: 'Sponsorship Received',
    message: 'Google Cloud Education credited Rs. 2,00,000 for AI & Deep Learning Bootcamp.',
    time: '3 hours ago',
    read: false,
    type: 'success'
  }
];
