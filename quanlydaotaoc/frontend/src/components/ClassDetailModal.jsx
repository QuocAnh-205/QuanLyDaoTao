import { useState, useEffect } from 'react';
import { classApi } from '../api/studentApi';
import { 
    X, Users, User, Info, School, Calendar, BookOpen, 
    UserCheck, Search, ChevronRight, PieChart, Activity,
    ShieldCheck, GraduationCap, MapPin
} from 'lucide-react';

const ClassDetailModal = ({ isOpen, onClose, classId }) => {
    const [classDetail, setClassDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('students'); // 'students' or 'analytics'

    useEffect(() => {
        if (isOpen && classId) {
            fetchClassDetail();
        }
    }, [isOpen, classId]);

    const fetchClassDetail = async () => {
        setLoading(true);
        try {
            const response = await classApi.getById(classId);
            if (response.success) {
                setClassDetail(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải chi tiết lớp:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredStudents = classDetail?.students?.filter(s =>
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getStatusBadge = (code) => {
        const styles = {
            'ACTIVE': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
            'RESERVED': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
            'DROPPED': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
            'GRADUATED': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        };
        const style = styles[code] || 'bg-slate-500/10 text-slate-600 border-slate-500/20';
        return (
            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${style}`}>
                {code}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-500"
                onClick={onClose}
            ></div>

            {/* Side Drawer */}
            <div className="relative w-full max-w-2xl bg-slate-50 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                
                {/* Drawer Header */}
                <div className="relative p-8 bg-white border-b border-slate-100 overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <button 
                            onClick={onClose}
                            className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Class Insight</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
                                        {classDetail?.classCode || '...'}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Active Portfolio
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Capacity</label>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-black text-slate-800">{classDetail?.students?.length || 0}</span>
                                    <span className="text-xs font-bold text-slate-400 pb-1">Students Registered</span>
                                </div>
                            </div>
                            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Academic Year</label>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-black text-slate-800">{classDetail?.courseYear || 'N/A'}</span>
                                    <span className="text-xs font-bold text-slate-400 pb-1">Cohort Cycle</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-8 bg-white border-b border-slate-100 flex gap-8">
                    {[
                        { id: 'students', label: 'Student Directory', icon: User },
                        { id: 'analytics', label: 'Structural Info', icon: Info }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-4 text-[11px] font-black uppercase tracking-[0.1em] transition-all border-b-2 ${
                                activeTab === tab.id 
                                ? 'border-indigo-600 text-indigo-600' 
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-24 bg-white rounded-3xl border border-slate-100 animate-pulse"></div>
                            ))}
                        </div>
                    ) : activeTab === 'students' ? (
                        <div className="space-y-4">
                            <div className="relative group mb-8">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search directory..." 
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {filteredStudents.length === 0 ? (
                                <div className="text-center py-20 text-slate-400">
                                    <User size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-xs font-bold uppercase tracking-widest">No matching records</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {filteredStudents.map((student, idx) => (
                                        <div key={student.id} className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/30 transition-all cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{student.fullName}</h5>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: {student.studentCode}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="hidden sm:flex flex-col items-end">
                                                    {getStatusBadge(student.statusCode)}
                                                </div>
                                                <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-slate-100 group-hover:text-slate-600 transition-all">
                                                    <ChevronRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {[
                                { label: 'Department', value: classDetail?.departmentName, icon: School, bgClass: 'bg-indigo-50', textClass: 'text-indigo-600' },
                                { label: 'Specialization', value: classDetail?.majorName, icon: BookOpen, bgClass: 'bg-blue-50', textClass: 'text-blue-600' },
                                { label: 'Academic Advisor', value: classDetail?.advisorName || 'Not Assigned', icon: ShieldCheck, bgClass: 'bg-emerald-50', textClass: 'text-emerald-600' },
                                { label: 'Curriculum Level', value: 'Undergraduate (Standard)', icon: GraduationCap, bgClass: 'bg-amber-50', textClass: 'text-amber-600' },
                                { label: 'Main Facility', value: 'University Main Campus - Zone A', icon: MapPin, bgClass: 'bg-rose-50', textClass: 'text-rose-600' }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${item.bgClass} ${item.textClass}`}>
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</label>
                                            <p className="text-sm font-black text-slate-800">{item.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100 overflow-hidden relative">
                                <div className="absolute -right-4 -bottom-4 opacity-10">
                                    <Activity size={120} />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="text-lg font-black tracking-tight mb-2">Performance Index</h4>
                                    <p className="text-indigo-100 text-xs font-medium leading-relaxed opacity-80">
                                        This class maintains a high engagement score of 94% across all registered specializations for the current academic cycle.
                                    </p>
                                    <button className="mt-6 px-6 py-2.5 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                                        View Full Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 bg-white border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live System Data</span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
                    >
                        Dismiss Overlay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailModal;
