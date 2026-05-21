import { useState, useEffect } from 'react';
import { employeeApi, departmentApi, positionApi } from '../../api/lecturerApi';
import { 
    Search, Plus, MoreVertical, Edit2, Eye, Trash2, Filter, 
    ChevronLeft, ChevronRight, Briefcase, Mail, Phone, 
    GraduationCap, Building2, UserCircle, LayoutGrid, List
} from 'lucide-react';
import toast from 'react-hot-toast';
import LecturerFormModal from '../../components/lecturers/LecturerFormModal';
import LecturerDetailModal from '../../components/lecturers/LecturerDetailModal';

const LecturerManagementPage = () => {
    const [lecturers, setLecturers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Pagination & Filter State
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(8);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');

    const [modalState, setModalState] = useState({
        type: null, // 'CREATE', 'EDIT', 'VIEW'
        data: null
    });

    useEffect(() => {
        fetchDropdownData();
    }, []);

    useEffect(() => {
        fetchLecturers();
    }, [currentPage, selectedDept, selectedPosition]);

    const fetchDropdownData = async () => {
        try {
            const [deptRes, posRes] = await Promise.all([
                departmentApi.getAllActive(),
                positionApi.getAllActive()
            ]);
            if (deptRes.success) setDepartments(deptRes.data);
            if (posRes.success) setPositions(posRes.data);
        } catch (error) {
            console.error("Lỗi tải danh mục:", error);
        }
    };

    const fetchLecturers = async (search = searchTerm) => {
        setLoading(true);
        try {
            const response = await employeeApi.getAll({
                page: currentPage,
                size: pageSize,
                keyword: search,
                departmentId: selectedDept || undefined,
                positionId: selectedPosition || undefined
            });
            if (response.success) {
                setLecturers(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách giảng viên");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0);
        fetchLecturers();
    };

    const openModal = (type, data = null) => {
        setModalState({ type, data });
    };

    const closeModal = () => {
        setModalState({ type: null, data: null });
        fetchLecturers();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa cán bộ/giảng viên này?')) {
            try {
                const res = await employeeApi.delete(id);
                if (res.success) {
                    toast.success('Đã xóa thành công');
                    fetchLecturers();
                }
            } catch (error) {
                toast.error('Lỗi khi xóa');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] mesh-gradient -m-6 p-6 lg:p-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>

                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Hệ thống Quản lý Giảng viên
                    </h1>
                    <p className="text-slate-500 mt-2 flex items-center gap-2">
                        <Building2 size={16} /> 
                        Quản lý đội ngũ cán bộ, giảng viên và nhân viên nhà trường
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 ml-2">
                            {totalElements} thành viên
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900 shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-900 shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                    <button
                        onClick={() => openModal('CREATE')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                    >
                        <Plus size={20} /> Thêm Cán bộ mới
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 mb-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>

                <form onSubmit={handleSearch} className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã, họ tên hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm"
                    />
                </form>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            className="appearance-none bg-slate-50 border border-transparent text-slate-700 py-3 pl-4 pr-10 rounded-xl focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 outline-none w-full md:w-56 text-sm transition-all"
                            value={selectedDept}
                            onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(0); }}
                        >
                            <option value="">Tất cả Khoa/Viện</option>
                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                        <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            className="appearance-none bg-slate-50 border border-transparent text-slate-700 py-3 pl-4 pr-10 rounded-xl focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 outline-none w-full md:w-48 text-sm transition-all"
                            value={selectedPosition}
                            onChange={(e) => { setSelectedPosition(e.target.value); setCurrentPage(0); }}
                        >
                            <option value="">Mọi Chức danh</option>
                            {positions.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <Briefcase size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(pageSize)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl mb-4"></div>
                            <div className="h-5 bg-slate-100 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-slate-100 rounded w-1/2 mb-6"></div>
                            <div className="space-y-3">
                                <div className="h-3 bg-slate-50 rounded w-full"></div>
                                <div className="h-3 bg-slate-50 rounded w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : lecturers.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                        <Search size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy kết quả</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để tìm đúng cán bộ giảng viên bạn cần.
                    </p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {lecturers.map((lec, idx) => (
                        <div key={lec.id} 
                             className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all duration-300 relative overflow-hidden animate-slideUp"
                             style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
                        >

                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => openModal('EDIT', lec)} className="p-2 bg-white shadow-md rounded-lg text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(lec.id)} className="p-2 bg-white shadow-md rounded-lg text-slate-400 hover:text-red-600 transition-colors border border-slate-100">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <UserCircle size={32} strokeWidth={1.5} />
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                        {lec.fullName}
                                    </h3>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                                        {lec.employeeCode}
                                    </p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                                        {lec.positionName || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Building2 size={14} className="text-slate-400 shrink-0" />
                                    <span className="truncate">{lec.departmentName || 'Chưa xếp đơn vị'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <GraduationCap size={14} className="text-slate-400 shrink-0" />
                                    <span className="truncate">{lec.academicDegree || 'Học vị: N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Mail size={14} className="text-slate-400 shrink-0" />
                                    <span className="truncate">{lec.email}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => openModal('VIEW', lec)}
                                className="w-full py-2.5 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-700 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Eye size={16} /> Xem hồ sơ chi tiết
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin cán bộ</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Đơn vị / Chức vụ</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Học vị</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Liên hệ</th>
                                <th className="p-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {lecturers.map((lec, idx) => (
                                <tr key={lec.id} 
                                    className="group hover:bg-slate-50/50 transition-colors animate-slideUp"
                                    style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
                                >

                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                <UserCircle size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{lec.fullName}</p>
                                                <p className="text-xs text-slate-500">{lec.employeeCode}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm font-medium text-slate-700">{lec.departmentName || 'N/A'}</p>
                                        <p className="text-xs text-slate-500">{lec.positionName || 'N/A'}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-slate-600">{lec.academicDegree || '-'}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Mail size={12} /> {lec.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Phone size={12} /> {lec.phone || 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openModal('VIEW', lec)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                                <Eye size={18} />
                                            </button>
                                            <button onClick={() => openModal('EDIT', lec)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(lec.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        Hiển thị <span className="font-semibold text-slate-900">{lecturers.length}</span> trên <span className="font-semibold text-slate-900">{totalElements}</span> cán bộ
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        <div className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <span className="text-sm font-bold text-indigo-600">{currentPage + 1}</span>
                            <span className="mx-2 text-slate-300">/</span>
                            <span className="text-sm font-medium text-slate-500">{totalPages}</span>
                        </div>

                        <button
                            disabled={currentPage === totalPages - 1}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            {modalState.type === 'CREATE' && (
                <LecturerFormModal 
                    isOpen={true} 
                    onClose={closeModal} 
                    departments={departments} 
                    positions={positions} 
                />
            )}
            {modalState.type === 'EDIT' && (
                <LecturerFormModal 
                    isOpen={true} 
                    onClose={closeModal} 
                    data={modalState.data} 
                    departments={departments} 
                    positions={positions} 
                />
            )}
            {modalState.type === 'VIEW' && (
                <LecturerDetailModal 
                    isOpen={true} 
                    onClose={closeModal} 
                    lecturerId={modalState.data?.id} 
                />
            )}
        </div>
    );
};

export default LecturerManagementPage;
