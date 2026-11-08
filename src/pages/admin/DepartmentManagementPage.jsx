import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Building2, PlusCircle, Edit2, Trash2, Calendar, Mail, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DepartmentManagementPage = () => {
  const { departments, events, addDepartment, updateDepartment, deleteDepartment } = useData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deleteDeptId, setDeleteDeptId] = useState(null);

  const initialForm = {
    Dept_ID: `DEPT-${Math.floor(10 + Math.random() * 90)}`,
    Dept_Name: '',
    HOD_Name: '',
    Contact_Email: '',
    Contact_Phone: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingDept(null);
    setFormData({
      ...initialForm,
      Dept_ID: `DEPT-${Math.floor(10 + Math.random() * 90)}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setFormData({ ...dept });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingDept) {
      updateDepartment(editingDept.Dept_ID, formData);
      showToast(`Department ${editingDept.Dept_ID} updated!`, 'success');
    } else {
      addDepartment(formData);
      showToast(`Department ${formData.Dept_ID} added!`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteDeptId) {
      deleteDepartment(deleteDeptId);
      showToast(`Department ${deleteDeptId} deleted.`, 'info');
      setDeleteDeptId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-nitt-950">
              Department Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Academic departments organizing events, symposiums, and conferences across the institute
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={handleOpenAdd}
        >
          Add Department
        </Button>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => {
          const deptEvents = events.filter((e) => e.Dept_ID === dept.Dept_ID);

          return (
            <div
              key={dept.Dept_ID}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {dept.Dept_ID}
                      </span>
                      <h3 className="text-base font-bold text-nitt-950 mt-1">
                        {dept.Dept_Name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(dept)}
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                      title="Edit Department"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteDeptId(dept.Dept_ID)}
                      className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Department"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Head of Department (HOD):</span>
                    <span className="font-bold text-slate-900">{dept.HOD_Name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Contact Email:</span>
                    <span className="text-slate-700 font-mono text-[11px]">{dept.Contact_Email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Phone Ext:</span>
                    <span className="text-slate-700">{dept.Contact_Phone}</span>
                  </div>
                </div>
              </div>

              {/* Linked Events List */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Organized Events ({deptEvents.length})</span>
                  </span>
                </div>

                {deptEvents.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No events currently scheduled under this department.</p>
                ) : (
                  <div className="space-y-1.5">
                    {deptEvents.map((evt) => (
                      <Link
                        key={evt.Event_ID}
                        to={`/events/${evt.Event_ID}`}
                        className="p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs transition-colors"
                      >
                        <span className="font-medium text-slate-800 truncate max-w-[240px]">{evt.Event_Name}</span>
                        <span className="font-mono text-[10px] text-slate-500">{evt.Start_Date}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit Department */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? `Edit Department: ${editingDept.Dept_ID}` : 'Add New Department'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Department ID (Primary Key)
            </label>
            <input
              type="text"
              required
              disabled={!!editingDept}
              value={formData.Dept_ID}
              onChange={(e) => setFormData({ ...formData, Dept_ID: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Department Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Department of Computer Applications"
              value={formData.Dept_Name}
              onChange={(e) => setFormData({ ...formData, Dept_Name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Head of Department (HOD Name)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Admin"
              value={formData.HOD_Name}
              onChange={(e) => setFormData({ ...formData, HOD_Name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              required
              placeholder="hodca@nitt.edu"
              value={formData.Contact_Email}
              onChange={(e) => setFormData({ ...formData, Contact_Email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              required
              placeholder="+91 431 2503731"
              value={formData.Contact_Phone}
              onChange={(e) => setFormData({ ...formData, Contact_Phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingDept ? 'Save Changes' : 'Add Department'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteDeptId}
        onClose={() => setDeleteDeptId(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        message={`Are you sure you want to delete ${deleteDeptId}?`}
      />
    </div>
  );
};

export default DepartmentManagementPage;
