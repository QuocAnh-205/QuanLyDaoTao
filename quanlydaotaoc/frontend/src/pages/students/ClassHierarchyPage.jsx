import { useState, useEffect, useMemo } from 'react';
import { classApi } from '../../api/studentApi';
import { 
    ChevronRight, ChevronDown, GraduationCap, School, Users, 
    Layers, Search, Building2, BookOpen, LayoutGrid, Sparkles,
    ArrowUpRight, Target, Activity, MoreHorizontal
} from 'lucide-react';
import ClassDetailModal from '../../components/ClassDetailModal';

const ClassHierarchyPage = () => {
    const [hierarchy, setHierarchy] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedDepts, setExpandedDepts] = useState({});
    const [expandedMajors, setExpandedMajors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchHierarchy();
    }, []);

    const fetchHierarchy = async () => {
        setLoading(true);
        try {
            const response = await classApi.getHierarchy();
            if (response.success) {
                setHierarchy(response.data);
                if (response.data.length > 0) {
                    setExpandedDepts({ [response.data[0].id]: true });
                }
            }
        } catch (error) {
            console.error('Lỗi khi tải cấu trúc lớp:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats for the bento header
    const stats = useMemo(() => {
        let totalDepts = hierarchy.length;
        let totalMajors = 0;
        let totalClasses = 0;
        let totalStudents = 0;

        hierarchy.forEach(dept => {
            totalMajors += dept.majors.length;
            dept.majors.forEach(major => {
                totalClasses += major.classes.length;
                major.classes.forEach(cls => {
                    totalStudents += (cls.studentCount || 0);
                });
            });
        });

        return { totalDepts, totalMajors, totalClasses, totalStudents };
    }, [hierarchy]);

    const toggleDept = (id) => {
        setExpandedDepts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleMajor = (id) => {
        setExpandedMajors(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleClassClick = (id) => {
        setSelectedClassId(id);
        setIsModalOpen(true);
    };

    const filteredHierarchy = useMemo(() => {
        return hierarchy.map(dept => {
            const filteredMajors = dept.majors.map(major => {
                const filteredClasses = major.classes.filter(c => 
                    c.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.classCode.toLowerCase().includes(searchTerm.toLowerCase())
                );
                return { ...major, classes: filteredClasses };
            }).filter(major => 
                major.majorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                major.classes.length > 0
            );

            return { ...dept, majors: filteredMajors };
        }).filter(dept => 
            dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            dept.majors.length > 0
        );
    }, [hierarchy, searchTerm]);

    return (
        <div className="space-y-8 animate-slideUp">
            {/* Premium Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-600 rounded-full"></div>
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 pl-2">
                        <Sparkles size={14} className="animate-pulse" />
                        Cấu trúc đào tạo
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight pl-2">
                        Quản lý <span className="text-gradient">Lớp học</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium pl-2 max-w-md">
                        Khám phá và quản lý cấu trúc cây đào tạo của trường đại học thông qua sơ đồ trực quan.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative group min-w-[340px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm khoa, chuyên ngành hoặc lớp sinh hoạt..." 
                            className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl text-slate-700 font-semibold shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Bento Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Khoa đào tạo', value: stats.totalDepts, icon: School, color: 'indigo', growth: '+2% so với kỳ trước', bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-600' },
                    { label: 'Chuyên ngành', value: stats.totalMajors, icon: Target, color: 'emerald', growth: 'Thêm mới 3', bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-600' },
                    { label: 'Lớp học hoạt động', value: stats.totalClasses, icon: LayoutGrid, color: 'amber', growth: 'Công suất tối đa', bgClass: 'bg-amber-500/10', textClass: 'text-amber-600' },
                    { label: 'Sinh viên đăng ký', value: stats.totalStudents || '2.4k+', icon: Users, color: 'rose', growth: '+12% tăng trưởng', bgClass: 'bg-rose-500/10', textClass: 'text-rose-600' }
                ].map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-[2rem] border-white/40 hover:scale-[1.02] transition-all cursor-default">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bgClass} ${stat.textClass}`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-tighter">
                                {stat.growth}
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-800 tracking-tight mb-1">{stat.value}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Hierarchy Explorer */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={28} />
                    </div>
                    <p className="mt-8 font-black text-slate-500 animate-pulse tracking-[0.3em] uppercase text-[10px]">Đang nạp ma trận lớp học...</p>
                </div>
            ) : filteredHierarchy.length === 0 ? (
                <div className="glass-card rounded-[3rem] p-32 text-center border-dashed border-2 border-slate-200">
                    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                        <Layers size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800">Dữ liệu trống</h3>
                    <p className="text-slate-500 mt-2 font-medium">Không tìm thấy bản ghi nào khớp với điều kiện tìm kiếm.</p>
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                    >
                        Đặt lại bộ lọc
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {filteredHierarchy.map((dept) => (
                        <div key={dept.id} className="relative group">
                            {/* Department Card */}
                            <div className={`overflow-hidden rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500`}>
                                <div 
                                    className={`flex flex-col md:flex-row items-center gap-6 p-8 cursor-pointer transition-colors ${expandedDepts[dept.id] ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}
                                    onClick={() => toggleDept(dept.id)}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Building2 size={32} />
                                        </div>
                                        {expandedDepts[dept.id] && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                        )}
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{dept.departmentName}</h3>
                                            <span className="text-[10px] font-black bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-full uppercase shadow-sm">
                                                {dept.departmentCode}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                                            <MoreHorizontal size={14} className="text-indigo-400" />
                                            Có {dept.majors.length} chuyên ngành chính
                                        </p>
                                    </div>

                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${expandedDepts[dept.id] ? 'bg-indigo-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                                        <ChevronDown size={24} />
                                    </div>
                                </div>

                                {/* Majors & Classes */}
                                {expandedDepts[dept.id] && (
                                    <div className="px-8 pb-8 space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
                                        
                                        {dept.majors.map(major => (
                                            <div key={major.id} className="relative pl-0 lg:pl-12">
                                                {/* Desktop Vertical Line */}
                                                <div className="hidden lg:block absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-100 via-slate-100 to-transparent"></div>
                                                
                                                <div 
                                                    className="flex items-center gap-4 mb-6 cursor-pointer group/major"
                                                    onClick={() => toggleMajor(major.id)}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${expandedMajors[major.id] ? 'bg-amber-100 text-amber-600 scale-110 shadow-lg shadow-amber-100' : 'bg-slate-50 text-slate-300'}`}>
                                                        <GraduationCap size={22} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-slate-700 group-hover/major:text-indigo-600 transition-colors tracking-tight">
                                                            {major.majorName}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                Có {major.classes.length} lớp học đang vận hành
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={18} className={`ml-2 text-slate-300 transition-all duration-300 ${expandedMajors[major.id] ? 'rotate-90 text-amber-500' : ''}`} />
                                                </div>

                                                {/* Classes Bento Grid */}
                                                {expandedMajors[major.id] && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 animate-in zoom-in-95 duration-300">
                                                        {major.classes.map(cls => (
                                                            <div 
                                                                 key={cls.id} 
                                                                 onClick={() => handleClassClick(cls.id)}
                                                                 className="group relative bg-slate-50/50 rounded-3xl border border-slate-100 p-6 hover:bg-white hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all cursor-pointer overflow-hidden"
                                                            >
                                                                {/* Hover Glow Effect */}
                                                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                                                                
                                                                <div className="relative z-10">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <div className="px-3 py-1 bg-white rounded-lg border border-slate-100 text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
                                                                            {cls.classCode}
                                                                        </div>
                                                                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                            <ArrowUpRight size={16} />
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <h5 className="font-black text-slate-800 text-sm mb-6 leading-tight group-hover:text-indigo-600 transition-colors h-10 line-clamp-2">
                                                                        {cls.className}
                                                                    </h5>
                                                                    
                                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
                                                                        <div className="flex items-center -space-x-2">
                                                                            {[1, 2, 3].map(i => (
                                                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                                                                                    {i}
                                                                                </div>
                                                                            ))}
                                                                            <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[8px] font-bold text-white">
                                                                                +{cls.studentCount || 0}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                                            Khóa tuyển sinh: {cls.courseYear || 'N/A'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {major.classes.length === 0 && (
                                                            <div className="col-span-full py-12 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                                                                <BookOpen size={32} className="mb-2 opacity-20" />
                                                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Chưa có lớp sinh hoạt</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ClassDetailModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                classId={selectedClassId}
            />
        </div>
    );
};

export default ClassHierarchyPage;
