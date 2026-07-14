import { useState, useEffect } from 'react';
import { 
    X, Save, Calendar, BookOpen, Loader2, Sparkles, 
    ArrowUpRight, Info, CheckCircle2
} from 'lucide-react';
import { semesterApi } from '../../api/semesterApi';
import registrationApi from '../../api/registrationApi';
import toast from 'react-hot-toast';

const RegisterStudentCourseModal = ({ isOpen, onClose, studentId, studentName, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [semesters, setSemesters] = useState([]);
    const [selectedSemesterId, setSelectedSemesterId] = useState('');
    const [sections, setSections] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchSemesters();
            setSelectedSemesterId('');
            setSections([]);
            setSelectedSectionId('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedSemesterId) {
            fetchSections(selectedSemesterId);
        } else {
            setSections([]);
            setSelectedSectionId('');
        }
    }, [selectedSemesterId]);

    const fetchSemesters = async () => {
        setLoading(true);
        try {
            const res = await semesterApi.getAllSemesters();
            if (res.success && res.data) {
                setSemesters(res.data);
                const active = res.data.find(s => s.isActive);
                if (active) setSelectedSemesterId(active.id);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách học kỳ");
        } finally {
            setLoading(false);
        }
    };

    const fetchSections = async (semesterId) => {
        setLoading(true);
        try {
            const res = await semesterApi.getSectionsBySemester(semesterId);
            if (res.success && res.data) {
                setSections(res.data);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách lớp học phần");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSectionId) {
            toast.error("Vui lòng chọn lớp học phần");
            return;
        }

        setSubmitting(true);
        try {
            const res = await registrationApi.adminEnroll(studentId, selectedSectionId);
            if (res.success) {
                toast.success("Đăng ký môn học thành công!");
                onSuccess();
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đăng ký môn học thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fadeIn">
            <div className="academic-glass-card rounded-[2.5rem] shadow-2xl border border-emerald-100/30 w-full max-w-lg flex flex-col overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center shrink-0 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl">
                            <BookOpen size={28} className="text-emerald-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                                <Sparkles size={14} className="animate-pulse" />
                                Đăng ký chương trình đào tạo
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">
                                Đăng Ký Môn Học
                            </h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all border border-transparent hover:border-white/10">
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-10 bg-slate-50/50 flex-1 overflow-y-auto custom-scrollbar">
                    <form id="registerCourseForm" onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-slate-900/5 p-4 rounded-xl border border-slate-200/60 mb-4 text-xs font-bold text-slate-700">
                            Học viên: <span className="font-black text-slate-900">{studentName}</span>
                        </div>

                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Chọn Học Kỳ (*)</label>
                            <select
                                required
                                className="w-full mt-1.5 px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-slate-700 shadow-sm text-sm"
                                value={selectedSemesterId}
                                onChange={(e) => setSelectedSemesterId(e.target.value)}
                            >
                                <option value="">-- Chọn học kỳ --</option>
                                {semesters.map((sem) => (
                                    <option key={sem.id} value={sem.id}>{sem.semesterName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Chọn Lớp Học Phần (*)</label>
                            {loading ? (
                                <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                                    <Loader2 size={16} className="animate-spin text-emerald-500" />
                                    Đang tải lớp học phần...
                                </div>
                            ) : (
                                <select
                                    required
                                    disabled={!selectedSemesterId}
                                    className="w-full mt-1.5 px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-slate-700 shadow-sm text-sm disabled:opacity-50"
                                    value={selectedSectionId}
                                    onChange={(e) => setSelectedSectionId(e.target.value)}
                                >
                                    <option value="">-- Chọn lớp học phần --</option>
                                    {sections.map((sec) => (
                                        <option key={sec.id} value={sec.id}>
                                            [{sec.classCode}] {sec.courseName} - {sec.lecturerName || 'Chưa phân giảng'} ({sec.currentStudents}/{sec.maxStudents} SV)
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-10 py-8 bg-white border-t border-slate-100 flex justify-end gap-4 shrink-0">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all active:scale-95"
                    >
                        Hủy bỏ
                    </button>
                    <button 
                        type="submit" 
                        form="registerCourseForm"
                        disabled={submitting || !selectedSectionId}
                        className="px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3 disabled:opacity-50 active:scale-95"
                    >
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Xác nhận đăng ký
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterStudentCourseModal;
