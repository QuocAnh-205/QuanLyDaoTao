import { useState, useEffect } from 'react';
import { 
    Calendar, Users, List, ChevronRight, Loader2, Info, 
    ArrowRight, Plus, Edit3, Trash2, Settings, BookOpen, 
    CheckCircle2, Clock, Layers, GraduationCap, Sparkles,
    ShieldCheck, Activity, Search, Filter, UserCircle,
    LayoutDashboard, Database
} from 'lucide-react';
import { semesterApi } from '../../api/semesterApi';
import useAuthStore from '../../store/useAuthStore';
import SemesterFormModal from '../../components/academic-management/SemesterFormModal';
import SectionFormModal from '../../components/academic-management/SectionFormModal';
import SectionDetailModal from '../../components/academic-management/SectionDetailModal';
import toast from 'react-hot-toast';

const AcademicManagementPage = () => {
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [sections, setSections] = useState([]);
    const [loadingSemesters, setLoadingSemesters] = useState(true);
    const [loadingSections, setLoadingSections] = useState(false);

    // Modal state
    const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);
    const [selectedSemesterForEdit, setSelectedSemesterForEdit] = useState(null);
    
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [selectedSectionForEdit, setSelectedSectionForEdit] = useState(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSectionForDetail, setSelectedSectionForDetail] = useState(null);

    const user = useAuthStore((state) => state.user);
    const canManage = user?.roles?.some(role => ['ADMIN', 'GIAOVU'].includes(role));

    useEffect(() => {
        fetchSemesters();
    }, []);

    useEffect(() => {
        if (selectedSemester) {
            fetchSections(selectedSemester.id);
        } else {
            setSections([]);
        }
    }, [selectedSemester]);

    const fetchSemesters = async () => {
        setLoadingSemesters(true);
        try {
            const res = await semesterApi.getAllSemesters();
            if (res.success) {
                setSemesters(res.data);
                if (!selectedSemester) {
                    const active = res.data.find(s => s.isActive);
                    if (active) setSelectedSemester(active);
                    else if (res.data.length > 0) setSelectedSemester(res.data[0]);
                } else {
                    const updated = res.data.find(s => s.id === selectedSemester.id);
                    if (updated) setSelectedSemester(updated);
                }
            }
        } catch (error) {
            toast.error("Protocol Error: Cannot fetch semester cycles");
        } finally {
            setLoadingSemesters(false);
        }
    };

    const fetchSections = async (semesterId) => {
        setLoadingSections(true);
        try {
            const res = await semesterApi.getSectionsBySemester(semesterId);
            if (res.success) {
                setSections(res.data);
            }
        } catch (error) {
            toast.error("Protocol Error: Section retrieval failed");
        } finally {
            setLoadingSections(false);
        }
    };

    const handleAddSemester = () => {
        setSelectedSemesterForEdit(null);
        setIsSemesterModalOpen(true);
    };

    const handleEditSemester = (semester, e) => {
        e.stopPropagation();
        setSelectedSemesterForEdit(semester);
        setIsSemesterModalOpen(true);
    };

    const handleDeleteSemester = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("CRITICAL WARNING: Purging a semester will dismantle all linked course sections. Confirm protocol?")) {
            try {
                const res = await semesterApi.deleteSemester(id);
                if (res.success) {
                    toast.success("Semester Cycle Purged");
                    if (selectedSemester?.id === id) setSelectedSemester(null);
                    fetchSemesters();
                }
            } catch (error) {
                toast.error("Operation Denied: Active dependencies detected");
            }
        }
    };

    const handleAddSection = () => {
        if (!selectedSemester) {
            toast.error("Initialization Required: Select an active semester first");
            return;
        }
        setSelectedSectionForEdit(null);
        setIsSectionModalOpen(true);
    };

    const handleEditSection = (section) => {
        setSelectedSectionForEdit(section);
        setIsSectionModalOpen(true);
    };

    const handleViewDetail = (section) => {
        setSelectedSectionForDetail(section);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="flex flex-col gap-10 animate-in fade-in duration-700">
            {/* Header: Visual Hierarchy Boost */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-slate-200/60">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">
                        <Activity size={14} className="animate-pulse" />
                        Strategic Core Operations
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                        Academic <span className="academic-text-gradient">Management</span>
                    </h1>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest max-w-xl">
                        Deploy and monitor knowledge matrices across active academic cycles.
                    </p>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="bg-white px-8 py-4 rounded-[2rem] border border-slate-200 shadow-xl flex items-center gap-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex -space-x-4">
                            {semesters.slice(0, 4).map((s, i) => (
                                <div key={s.id} className="w-12 h-12 rounded-2xl border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-emerald-600 shadow-lg overflow-hidden uppercase tracking-tighter transition-transform hover:-translate-y-1 hover:z-10 bg-white">
                                    {s.semesterName.substring(0, 2)}
                                </div>
                            ))}
                        </div>
                        <div className="h-10 w-px bg-slate-100"></div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-slate-900 leading-none">{semesters.length}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Cycles</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left Column: Cycles Control (The "Selector") */}
                <aside className="lg:col-span-4 xl:col-span-3 space-y-8 sticky top-28">
                    <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-slate-800">
                        <div className="p-8 border-b border-slate-800 flex items-center justify-between relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-3">
                                    <Database size={18} className="text-emerald-500" /> Registry
                                </h3>
                                <p className="text-emerald-500/40 text-[9px] font-black uppercase tracking-[0.25em] mt-1">Operational Scopes</p>
                            </div>
                            {canManage && (
                                <button 
                                    onClick={handleAddSemester}
                                    className="w-10 h-10 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-95 group"
                                >
                                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                                </button>
                            )}
                        </div>

                        <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar-dark space-y-2">
                            {semesters.map((semester) => (
                                <button
                                    key={semester.id}
                                    onClick={() => setSelectedSemester(semester)}
                                    className={`w-full group relative p-5 rounded-2xl transition-all flex flex-col gap-3 text-left border-2 ${
                                        selectedSemester?.id === semester.id
                                        ? 'bg-emerald-500 border-emerald-400 shadow-xl shadow-emerald-500/20'
                                        : 'bg-transparent border-transparent hover:bg-slate-800'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`text-sm font-black tracking-tight ${selectedSemester?.id === semester.id ? 'text-slate-900' : 'text-slate-200 group-hover:text-white'}`}>
                                            {semester.semesterName}
                                        </div>
                                        {semester.isActive && (
                                            <div className={`w-2 h-2 rounded-full ${selectedSemester?.id === semester.id ? 'bg-white shadow-[0_0_8px_white]' : 'bg-emerald-500 animate-pulse'}`}></div>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className={`text-[10px] font-black uppercase tracking-widest ${selectedSemester?.id === semester.id ? 'text-slate-900/60' : 'text-slate-500'}`}>
                                            {semester.academicYear}
                                        </div>
                                        {selectedSemester?.id === semester.id && (
                                            <div className="flex gap-1">
                                                <button onClick={(e) => handleEditSemester(semester, e)} className="p-1.5 hover:bg-white/20 rounded-md transition-colors">
                                                    <Edit3 size={12} className="text-slate-900" />
                                                </button>
                                                <button onClick={(e) => handleDeleteSemester(semester.id, e)} className="p-1.5 hover:bg-white/20 rounded-md transition-colors">
                                                    <Trash2 size={12} className="text-slate-900" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100/50 shadow-lg relative overflow-hidden group">
                        <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex gap-5 relative z-10">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-xl border border-emerald-50 shrink-0">
                                <Info size={24} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em] mb-1">Operational Guard</h4>
                                <p className="text-xs font-bold text-slate-600 leading-relaxed italic">Scopes are isolated per cycle to maintain data integrity across the matrix.</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right Column: Matrix Operations (The "Workspace") */}
                <main className="lg:col-span-8 xl:col-span-9 space-y-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 shadow-xl flex items-center justify-center text-slate-400">
                                <LayoutDashboard size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tighter">
                                    Section Operations
                                    {selectedSemester && (
                                        <span className="text-emerald-500 font-black flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-slate-200 rounded-full"></div>
                                            {selectedSemester.semesterName}
                                        </span>
                                    )}
                                </h2>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Live Deployment Matrix</p>
                            </div>
                        </div>

                        {canManage && (
                            <button 
                                onClick={handleAddSection}
                                className="px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl shadow-slate-900/30 flex items-center gap-3 active:scale-95 group"
                            >
                                <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
                                Deploy Matrix
                            </button>
                        )}
                    </div>

                    {loadingSections ? (
                        <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                            <Loader2 size={48} className="animate-spin mb-6 text-emerald-500" />
                            <p className="font-black text-xs tracking-[0.4em] uppercase text-slate-300">Synchronizing Matrix Data...</p>
                        </div>
                    ) : sections.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {sections.map((section, idx) => (
                                <div 
                                    key={section.id} 
                                    className="group bg-white border border-slate-200/60 hover:border-emerald-500/50 rounded-[3rem] p-10 transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(16,185,129,0.2)] relative overflow-hidden animate-slideUp flex flex-col justify-between"
                                    style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors"></div>
                                    
                                    <div>
                                        <div className="flex items-center justify-between mb-10 relative z-10">
                                            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{section.classCode}</span>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${
                                                section.status === 'open' 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5' 
                                                : 'bg-slate-50 text-slate-400 border-slate-100'
                                            }`}>
                                                {section.status}
                                            </div>
                                        </div>

                                        <h4 className="font-black text-slate-900 group-hover:text-emerald-700 transition-colors text-xl leading-tight tracking-tight mb-8 h-[3.5rem] line-clamp-2">
                                            {section.courseName}
                                        </h4>

                                        <div className="flex items-center gap-5 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 group-hover:bg-white group-hover:shadow-xl transition-all group-hover:border-emerald-100/30">
                                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-300 border border-slate-100 shrink-0 group-hover:text-emerald-500 transition-colors shadow-inner">
                                                <UserCircle size={32} />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">Matrix Commander</p>
                                                <p className="text-sm font-black text-slate-800 truncate" title={section.lecturerName || 'Unassigned'}>
                                                    {section.lecturerName || 'Unassigned'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10 space-y-8 relative z-10">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrollment Payload</span>
                                                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                                                    {section.currentStudents} <div className="w-1 h-1 rounded-full bg-slate-300"></div> <span className="text-slate-400">{section.maxStudents}</span>
                                                </span>
                                            </div>
                                            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner border border-slate-200/50">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(16,185,129,0.3)]" 
                                                    style={{ width: `${Math.min(100, (section.currentStudents / section.maxStudents) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => handleViewDetail(section)}
                                                className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95"
                                            >
                                                Inspect Detail
                                            </button>
                                            {canManage && (
                                                <button 
                                                    onClick={() => handleEditSection(section)}
                                                    className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-2xl">
                            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-10 shadow-inner">
                                <List size={56} className="text-slate-200" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase mb-4">Operational Void</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] max-w-xs text-center leading-relaxed">No knowledge matrices have been deployed for this cycle.</p>
                            {canManage && (
                                <button 
                                    onClick={handleAddSection} 
                                    className="mt-12 px-12 py-5 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-black rounded-[2rem] text-xs uppercase tracking-widest transition-all shadow-2xl shadow-emerald-500/20 active:scale-95"
                                >
                                    Initiate Matrix Deployment
                                </button>
                            )}
                        </div>
                    )}

                    {/* Bottom Status Panel */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        <div className="flex items-center gap-10 relative z-10">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={18} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data Protocols Secured</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Activity size={18} className="text-teal-400 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Pulse: Nominal</span>
                            </div>
                        </div>
                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] relative z-10">
                            Central Ops Terminal v4.0.5
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            {isSemesterModalOpen && (
                <SemesterFormModal 
                    isOpen={true}
                    onClose={() => setIsSemesterModalOpen(false)}
                    initialData={selectedSemesterForEdit}
                    onUpdate={() => fetchSemesters()}
                />
            )}

            {isSectionModalOpen && (
                <SectionFormModal
                    isOpen={true}
                    onClose={() => setIsSectionModalOpen(false)}
                    semesterId={selectedSemester?.id}
                    initialData={selectedSectionForEdit}
                    onUpdate={() => fetchSections(selectedSemester.id)}
                />
            )}

            {isDetailModalOpen && (
                <SectionDetailModal
                    isOpen={true}
                    onClose={() => setIsDetailModalOpen(false)}
                    section={selectedSectionForDetail}
                />
            )}
        </div>
    );
};

export default AcademicManagementPage;
