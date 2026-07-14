import { useState, useEffect } from 'react';
import { 
    X, Search, UserCheck, Users, Loader2, Sparkles, 
    ArrowUpRight, CheckSquare, Square
} from 'lucide-react';
import { studentApi } from '../../api/studentApi';
import registrationApi from '../../api/registrationApi';
import toast from 'react-hot-toast';

const AddStudentsToSectionModal = ({ isOpen, onClose, sectionId, onSuccess, existingStudentIds = [] }) => {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchStudents();
            setSelectedStudentIds([]);
        }
    }, [isOpen, searchTerm]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            // Fetch students matching the keyword. Default size is 50 for selection.
            const res = await studentApi.getAll({
                keyword: searchTerm,
                size: 50,
                page: 0
            });
            if (res.success && res.data) {
                // Filter out students already enrolled in this class
                const available = (res.data.content || []).filter(
                    std => !existingStudentIds.includes(std.studentCode) && !existingStudentIds.includes(std.id)
                );
                setStudents(available);
            }
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh sách sinh viên");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSelect = (id) => {
        setSelectedStudentIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedStudentIds.length === students.length) {
            setSelectedStudentIds([]);
        } else {
            setSelectedStudentIds(students.map(s => s.id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedStudentIds.length === 0) {
            toast.error("Vui lòng chọn ít nhất một sinh viên");
            return;
        }

        setEnrolling(true);
        const loadingToast = toast.loading(`Đang đăng ký ${selectedStudentIds.length} sinh viên vào lớp...`);
        try {
            // Loop and enroll each student
            const promises = selectedStudentIds.map(studentId => 
                registrationApi.adminEnroll(studentId, sectionId)
            );
            await Promise.all(promises);

            toast.success("Đăng ký sinh viên vào lớp thành công!", { id: loadingToast });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Đăng ký thất bại: Trùng lịch học hoặc giới hạn sĩ số", { id: loadingToast });
        } finally {
            setEnrolling(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fadeIn">
            <div className="academic-glass-card rounded-[2.5rem] shadow-2xl border border-emerald-100/30 w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center shrink-0 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl">
                            <Users size={28} className="text-emerald-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                                <Sparkles size={14} className="animate-pulse" />
                                Ghi nhận danh sách lớp
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">
                                Đăng ký Sinh viên vào Lớp
                            </h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all border border-transparent hover:border-white/10">
                        <X size={24} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-6 bg-white border-b border-slate-100 shrink-0">
                    <div className="relative group w-full">
                        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã sinh viên, họ tên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 shadow-sm text-sm"
                        />
                    </div>
                </div>

                {/* Student Selection List */}
                <div className="p-8 bg-slate-50/50 flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 size={36} className="animate-spin text-emerald-500" />
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider animate-pulse">Đang tải hồ sơ sinh viên...</p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-20">
                            <Users size={48} className="text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 text-sm font-bold">Không tìm thấy sinh viên nào khả dụng</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-4 mb-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Danh sách sinh viên ({students.length})</span>
                                <button 
                                    type="button" 
                                    onClick={handleSelectAll}
                                    className="text-xs font-black text-emerald-600 hover:text-emerald-700 transition-colors"
                                >
                                    {selectedStudentIds.length === students.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                                </button>
                            </div>
                            <div className="space-y-2">
                                {students.map((student) => {
                                    const isSelected = selectedStudentIds.includes(student.id);
                                    return (
                                        <div 
                                            key={student.id}
                                            onClick={() => handleToggleSelect(student.id)}
                                            className={`flex items-center justify-between p-4 bg-white border rounded-2xl cursor-pointer hover:border-emerald-400 transition-all select-none shadow-sm ${isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/5 bg-emerald-50/10' : 'border-slate-100'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <button type="button" className={`text-emerald-500 shrink-0 ${isSelected ? 'scale-110' : ''} transition-transform`}>
                                                    {isSelected ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-300" />}
                                                </button>
                                                <div>
                                                    <p className="font-black text-slate-800 text-sm leading-tight">{student.fullName}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-1">MSSV: <span className="text-emerald-600 font-mono">{student.studentCode}</span> {student.className && `• Lớp: ${student.className}`}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-flex px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                                    Sinh viên
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-10 py-6 bg-white border-t border-slate-100 flex justify-between items-center shrink-0">
                    <span className="text-xs font-bold text-slate-500">
                        Đã chọn: <span className="font-black text-slate-900">{selectedStudentIds.length} sinh viên</span>
                    </span>
                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all active:scale-95"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="button" 
                            onClick={handleSubmit}
                            disabled={enrolling || selectedStudentIds.length === 0}
                            className="px-8 py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3 disabled:opacity-50 active:scale-95"
                        >
                            {enrolling ? <Loader2 size={18} className="animate-spin" /> : <UserCheck size={18} />}
                            Xác nhận đăng ký
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStudentsToSectionModal;
