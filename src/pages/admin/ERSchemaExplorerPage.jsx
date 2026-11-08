import React, { useState } from 'react';
import { ER_ENTITIES } from '../../data/erModelInfo';
import erDiagramImg from '../../assets/er_diagram.jpeg';
import { Database, Image as ImageIcon, Table, Key, Link2, ExternalLink, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const ERSchemaExplorerPage = () => {
  const [selectedEntity, setSelectedEntity] = useState(ER_ENTITIES[0]);

  const moduleMappings = [
    { entity: 'DEPARTMENT', route: '/admin/departments', relationship: '1 : M EVENT', page: 'Department Management' },
    { entity: 'EVENT', route: '/admin/events', relationship: 'Held_At, Organizes, Manages', page: 'All Events & Create Event' },
    { entity: 'VENUE', route: '/admin/venues', relationship: 'EVENT M : 1 VENUE', page: 'Venue Management & Availability' },
    { entity: 'COORDINATOR', route: '/admin/coordinators', relationship: 'M : N EVENT', page: 'Faculty Coordinators' },
    { entity: 'EVENT_COORDINATOR', route: '/admin/event-coordinators', relationship: 'Associative Entity (PK FK)', page: 'Assign Coordinators (M:N)' },
    { entity: 'SPONSOR', route: '/admin/sponsors', relationship: 'EVENT M : N SPONSOR', page: 'Corporate Sponsorships' },
    { entity: 'PUBLICITY', route: '/admin/publicity', relationship: 'EVENT 1 : M PUBLICITY', page: 'Publicity Reach & Ads' },
    { entity: 'PARTICIPANT', route: '/admin/participants', relationship: 'Registers, Receives, Evaluates', page: 'Participant Records & Profiles' },
    { entity: 'REGISTRATION', route: '/admin/registrations', relationship: 'M : N between EVENT & PARTICIPANT', page: 'Registration & Fee Approvals' },
    { entity: 'ACCOMMODATION', route: '/admin/accommodation', relationship: 'PARTICIPANT 1 : M ACCOMMODATION', page: 'Hostel Room Allocations' },
    { entity: 'HOSPITALITY', route: '/admin/hospitality', relationship: 'EVENT 1 : M and PARTICIPANT 1 : M', page: 'Dining Passes & Shuttles' },
    { entity: 'EVALUATION', route: '/admin/evaluations', relationship: 'PARTICIPANT M : N EVENT', page: 'Post-Event Ratings & Feedback' },
    { entity: 'CERTIFICATE', route: '/admin/certificates', relationship: 'Awarded M : N', page: 'Digital Certificate Generator' },
    { entity: 'COMPLETION_REPORT', route: '/admin/reports', relationship: 'EVENT 1 : 1 COMPLETION_REPORT', page: 'Outcome Audit & Summary' },
    { entity: 'PHOTOGRAPH', route: '/admin/gallery', relationship: 'COMPLETION_REPORT 1 : M PHOTOGRAPH', page: 'Event Media Gallery' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-nitt-950">
            Relational Database ER Model & Schema Architecture
          </h1>
          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded font-mono">
            15 Tables &bull; Full Integrity
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Complete structural mapping between the NIT Trichy Department of CA ER Diagram and the Web Application
        </p>
      </div>

      {/* ER Diagram Image Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-nitt-950">
              Attached Relational Entity-Relationship Diagram
            </h3>
          </div>
          <a
            href={erDiagramImg}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1"
          >
            <span>Open in Fullscreen</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-100 p-3 max-h-[70vh] overflow-y-auto">
          <img
            src={erDiagramImg}
            alt="Department of CA Event Management System ER Diagram NIT Trichy"
            className="w-full object-contain rounded-lg shadow-sm"
          />
        </div>
      </div>

      {/* Comprehensive Mapping Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-nitt-950">
            Verification Matrix: 15 ER Entities to Web Modules
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-600 text-[10px]">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">ER Entity Name</th>
                <th className="px-4 py-3 text-left">Cardinality & Relationship</th>
                <th className="px-4 py-3 text-left">Application Module Page</th>
                <th className="px-4 py-3 text-right">Direct Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {moduleMappings.map((m, idx) => (
                <tr key={m.entity} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="px-4 py-3 font-mono font-bold text-nitt-950">{m.entity}</td>
                  <td className="px-4 py-3 text-emerald-700 font-semibold">{m.relationship}</td>
                  <td className="px-4 py-3 text-slate-800">{m.page}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={m.route}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-nitt-900 hover:text-white text-slate-700 font-bold text-[11px] transition-colors inline-block"
                    >
                      Open Module &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Entity Attribute Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400 px-2 tracking-wider block">
            Select Entity to Inspect Schema
          </span>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {ER_ENTITIES.map((entity) => (
              <button
                key={entity.table}
                onClick={() => setSelectedEntity(entity)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                  selectedEntity.table === entity.table
                    ? 'bg-nitt-900 text-white shadow-sm'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="font-mono">{entity.table}</span>
                <span className="text-[10px] opacity-80 font-mono">PK: {entity.pk}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 border border-slate-200 rounded-2xl p-6 bg-white shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h4 className="text-lg font-bold text-nitt-950 font-mono">
              TABLE: {selectedEntity.table}
            </h4>
            <p className="text-xs text-slate-600 mt-1">{selectedEntity.description}</p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>Attributes, Data Types & Keys</span>
            </h5>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 font-semibold text-slate-700">
                  <tr>
                    <th className="px-3 py-2 text-left">Attribute</th>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">Key</th>
                    <th className="px-3 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {selectedEntity.attributes.map((attr) => (
                    <tr key={attr.name} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-mono font-bold text-slate-900">{attr.name}</td>
                      <td className="px-3 py-2 text-slate-500 font-mono text-[11px]">{attr.type}</td>
                      <td className="px-3 py-2">
                        {attr.key.includes('PK') && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            PK
                          </span>
                        )}
                        {attr.key.includes('FK') && (
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">
                            FK
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-600 text-[11px]">{attr.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Relational Foreign Keys & Cardinality</span>
            </h5>
            <div className="space-y-1.5">
              {selectedEntity.relationships.map((rel, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-nitt-900 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                      {rel.type}
                    </span>
                    <span className="text-slate-600 font-medium">
                      via <span className="font-bold text-slate-900">{rel.via}</span>
                    </span>
                  </div>
                  <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    &rarr; {rel.target} ({rel.fk})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERSchemaExplorerPage;
