import { useState, useEffect } from 'react';
import { 
    X, Save, UserPlus, Sparkles, Loader2, Info
} from 'lucide-react';
import registrationApi from '../../api/registrationApi';
import toast from 'react-hot-toast';

const AddStudentByInfoModal = ({ isOpen, onClose, sectionId, onSuccess }) => {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        studentCode: '',
        fullName: ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                studentCode: '',
                fullName: ''
            });
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.studentCode.trim()) {
            toast.error("Mã sinh viên không được để trống");
            return;
        }
        if (!formData.fullName.trim()) {
            toast.error("Họ và tên không được để trống");
            return;
        }

        setSubmitting(true);
        try {
            const res = await registrationApi.adminEnrollByInfo(
                formData.studentCode.trim(),
                formData.fullName.trim(),
                sectionId
            );
            if (res.success) {
                toast.success("Nhập sinh viên và đăng ký lớp học thành công!");
                onSuccess();
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Nhập sinh viên thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fadeIn">
            <div className="academic-glass-card rounded-[2.5rem] shadow-2xl border border-emerald-100/30 w-full max-w-md flex flex-col overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center shrink-0 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl">
                            <UserPlus size={28} className="text-emerald-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                                <Sparkles size={14} className="animate-pulse" />
                                Quản trị lớp học phần
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">
                                Nhập Sinh Viên Mới
                            </h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all border border-transparent hover:border-white/10">
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-10 bg-slate-50/50 flex-1 overflow-y-auto custom-scrollbar">
                    <form id="addStudentByInfoForm" onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-emerald-50 border border-emerald-100/50 rounded-2xl p-4 flex gap-3 text-emerald-800 text-xs font-bold">
                            <Info size={16} className="shrink-0" />
                            <span>Nếu mã sinh viên chưa tồn tại trong hệ thống, hệ thống sẽ tự động khởi tạo hồ sơ sinh viên mới.</span>
                        </div>

                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mã Sinh Viên (*)</label>
                            <input
                                required
                                type="text"
                                placeholder="Nhập mã sinh viên (VD: SV20260001)..."
                                className="w-full mt-1.5 px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-slate-700 shadow-sm text-sm"
                                value={formData.studentCode}
                                onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                            />
                        </div>

                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Họ Và Tên (*)</label>
                            <input
                                required
                                type="text"
                                placeholder="Nhập họ và tên sinh viên..."
                                className="w-full mt-1.5 px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-slate-700 shadow-sm text-sm"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
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
                        form="addStudentByInfoForm"
                        disabled={submitting}
                        className="px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3 disabled:opacity-50 active:scale-95"
                    >
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Xác nhận thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddStudentByInfoModal;
