import { 
    X, Users, BookOpen, User, Calendar, ShieldCheck, 
    MapPin, Info, ArrowUpRight, Sparkles, Activity,
    Globe, Layout, GraduationCap, Clock
} from 'lucide-react';

const SectionDetailModal = ({ isOpen, onClose, section }) => {
    if (!isOpen || !section) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fadeIn">
            <div className="academic-glass-card rounded-[3rem] shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden border border-emerald-100/30 transform animate-slideUp">
                {/* Visual Header */}
                <div className="relative h-56 bg-slate-900 shrink-0 overflow-hidden">
                    <button onClick={onClose} className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all z-20 backdrop-blur-sm border border-white/10">
                        <X size={28} />
                    </button>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 opacity-90"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-10"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-white/10 shadow-xl">
                                {section.classCode}
                            </span>
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 backdrop-blur-md text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-emerald-500/30">
                                <Activity size={12} className="animate-pulse" />
                                {section.status} Matrix
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">{section.courseName}</h2>
                        <div className="flex items-center gap-2 mt-4 text-emerald-200/60 font-black text-[10px] uppercase tracking-[0.2em]">
                            <Sparkles size={14} className="animate-pulse" />
                            Knowledge Artifact Details
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50 p-10 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left Sector: Technical Specs */}
                        <div className="lg:col-span-7 space-y-8">
                            <section>
                                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                    <Layout size={16} /> Operational Architecture
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <DetailItem 
                                        icon={<BookOpen size={20} />} 
                                        label="Course Matrix" 
                                        value={section.courseName} 
                                    />
                                    <DetailItem 
                                        icon={<ShieldCheck size={20} />} 
                                        label="Artifact Identity" 
                                        value={section.classCode} 
                                    />
                                    <DetailItem 
                                        icon={<Calendar size={20} />} 
                                        label="Deployment Cycle" 
                                        value={section.semesterName} 
                                    />
                                    <DetailItem 
                                        icon={<Award size={20} />} 
                                        label="Academic Weight" 
                                        value={`${section.credits || 0} Credits`} 
                                    />
                                </div>
                            </section>

                            <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-4 opacity-5">
                                    <Info size={120} />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <MessageSquare size={16} className="text-emerald-500" /> Operational Directives
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed font-bold italic relative z-10">
                                    {section.notes || "Standard deployment protocol in effect. No localized overrides detected for this knowledge matrix section."}
                                </p>
                            </section>
                        </div>

                        {/* Right Sector: Personnel & Capacity */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-900/40 relative overflow-hidden group">
                                <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
                                
                                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-10 flex items-center justify-between">
                                    Assigned Faculty
                                    <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </h3>

                                <div className="flex items-center gap-6 mb-12">
                                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 border border-white/10 shadow-inner group-hover:scale-105 transition-transform">
                                        <GraduationCap size={40} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Matrix Lead</p>
                                        <p className="text-2xl font-black text-white tracking-tighter leading-none">{section.lecturerName}</p>
                                        <div className="flex items-center gap-2 mt-3">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">Verified Commander</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 pt-8 border-t border-white/5">
                                    <div>
                                        <div className="flex justify-between items-end mb-4">
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Enrollment Load</span>
                                            <span className="text-2xl font-black text-emerald-400 tabular-nums">
                                                {Math.round((section.currentStudents / section.maxStudents) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden p-1 shadow-inner border border-white/5">
                                            <div 
                                                className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all duration-1000 ease-out"
                                                style={{ width: `${Math.min(100, (section.currentStudents / section.maxStudents) * 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between mt-4 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                                            <span className="flex items-center gap-2"><Users size={10} /> Deployed: {section.currentStudents}</span>
                                            <span>Cap: {section.maxStudents}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-95 group/btn shadow-xl">
                                    Inspect Personnel Registry <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>
                            </div>

                            <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100/50 flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Protocol Secured</h4>
                                    <p className="text-[9px] font-bold text-slate-500 mt-0.5 uppercase tracking-tighter">Data integrity verified by Mission Control</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-5 p-6 bg-white border border-slate-200/60 rounded-3xl hover:border-emerald-300 transition-all group shadow-sm hover:shadow-xl hover:shadow-emerald-500/5">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6 text-slate-400 shadow-inner">
            {icon}
        </div>
        <div className="overflow-hidden">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 group-hover:text-emerald-500 transition-colors">{label}</p>
            <p className="text-sm font-black text-slate-900 truncate leading-tight">{value}</p>
        </div>
    </div>
);

export default SectionDetailModal;
