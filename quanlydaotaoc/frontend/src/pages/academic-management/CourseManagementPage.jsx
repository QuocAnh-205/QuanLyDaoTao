import { useState, useEffect, useMemo } from 'react';
import { 
    Plus, Search, Filter, Edit2, Trash2, 
    Book, MoreVertical, Loader2, BookOpen, 
    Layers, Award, GraduationCap, Sparkles,
    ChevronRight, Info, Globe, Building2
} from 'lucide-react';
import { courseApi } from '../../api/courseApi';
import useAuthStore from '../../store/useAuthStore';
import CourseFormModal from '../../components/academic-management/CourseFormModal';
import toast from 'react-hot-toast';

const CourseManagementPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const user = useAuthStore((state) => state.user);
    const canManage = user?.roles?.some(role => ['ADMIN', 'GIAOVU'].includes(role));

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await courseApi.getAllCourses();
            if (res.success) {
                setCourses(Array.isArray(res.data) ? res.data : []);
            }
        } catch (error) {
            toast.error("Lỗi giao thức: Tải danh mục môn học thất bại");
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = useMemo(() => {
        return (Array.isArray(courses) ? courses : []).filter(course => 
            course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, courses]);

    const stats = useMemo(() => {
        return {
            total: courses.length,
            credits: courses.reduce((acc, c) => acc + (c.credits || 0), 0),
            departments: new Set(courses.map(c => c.departmentId)).size
        };
    }, [courses]);

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa định nghĩa môn học này không? Hành động này không thể hoàn tác.")) {
            try {
                const res = await courseApi.deleteCourse(id);
                if (res.success) {
                    toast.success("Đã xóa định nghĩa môn học thành công");
                    fetchCourses();
                }
            } catch (error) {
                toast.error("Lỗi thao tác: Ràng buộc dữ liệu hoặc không đủ quyền");
            }
        }
    };

    const handleAdd = () => {
        setSelectedCourse(null);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 mesh-gradient -m-6 p-6 lg:p-8 space-y-8 animate-in fade-in duration-700">
            {/* Bento Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <div className="md:col-span-2 academic-glass-card p-8 flex flex-col justify-between overflow-hidden relative group">
                    <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                            <Sparkles size={14} className="animate-pulse" />
                            Kho dữ liệu môn học
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                            Danh mục <span className="academic-text-gradient">Môn học</span>
                        </h1>
                        <p className="text-slate-500 font-bold mt-4 max-w-md text-sm leading-relaxed italic">
                            Kho lưu trữ tập trung về các học phần và chương trình giảng dạy của nhà trường.
                        </p>
                    </div>
                    {canManage && (
                        <button 
                            onClick={handleAdd}
                            className="mt-8 self-start px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3 active:scale-95 group/btn"
                        >
                            <Plus size={18} className="group-hover/btn:rotate-90 transition-transform" />
                            Thêm môn học mới
                        </button>
                    )}
                </div>

                <div className="academic-glass-card p-6 flex flex-col items-center justify-center text-center border-emerald-100/50">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl mb-4">
                        <BookOpen size={24} />
                    </div>
                    <div className="text-3xl font-black text-slate-900">{stats.total}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Tổng số môn học</div>
                </div>

                <div className="academic-glass-card p-6 flex flex-col items-center justify-center text-center border-teal-100/50">
                    <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl mb-4">
                        <Award size={24} />
                    </div>
                    <div className="text-3xl font-black text-slate-900">{stats.credits}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Tổng số tín chỉ</div>
                </div>
            </div>

            {/* Navigation & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <div className="relative flex-1 w-full group">
                    <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Tìm môn học bằng tên, mã học phần hoặc khoa quản lý..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold text-slate-700 focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-xl shadow-slate-200/20"
                    />
                </div>
                <button className="flex items-center gap-3 px-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/20 active:scale-95">
                    <Filter size={18} />
                    Bộ lọc
                </button>
            </div>

            {/* Catalog Table Matrix */}
            <div className="academic-glass-card rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/50 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 text-slate-400">
                        <Loader2 size={48} className="animate-spin mb-6 text-emerald-500" />
                        <p className="font-black tracking-[0.3em] uppercase text-[10px]">Đang kết nối kho dữ liệu...</p>
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100/50">
                                    <th className="px-10 py-8">Mã môn học</th>
                                    <th className="px-10 py-8">Tên môn học</th>
                                    <th className="px-10 py-8 text-center">Số tín chỉ</th>
                                    <th className="px-10 py-8">Khoa quản lý</th>
                                    <th className="px-10 py-8 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/50">
                                {filteredCourses.map((course, idx) => (
                                    <tr key={course.id} 
                                        className="hover:bg-emerald-50/30 transition-all group animate-slideUp"
                                        style={{ animationDelay: `${0.4 + idx * 0.03}s` }}
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-emerald-600 font-black text-xs shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                                    {course.courseCode.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black text-slate-900 uppercase tracking-tighter">{course.courseCode}</div>
                                                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Đã xác minh</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="font-black text-slate-800 group-hover:text-emerald-700 transition-colors text-base leading-tight">{course.courseName}</div>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold italic">
                                                    <Globe size={10} /> {course.courseNameEn || 'Môn đại cương'}
                                                </div>
                                                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full uppercase tracking-wider group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">{course.courseType}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <div className="inline-flex flex-col items-center p-3 bg-white border border-slate-100 rounded-2xl shadow-sm group-hover:border-emerald-200 transition-all">
                                                <span className="text-2xl font-black text-slate-900 leading-none">{course.credits}</span>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">Tín chỉ</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4 group/dept">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors border border-transparent group-hover:border-teal-100">
                                                    <Building2 size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black text-slate-700 truncate max-w-[150px]">{course.departmentName || '---'}</div>
                                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Khoa</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                                {canManage && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleEdit(course)}
                                                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(course.id)}
                                                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100"
                                                            title="Xóa"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 text-slate-300">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                            <BookOpen size={48} className="opacity-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 tracking-widest uppercase">Danh sách trống</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Không tìm thấy môn học nào khớp với từ khóa</p>
                    </div>
                )}
            </div>

            {/* Footer / System Insights */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-10 py-6 bg-slate-900 rounded-[2.5rem] border border-emerald-900/20 text-[10px] font-black uppercase tracking-[0.2em] animate-slideUp shadow-2xl shadow-slate-900/40" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-6">
                    <div className="text-emerald-500/80">
                        Đang hiển thị: <span className="text-white ml-2">{filteredCourses.length} môn học</span>
                    </div>
                    <div className="text-slate-500">
                        Trạng thái hệ thống: <span className="text-slate-300 ml-2">Tối ưu</span>
                    </div>
                </div>
                <div className="flex gap-4 mt-6 sm:mt-0">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl transition-all active:scale-95 disabled:opacity-20">Trang trước</button>
                    <button className="px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition-all shadow-lg shadow-emerald-900/50 active:scale-95">Trang sau</button>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <CourseFormModal 
                    isOpen={true}
                    onClose={() => setIsModalOpen(false)}
                    initialData={selectedCourse}
                    onUpdate={fetchCourses}
                />
            )}
        </div>
    );
};

export default CourseManagementPage;
