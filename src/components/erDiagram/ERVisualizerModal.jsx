import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { ER_ENTITIES } from '../../data/erModelInfo';
import erDiagramImg from '../../assets/er_diagram.jpeg';
import { Database, Image as ImageIcon, Table, Key, Link2, ExternalLink } from 'lucide-react';

const ERVisualizerModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('diagram');
  const [selectedEntity, setSelectedEntity] = useState(ER_ENTITIES[0]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Relational Database Architecture & ER Model"
      subtitle="Complete mapping of all 15 entities, relationships, foreign keys, and cardinalities"
      maxWidth="max-w-5xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close Architecture View
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'diagram'
                ? 'border-nitt-900 text-nitt-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>ER Diagram Visual</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'schema'
                ? 'border-nitt-900 text-nitt-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>15 Entities & Schema Explorer</span>
          </button>
        </div>

        {/* Tab 1: Image Diagram */}
        {activeTab === 'diagram' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-nitt-900">
                Primary Reference: NIT Trichy Department of CA Event Management ER Diagram
              </span>
              <a
                href={erDiagramImg}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline font-medium"
              >
                <span>Open high-res in new tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-100 p-2 shadow-inner max-h-[60vh] overflow-y-auto">
              <img
                src={erDiagramImg}
                alt="NIT Trichy Department of CA Event Management ER Diagram"
                className="w-full object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Schema Explorer */}
        {activeTab === 'schema' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Entity List */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 max-h-[55vh] overflow-y-auto space-y-1.5">
              <span className="text-xs font-bold uppercase text-slate-400 px-2 tracking-wider">
                15 ER Entities ({ER_ENTITIES.length})
              </span>
              {ER_ENTITIES.map((entity) => (
                <button
                  key={entity.table}
                  onClick={() => setSelectedEntity(entity)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedEntity.table === entity.table
                      ? 'bg-nitt-900 text-white shadow-sm'
                      : 'hover:bg-white text-slate-700'
                  }`}
                >
                  <span className="font-mono">{entity.table}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      selectedEntity.table === entity.table
                        ? 'bg-nitt-800 text-slate-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    PK: {entity.pk}
                  </span>
                </button>
              ))}
            </div>

            {/* Entity Attributes & Relationships */}
            <div className="md:col-span-2 border border-slate-200 rounded-xl p-4 bg-white max-h-[55vh] overflow-y-auto space-y-4">
              {selectedEntity && (
                <>
                  <div className="border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Table className="w-5 h-5 text-nitt-800" />
                      <h4 className="text-base font-bold text-nitt-950 font-mono">
                        {selectedEntity.table}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {selectedEntity.description}
                    </p>
                  </div>

                  {/* Attributes Table */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-600" />
                      <span>Attributes & Keys</span>
                    </h5>
                    <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50 font-semibold text-slate-700">
                          <tr>
                            <th className="px-3 py-2 text-left">Attribute</th>
                            <th className="px-3 py-2 text-left">Type</th>
                            <th className="px-3 py-2 text-left">Key</th>
                            <th className="px-3 py-2 text-left">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedEntity.attributes.map((attr) => (
                            <tr key={attr.name} className="hover:bg-slate-50/80">
                              <td className="px-3 py-2 font-mono font-medium text-slate-900">
                                {attr.name}
                              </td>
                              <td className="px-3 py-2 text-slate-500 font-mono text-[11px]">
                                {attr.type}
                              </td>
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
                              <td className="px-3 py-2 text-slate-600 text-[11px]">
                                {attr.desc}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Relationships */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Entity Relationships</span>
                    </h5>
                    <div className="space-y-1.5">
                      {selectedEntity.relationships.map((rel, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-nitt-900 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                              {rel.type}
                            </span>
                            <span className="text-slate-600 font-medium">
                              via <span className="font-semibold text-slate-900">{rel.via}</span>
                            </span>
                          </div>
                          <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                            &rarr; {rel.target} ({rel.fk})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ERVisualizerModal;
