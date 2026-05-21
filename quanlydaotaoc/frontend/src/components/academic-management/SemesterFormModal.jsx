import { useState, useEffect } from 'react';
import { 
    X, Save, Calendar, Info, CheckCircle2, 
    AlertCircle, Loader2, Sparkles, Clock,
    Target, Flag
} from 'lucide-react';
import { semesterApi } from '../../api/semesterApi';
import toast from 'react-hot-toast';

const SemesterFormModal = ({ isOpen, onClose, initialData, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        semesterName: '',
        academicYear: '',
        startDate: '',
        endDate: '',
        isActive: false
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                semesterName: initialData.semesterName || '',
                academicYear: initialData.academicYear || '',
                startDate: initialData.startDate || '',
                endDate: initialData.endDate || '',
                isActive: initialData.isActive || false
            });
        } else {
            setFormData({
                semesterName: '',
                academicYear: '',
                startDate: '',
                endDate: '',
                isActive: false
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (initialData) {
                res = await semesterApi.updateSemester(initialData.id, formData);
            } else {
                res = await semesterApi.createSemester(formData);
            }

            if (res.success) {
                toast.success(initialData ? "Cycle Reconfigured" : "New Cycle Initialized");
                onUpdate();
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Protocol Error: Cycle definition failed");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fadeIn">
            <div className="academic-glass-card rounded-[2.5rem] shadow-2xl border border-emerald-100/30 w-full max-w-xl flex flex-col overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center shrink-0 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl">
                            <Calendar size={28} className="text-emerald-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                                <Sparkles size={14} className="animate-pulse" />
                                Timeline Definition
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">
                                {initialData ? 'Reconfigure Cycle' : 'Initialize Cycle'}
                            </h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all border border-transparent hover:border-white/10">
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-10 bg-slate-50/50 flex-1 overflow-y-auto custom-scrollbar">
                    <form id="semesterForm" onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-emerald-500 transition-colors">Semester Designation (*)</label>
                                <div className="relative mt-1.5">
                                    <Target size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                    <input 
                                        required
                                        type="text"
                                        placeholder="e.g. Semester 1, Summer Term..."
                                        className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-slate-700 shadow-sm"
                                        value={formData.semesterName}
                                        onChange={(e) => setFormData({...formData, semesterName: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-emerald-500 transition-colors">Academic Year (*)</label>
                                <div className="relative mt-1.5">
                                    <Flag size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                    <input 
                                        required
                                        type="text"
                                        placeholder="e.g. 2024-2025"
                                        className="w-full pl-16 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-slate-700 shadow-sm"
                                        value={formData.academicYear}
                                        onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Launch Date</label>
                                    <input 
                                        type="date"
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-slate-700 shadow-sm mt-1.5"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    />
                                </div>
                                <div className="group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Termination Date</label>
                                    <input 
                                        type="date"
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black text-slate-700 shadow-sm mt-1.5"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <label className="flex items-center gap-6 p-6 bg-white border border-slate-200 rounded-[2rem] cursor-pointer hover:bg-emerald-50/30 transition-all group shadow-sm">
                                    <div className="relative flex items-center justify-center shrink-0">
                                        <input 
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                        />
                                        <div className="w-16 h-9 bg-slate-200 peer-checked:bg-emerald-500 rounded-full transition-all duration-300"></div>
                                        <div className="absolute left-1.5 peer-checked:left-8.5 top-1.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 transform translate-x-0 peer-checked:translate-x-0"></div>
                                    </div>
                                    <div className="flex-1">
                                        <span className="block text-[10px] font-black text-slate-700 uppercase tracking-widest">Master Active Protocol</span>
                                        <span className="text-[9px] text-slate-400 font-bold leading-tight mt-1 block">Set this cycle as the primary operational scope for the entire system.</span>
                                    </div>
                                </label>
                            </div>
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
                        Abort
                    </button>
                    <button 
                        type="submit" 
                        form="semesterForm"
                        disabled={loading}
                        className="px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3 disabled:opacity-50 active:scale-95"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {initialData ? 'Apply Definition' : 'Commit Protocol'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SemesterFormModal;
