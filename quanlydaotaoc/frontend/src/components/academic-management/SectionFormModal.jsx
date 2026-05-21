import { useState, useEffect } from 'react';
import {
    X, Save, BookOpen, User, Users, MapPin,
    Clock, Loader2, Search, Filter, Sparkles,
    Hash, GraduationCap, AlertCircle, MessageSquare, Layers, Activity
} from 'lucide-react';
import { semesterApi } from '../../api/semesterApi';
import { courseApi } from '../../api/courseApi';
import { employeeApi } from '../../api/lecturerApi';
import toast from 'react-hot-toast';

const SectionFormModal = ({ isOpen, onClose, semesterId, initialData, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [fetchingData, setFetchingData] = useState(false);

    const [formData, setFormData] = useState({
        courseId: '',
        lecturerId: '',
        classCode: '',
        maxStudents: 50,
        status: 'planned',
        notes: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchDropdownData();
            if (initialData) {
                setFormData({
                    courseId: initialData.courseId || '',
                    lecturerId: initialData.lecturerId || '',
                    classCode: initialData.classCode || '',
                    maxStudents: initialData.maxStudents || 50,
                    status: initialData.status || 'planned',
                    notes: initialData.notes || ''
                });
            } else {
                setFormData({
                    courseId: '',
                    lecturerId: '',
                    classCode: '',
                    maxStudents: 50,
                    status: 'planned',
                    notes: ''
                });
            }
        }
    }, [initialData, isOpen]);

    const fetchDropdownData = async () => {
        setFetchingData(true);
        try {
            const [courseRes, lecturerRes] = await Promise.all([
                courseApi.getAllCourses(),
                employeeApi.getAllLecturers()
            ]);
            if (courseRes.success) setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
            if (lecturerRes.success) setLecturers(Array.isArray(lecturerRes.data) ? lecturerRes.data : []);
        } catch (error) {
            toast.error("Protocol Error: Catalog synchronization failed");
        } finally {
            setFetchingData(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!semesterId) {
            toast.error("Operational Error: Missing cycle context");
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData, semesterId };
            let res;
            if (initialData) {
                res = await semesterApi.updateSection(initialData.id, payload);
            } else {
                res = await semesterApi.createSection(payload);
            }

            if (res.success) {
                toast.success(initialData ? "Matrix Reconfigured" : "New Matrix Deployed");
                onUpdate();
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Protocol Failure: Deployment rejected");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const InputWrapper = ({ label, icon: Icon, children }) => (
        <div className="space-y-1.5 group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 group-focus-within:text-emerald-500 transition-colors">
                {label}
            </label>
            <div className="relative">
                {Icon && <Icon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />}
                {children}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fadeIn">
            <div className="academic-glass-card rounded-[3rem] shadow-2xl border border-emerald-100/30 w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center shrink-0 relative">
                    <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl">
                            <BookOpen size={32} className="text-emerald-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                                <Sparkles size={14} className="animate-pulse" />
                                Knowledge Matrix Deployment
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">
                                {initialData ? 'Reconfigure Deployment' : 'Formalize Deployment'}
                            </h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all border border-transparent hover:border-white/10">
                        <X size={28} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50 custom-scrollbar">
                    <form id="sectionForm" onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Left Sector: Core Configuration */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Filter size={14} /> Catalog Identification
                                    </h4>

                                    <InputWrapper label="Target Course Matrix" icon={Layers}>
                                        <select
                                            required
                                            className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-slate-700 appearance-none shadow-sm cursor-pointer"
                                            value={formData.courseId}
                                            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                        >
                                            <option value="">Select Reference Matrix...</option>
                                            {(Array.isArray(courses) ? courses : []).map(c => <option key={c.id} value={c.id}>{c.courseCode} — {c.courseName}</option>)}
                                        </select>
                                    </InputWrapper>

                                    <InputWrapper label="Operational Section Code" icon={Hash}>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. CS-101-01"
                                            className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-slate-700 shadow-sm"
                                            value={formData.classCode}
                                            onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
                                        />
                                    </InputWrapper>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Clock size={14} /> Deployment Lifecycle
                                    </h4>
                                    <InputWrapper label="Status Vector" icon={Activity}>
                                        <select
                                            className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-slate-700 appearance-none shadow-sm cursor-pointer"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="planned">Planned (Staging)</option>
                                            <option value="open">Active (Operational)</option>
                                            <option value="closed">Terminated (Archived)</option>
                                        </select>
                                    </InputWrapper>
                                </div>
                            </div>

                            {/* Right Sector: Personnel & Capacity */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <User size={14} /> Personnel Allocation
                                    </h4>
                                    <InputWrapper label="Assigned Lead Faculty" icon={GraduationCap}>
                                        <select
                                            required
                                            className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-slate-700 appearance-none shadow-sm cursor-pointer"
                                            value={formData.lecturerId}
                                            onChange={(e) => setFormData({ ...formData, lecturerId: e.target.value })}
                                        >
                                            <option value="">Assign Commander...</option>
                                            {(Array.isArray(lecturers) ? lecturers : []).map(l => <option key={l.id} value={l.id}>{l.fullName} — [{l.employeeCode}]</option>)}
                                        </select>
                                    </InputWrapper>

                                    <InputWrapper label="Matrix Capacity Limit" icon={Users}>
                                        <div className="relative flex items-center">
                                            <input
                                                type="number"
                                                className="w-full pl-16 pr-24 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-slate-900 shadow-sm"
                                                value={formData.maxStudents}
                                                onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                                            />
                                            <span className="absolute right-6 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Personnel</span>
                                        </div>
                                    </InputWrapper>
                                </div>

                                <div className="group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-emerald-500 transition-colors">Operational Context / Notes</label>
                                    <div className="relative mt-1.5">
                                        <MessageSquare size={18} className="absolute left-6 top-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                        <textarea
                                            rows="4"
                                            placeholder="Specify deployment constraints or additional directives..."
                                            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-slate-700 shadow-sm resize-none"
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-10 py-8 bg-white border-t border-slate-100 flex justify-end gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-4 text-[10px] font-black text-slate-400 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all uppercase tracking-widest active:scale-95"
                    >
                        Abort Protocol
                    </button>
                    <button
                        type="submit"
                        form="sectionForm"
                        disabled={loading || fetchingData}
                        className="px-12 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3 disabled:opacity-50 active:scale-95"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        {initialData ? 'Apply Variations' : 'Execute Deployment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SectionFormModal;
