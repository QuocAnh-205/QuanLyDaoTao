import { useState, useEffect } from 'react';
import { 
    X, Save, Book, Hash, Tag, FileText, Loader2, 
    Sparkles, Award, Clock, Layers, Building2,
    BookOpen, GraduationCap, Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import { courseApi } from '../../api/courseApi';
import { departmentApi } from '../../api/departmentApi';

const CourseFormModal = ({ isOpen, onClose, initialData, onUpdate }) => {
    const [formData, setFormData] = useState({
        courseCode: '',
        courseName: '',
        courseNameEn: '',
        credits: 0,
        courseType: 'CoSoNganh',
        theoryHours: 0,
        practiceHours: 0,
        selfStudyHours: 0,
        departmentId: '',
        description: ''
    });
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchDepartments();
            if (initialData) {
                setFormData({
                    courseCode: initialData.courseCode || '',
                    courseName: initialData.courseName || '',
                    courseNameEn: initialData.courseNameEn || '',
                    credits: initialData.credits || 0,
                    courseType: initialData.courseType || 'CoSoNganh',
                    theoryHours: initialData.theoryHours || 0,
                    practiceHours: initialData.practiceHours || 0,
                    selfStudyHours: initialData.selfStudyHours || 0,
                    departmentId: initialData.departmentId || '',
                    description: initialData.description || ''
                });
            } else {
                setFormData({
                    courseCode: '',
                    courseName: '',
                    courseNameEn: '',
                    credits: 0,
                    courseType: 'CoSoNganh',
                    theoryHours: 0,
                    practiceHours: 0,
                    selfStudyHours: 0,
                    departmentId: '',
                    description: ''
                });
            }
        }
    }, [isOpen, initialData]);

    const fetchDepartments = async () => {
        try {
            const res = await departmentApi.getAllActive();
            if (res.success) setDepartments(res.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách khoa:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (initialData) {
                res = await courseApi.updateCourse(initialData.id, formData);
            } else {
                res = await courseApi.createCourse(formData);
            }

            if (res.success) {
                toast.success(initialData ? "Definition Updated" : "Course Formalized");
                onUpdate(res.data);
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Protocol Failure");
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
                {Icon && <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />}
                {children}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fadeIn">
            <div className="academic-glass-card rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-emerald-100/30 animate-slideUp">
                <div className="px-8 py-6 border-b border-emerald-100/50 flex items-center justify-between bg-emerald-50/20">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                            <Sparkles size={14} className="animate-pulse" />
                            Knowledge Matrix Definition
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm border border-emerald-100 text-emerald-600">
                                <BookOpen size={24} />
                            </div>
                            {initialData ? 'Modify Course Identity' : 'Formalize New Course'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-white hover:text-rose-500 rounded-full transition-all border border-transparent hover:border-rose-100 shadow-sm">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Identity Sector */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                <Tag size={14} /> Core Identity
                            </h3>
                            
                            <InputWrapper label="Catalogue Code" icon={Hash}>
                                <input
                                    type="text"
                                    required
                                    value={formData.courseCode}
                                    onChange={(e) => setFormData({...formData, courseCode: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    placeholder="IT-CS-101"
                                />
                            </InputWrapper>

                            <InputWrapper label="Standard Name (VN)" icon={Book}>
                                <input
                                    type="text"
                                    required
                                    value={formData.courseName}
                                    onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    placeholder="Enter Vietnamese title..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Technical Title (EN)" icon={Globe}>
                                <input
                                    type="text"
                                    value={formData.courseNameEn}
                                    onChange={(e) => setFormData({...formData, courseNameEn: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    placeholder="Enter international title..."
                                />
                            </InputWrapper>

                            <InputWrapper label="Governing Department" icon={Building2}>
                                <select
                                    value={formData.departmentId}
                                    onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                                >
                                    <option value="">Select Faculty...</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </InputWrapper>
                        </div>

                        {/* Structural Sector */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-teal-600 uppercase tracking-widest flex items-center gap-2">
                                <Layers size={14} /> Structural Matrix
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <InputWrapper label="Credit Weight" icon={Award}>
                                    <input
                                        type="number"
                                        step="0.5"
                                        required
                                        value={formData.credits}
                                        onChange={(e) => setFormData({...formData, credits: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </InputWrapper>
                                <InputWrapper label="Category" icon={GraduationCap}>
                                    <select
                                        value={formData.courseType}
                                        onChange={(e) => setFormData({...formData, courseType: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                                    >
                                        <option value="CoSoNganh">Core Major</option>
                                        <option value="ChuyenNganh">Specialization</option>
                                        <option value="DaiCuong">General Education</option>
                                        <option value="TuChon">Elective</option>
                                    </select>
                                </InputWrapper>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 grid grid-cols-3 gap-4 shadow-inner">
                                <div className="space-y-1.5 text-center">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Theory</label>
                                    <input
                                        type="number"
                                        value={formData.theoryHours}
                                        onChange={(e) => setFormData({...formData, theoryHours: e.target.value})}
                                        className="w-full px-3 py-3 bg-white border border-slate-100 rounded-xl text-xs font-black text-center text-slate-700 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-1.5 text-center">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Practice</label>
                                    <input
                                        type="number"
                                        value={formData.practiceHours}
                                        onChange={(e) => setFormData({...formData, practiceHours: e.target.value})}
                                        className="w-full px-3 py-3 bg-white border border-slate-100 rounded-xl text-xs font-black text-center text-slate-700 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-1.5 text-center">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Self-Study</label>
                                    <input
                                        type="number"
                                        value={formData.selfStudyHours}
                                        onChange={(e) => setFormData({...formData, selfStudyHours: e.target.value})}
                                        className="w-full px-3 py-3 bg-white border border-slate-100 rounded-xl text-xs font-black text-center text-slate-700 shadow-sm"
                                    />
                                </div>
                            </div>

                            <InputWrapper label="Abstract / Objectives" icon={FileText}>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm resize-none"
                                    placeholder="Formal description of the course matrix..."
                                />
                            </InputWrapper>
                        </div>
                    </div>

                    <div className="pt-8 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-4 border border-slate-200 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Cancel Protocol
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            <span>{initialData ? 'Apply Variations' : 'Formalize Entry'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseFormModal;
