// Metadata and Schema Documentation for all 15 ER Entities
// Matches 100% with the NIT Trichy Department of CA ER Diagram

export const ER_ENTITIES = [
  {
    name: 'DEPARTMENT',
    table: 'DEPARTMENT',
    pk: 'Dept_ID',
    description: 'Academic departments organizing events within the institute.',
    attributes: [
      { name: 'Dept_ID', type: 'VARCHAR(20)', key: 'PK', desc: 'Unique Department Identifier' },
      { name: 'Dept_Name', type: 'VARCHAR(100)', key: '', desc: 'Official Name of Department' },
      { name: 'HOD_Name', type: 'VARCHAR(100)', key: '', desc: 'Head of Department' },
      { name: 'Contact_Email', type: 'VARCHAR(100)', key: '', desc: 'Official Email' },
      { name: 'Contact_Phone', type: 'VARCHAR(20)', key: '', desc: 'Direct Phone Number' }
    ],
    relationships: [
      { type: '1 : M', target: 'EVENT', via: 'Organizes', fk: 'EVENT.Dept_ID' }
    ]
  },
  {
    name: 'EVENT',
    table: 'EVENT',
    pk: 'Event_ID',
    description: 'Core entity representing all institutional symposiums, workshops, seminars, and conferences.',
    attributes: [
      { name: 'Event_ID', type: 'VARCHAR(20)', key: 'PK', desc: 'Unique Event Code' },
      { name: 'Event_Name', type: 'VARCHAR(150)', key: '', desc: 'Title of the Event' },
      { name: 'Event_Type', type: 'VARCHAR(50)', key: '', desc: 'Workshop, Symposium, Seminar, etc.' },
      { name: 'Start_Date', type: 'DATE', key: '', desc: 'Event Commencement Date' },
      { name: 'End_Date', type: 'DATE', key: '', desc: 'Event Conclusion Date' },
      { name: 'Description', type: 'TEXT', key: '', desc: 'Detailed event scope' },
      { name: 'Budget', type: 'DECIMAL(12,2)', key: '', desc: 'Sanctioned Event Budget' },
      { name: 'Status', type: 'VARCHAR(30)', key: '', desc: 'Upcoming, Active, Completed, Cancelled' },
      { name: 'Dept_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'Foreign Key referencing DEPARTMENT(Dept_ID)' },
      { name: 'Venue_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'Foreign Key referencing VENUE(Venue_ID)' }
    ],
    relationships: [
      { type: 'M : 1', target: 'DEPARTMENT', via: 'Organizes', fk: 'Dept_ID' },
      { type: 'M : 1', target: 'VENUE', via: 'Held_At', fk: 'Venue_ID' },
      { type: 'M : N', target: 'COORDINATOR', via: 'EVENT_COORDINATOR', fk: 'Event_ID' },
      { type: 'M : N', target: 'SPONSOR', via: 'Sponsors', fk: 'SPONSOR.Event_ID' },
      { type: '1 : M', target: 'PUBLICITY', via: 'Advertised_Through', fk: 'PUBLICITY.Event_ID' },
      { type: 'M : N', target: 'PARTICIPANT', via: 'REGISTRATION', fk: 'REGISTRATION.Event_ID' },
      { type: 'M : N', target: 'PARTICIPANT', via: 'EVALUATION', fk: 'EVALUATION.Event_ID' },
      { type: '1 : 1', target: 'COMPLETION_REPORT', via: 'Results_In', fk: 'COMPLETION_REPORT.Event_ID' },
      { type: 'M : N', target: 'PARTICIPANT', via: 'CERTIFICATE', fk: 'CERTIFICATE.Event_ID' },
      { type: '1 : M', target: 'HOSPITALITY', via: 'Hospitality', fk: 'HOSPITALITY.Event_ID' }
    ]
  },
  {
    name: 'VENUE',
    table: 'VENUE',
    pk: 'Venue_ID',
    description: 'Physical campus locations, auditoriums, and computing centers.',
    attributes: [
      { name: 'Venue_ID', type: 'VARCHAR(20)', key: 'PK', desc: 'Unique Venue ID' },
      { name: 'Venue_Name', type: 'VARCHAR(100)', key: '', desc: 'Name of Venue (Barn Hall, Orion, etc.)' },
      { name: 'Location', type: 'VARCHAR(150)', key: '', desc: 'Campus zone & directions' },
      { name: 'Capacity', type: 'INT', key: '', desc: 'Maximum Seating Capacity' },
      { name: 'Venue_Type', type: 'VARCHAR(50)', key: '', desc: 'Auditorium, Seminar Hall, Lab' }
    ],
    relationships: [
      { type: '1 : M', target: 'EVENT', via: 'Held_At', fk: 'EVENT.Venue_ID' }
    ]
  },
  {
    name: 'COORDINATOR',
    table: 'COORDINATOR',
    pk: 'Coordinator_ID',
    description: 'Faculty members and staff responsible for overseeing events.',
    attributes: [
      { name: 'Coordinator_ID', type: 'VARCHAR(20)', key: 'PK', desc: 'Coordinator Identification' },
      { name: 'Name', type: 'VARCHAR(100)', key: '', desc: 'Faculty Name' },
      { name: 'Designation', type: 'VARCHAR(80)', key: '', desc: 'Professor, Associate Professor, etc.' },
      { name: 'Email', type: 'VARCHAR(100)', key: '', desc: 'Official Institute Email' },
      { name: 'Contact', type: 'VARCHAR(20)', key: '', desc: 'Mobile/Office Ext' },
      { name: 'Role', type: 'VARCHAR(50)', key: '', desc: 'Faculty Coordinator, Convener, etc.' }
    ],
    relationships: [
      { type: 'M : N', target: 'EVENT', via: 'EVENT_COORDINATOR', fk: 'Coordinator_ID' }
    ]
  },
  {
    name: 'EVENT_COORDINATOR',
    table: 'EVENT_COORDINATOR',
    pk: '(Event_ID, Coordinator_ID)',
    description: 'Associative entity resolving M:N relationship between EVENT and COORDINATOR.',
    attributes: [
      { name: 'Event_ID', type: 'VARCHAR(20)', key: 'PK, FK', desc: 'References EVENT(Event_ID)' },
      { name: 'Coordinator_ID', type: 'VARCHAR(20)', key: 'PK, FK', desc: 'References COORDINATOR(Coordinator_ID)' },
      { name: 'Assigned_Role', type: 'VARCHAR(80)', key: '', desc: 'Role in this specific event' }
    ],
    relationships: [
      { type: 'M : 1', target: 'EVENT', via: 'Event_ID', fk: 'Event_ID' },
      { type: 'M : 1', target: 'COORDINATOR', via: 'Coordinator_ID', fk: 'Coordinator_ID' }
    ]
  },
  {
    name: 'SPONSOR',
    table: 'SPONSOR',
    pk: 'Sponsor_ID',
    description: 'Corporate and industry partners funding and endorsing events.',
    attributes: [
      { name: 'Sponsor_ID', type: 'VARCHAR(20)', key: 'PK', desc: 'Unique Sponsor Identifier' },
      { name: 'Sponsor_Name', type: 'VARCHAR(150)', key: '', desc: 'Organization / Company Name' },
      { name: 'Contact', type: 'VARCHAR(50)', key: '', desc: 'Corporate Representative Contact' },
      { name: 'Amount_Contributed', type: 'DECIMAL(12,2)', key: '', desc: 'Financial Sponsorship' },
      { name: 'Event_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'References EVENT(Event_ID)' }
    ],
    relationships: [
      { type: 'M : N', target: 'EVENT', via: 'Sponsors', fk: 'Event_ID' }
    ]
  },
  {
    name: 'PUBLICITY',
    table: 'PUBLICITY',
    pk: 'Ad_ID',
    description: 'Marketing channels, digital notices, flyers, and social reach campaigns.',
    attributes: [
      { name: 'Ad_ID', type: 'VARCHAR(20)', key: 'PK', desc: 'Advertisement Campaign Code' },
      { name: 'Event_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'References EVENT(Event_ID)' },
      { name: 'Medium', type: 'VARCHAR(80)', key: '', desc: 'Website, Instagram, Posters, Email' },
      { name: 'Publish_Date', type: 'DATE', key: '', desc: 'Date of release' },
      { name: 'Reach_Count', type: 'INT', key: '', desc: 'Audience Impressions / Views' },
      { name: 'Content_Link', type: 'VARCHAR(255)', key: '', desc: 'Public URL or attachment link' }
    ],
    relationships: [
      { type: 'M : 1', target: 'EVENT', via: 'Advertised_Through', fk: 'Event_ID' }
    ]
  },
  {
    name: 'PARTICIPANT',
    table: 'PARTICIPANT',
    pk: 'Participant_ID',
    description: 'Students, researchers, delegates, and attendees.',
    attributes: [
      { name: 'Participant_ID', type: 'VARCHAR(20)', key: 'PK', desc: 'Unique Participant Identifier' },
      { name: 'Name', type: 'VARCHAR(100)', key: '', desc: 'Full Name' },
      { name: 'Email', type: 'VARCHAR(100)', key: '', desc: 'Email address (Login ID)' },
      { name: 'Phone', type: 'VARCHAR(20)', key: '', desc: 'Mobile number' },
      { name: 'Category', type: 'VARCHAR(50)', key: '', desc: 'Student, Research Scholar, External' },
      { name: 'Institution_Name', type: 'VARCHAR(150)', key: '', desc: 'College / Institute Name' },
      { name: 'Branch', type: 'VARCHAR(100)', key: '', desc: 'Academic specialization' },
      { name: 'Year_of_Study', type: 'VARCHAR(30)', key: '', desc: 'Year (1st, 2nd, 3rd, 4th, PhD)' }
    ],
    relationships: [
      { type: 'M : N', target: 'EVENT', via: 'REGISTRATION', fk: 'REGISTRATION.Participant_ID' },
      { type: '1 : M', target: 'ACCOMMODATION', via: 'Receives', fk: 'ACCOMMODATION.Participant_ID' },
      { type: '1 : M', target: 'HOSPITALITY', via: 'Arrangements', fk: 'HOSPITALITY.Participant_ID' },
      { type: '1 : M', target: 'EVALUATION', via: 'Evaluated_In', fk: 'EVALUATION.Participant_ID' },
      { type: '1 : M', target: 'CERTIFICATE', via: 'Awarded', fk: 'CERTIFICATE.Participant_ID' }
    ]
  },
  {
    name: 'REGISTRATION',
    table: 'REGISTRATION',
    pk: 'Registration_ID',
    description: 'Associative entity managing participant enrollment in events.',
    attributes: [
      { name: 'Registration_ID', type: 'VARCHAR(25)', key: 'PK', desc: 'Unique Registration Number' },
      { name: 'Participant_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'References PARTICIPANT(Participant_ID)' },
      { name: 'Event_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'References EVENT(Event_ID)' },
      { name: 'Registration_Date', type: 'DATE', key: '', desc: 'Timestamp of registration' },
      { name: 'Fee_Paid', type: 'DECIMAL(10,2)', key: '', desc: 'Amount paid (in INR)' },
      { name: 'Payment_Status', type: 'VARCHAR(30)', key: '', desc: 'Confirmed, Pending, Exempted' },
      { name: 'Registration_Type', type: 'VARCHAR(50)', key: '', desc: 'Individual, Delegate, Volunteer' }
    ],
    relationships: [
      { type: 'M : 1', target: 'PARTICIPANT', via: 'Participant_ID', fk: 'Participant_ID' },
      { type: 'M : 1', target: 'EVENT', via: 'Event_ID', fk: 'Event_ID' }
    ]
  },
  {
    name: 'ACCOMMODATION',
    table: 'ACCOMMODATION',
    pk: 'Accommodation_ID',
    description: 'Hostel and guest house bookings for outstation participants.',
    attributes: [
      { name: 'Accommodation_ID', type: 'VARCHAR(20)', key: 'PK', desc: 'Booking Reference Number' },
      { name: 'Participant_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'References PARTICIPANT(Participant_ID)' },
      { name: 'Room_No', type: 'VARCHAR(30)', key: '', desc: 'Assigned Room Number' },
      { name: 'Hostel_Block', type: 'VARCHAR(80)', key: '', desc: 'Hostel (Garnet, Opal, Aquamarine)' },
      { name: 'Check_in_Date', type: 'DATE', key: '', desc: 'Arrival date' },
      { name: 'Check_out_Date', type: 'DATE', key: '', desc: 'Departure date' }
    ],
    relationships: [
      { type: 'M : 1', target: 'PARTICIPANT', via: 'Receives (1 : M)', fk: 'Participant_ID' }
    ]
  },
  {
    name: 'HOSPITALITY',
    table: 'HOSPITALITY',
    pk: 'Hospitality_ID',
    description: 'Catering, banquet meals, and local transit logistics for delegates.',
    attributes: [
      { name: 'Hospitality_ID', type: 'VARCHAR(20)', key: 'PK', desc: 'Hospitality Pass ID' },
      { name: 'Participant_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'References PARTICIPANT(Participant_ID)' },
      { name: 'Event_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'References EVENT(Event_ID)' },
      { name: 'Meal_Type', type: 'VARCHAR(80)', key: '', desc: 'Breakfast, Lunch, Banquet Buffet' },
      { name: 'Date', type: 'DATE', key: '', desc: 'Catering Date' },
      { name: 'Transport_Provided', type: 'VARCHAR(100)', key: '', desc: 'Shuttle pickup / cab service status' }
    ],
    relationships: [
      { type: 'M : 1', target: 'PARTICIPANT', via: 'Participant_ID', fk: 'Participant_ID' },
      { type: 'M : 1', target: 'EVENT', via: 'Event_ID', fk: 'Event_ID' }
    ]
  },
  {
    name: 'EVALUATION',
    table: 'EVALUATION',
    pk: 'Evaluation_ID',
    description: 'Post-event participant feedback, scores, and ratings.',
    attributes: [
      { name: 'Evaluation_ID', type: 'VARCHAR(20)', key: 'PK', desc: 'Feedback Tracking ID' },
      { name: 'Participant_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'References PARTICIPANT(Participant_ID)' },
      { name: 'Event_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'References EVENT(Event_ID)' },
      { name: 'Evaluator_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'References COORDINATOR(Coordinator_ID)' },
      { name: 'Score', type: 'DECIMAL(3,2)', key: '', desc: 'Numerical Rating (out of 5.0)' },
      { name: 'Feedback', type: 'TEXT', key: '', desc: 'Qualitative comments' },
      { name: 'Evaluation_Date', type: 'DATE', key: '', desc: 'Submission timestamp' }
    ],
    relationships: [
      { type: 'M : 1', target: 'PARTICIPANT', via: 'Participant_ID', fk: 'Participant_ID' },
      { type: 'M : 1', target: 'EVENT', via: 'Event_ID', fk: 'Event_ID' },
      { type: 'M : 1', target: 'COORDINATOR', via: 'Evaluator_ID', fk: 'Evaluator_ID' }
    ]
  },
  {
    name: 'CERTIFICATE',
    table: 'CERTIFICATE',
    pk: 'Certificate_ID',
    description: 'Official digital certificates of participation, merit, and volunteering.',
    attributes: [
      { name: 'Certificate_ID', type: 'VARCHAR(20)', key: 'PK', desc: 'Certificate ID' },
      { name: 'Participant_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'References PARTICIPANT(Participant_ID)' },
      { name: 'Event_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'References EVENT(Event_ID)' },
      { name: 'Certificate_Type', type: 'VARCHAR(80)', key: '', desc: 'Participation, Winner, Volunteer, etc.' },
      { name: 'Issue_Date', type: 'DATE', key: '', desc: 'Date of issuance' },
      { name: 'Certificate_No', type: 'VARCHAR(50)', key: '', desc: 'Official Verification Code' }
    ],
    relationships: [
      { type: 'M : 1', target: 'PARTICIPANT', via: 'Participant_ID', fk: 'Participant_ID' },
      { type: 'M : 1', target: 'EVENT', via: 'Event_ID', fk: 'Event_ID' }
    ]
  },
  {
    name: 'COMPLETION_REPORT',
    table: 'COMPLETION_REPORT',
    pk: 'Report_ID',
    description: 'Formal post-event outcome audit, participant count, and financial summary.',
    attributes: [
      { name: 'Report_ID', type: 'VARCHAR(20)', key: 'PK', desc: 'Formal Report Number' },
      { name: 'Event_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'References EVENT(Event_ID) [1:1]' },
      { name: 'Prepared_By', type: 'VARCHAR(20)', key: 'FK', desc: 'References COORDINATOR(Coordinator_ID)' },
      { name: 'Report_Date', type: 'DATE', key: '', desc: 'Date Report Submitted' },
      { name: 'Summary', type: 'TEXT', key: '', desc: 'Executive overview and highlights' },
      { name: 'No_of_Participants', type: 'INT', key: '', desc: 'Total confirmed attendees' }
    ],
    relationships: [
      { type: '1 : 1', target: 'EVENT', via: 'Results_In', fk: 'Event_ID' },
      { type: '1 : M', target: 'PHOTOGRAPH', via: 'Contains', fk: 'PHOTOGRAPH.Report_ID' },
      { type: 'M : 1', target: 'COORDINATOR', via: 'Prepared_By', fk: 'Prepared_By' }
    ]
  },
  {
    name: 'PHOTOGRAPH',
    table: 'PHOTOGRAPH',
    pk: 'Photo_ID',
    description: 'Event photo archive linked to the official completion report.',
    attributes: [
      { name: 'Photo_ID', type: 'VARCHAR(20)', key: 'PK', desc: 'Unique Photo ID' },
      { name: 'Report_ID', type: 'VARCHAR(20)', key: 'FK', desc: 'References COMPLETION_REPORT(Report_ID)' },
      { name: 'Photo_URL', type: 'VARCHAR(255)', key: '', desc: 'Direct Image URL' },
      { name: 'Caption', type: 'VARCHAR(150)', key: '', desc: 'Descriptive Photo Caption' },
      { name: 'Uploaded_Date', type: 'DATE', key: '', desc: 'Upload timestamp' }
    ],
    relationships: [
      { type: 'M : 1', target: 'COMPLETION_REPORT', via: 'Contains (1 : M)', fk: 'Report_ID' }
    ]
  }
];
