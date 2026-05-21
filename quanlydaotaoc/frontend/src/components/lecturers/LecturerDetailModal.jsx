import { useState, useEffect } from 'react';
import { X, Briefcase, User, Mail, Phone, MapPin, Award, BookOpen, Calendar, DollarSign, Loader2, UserCircle, ShieldCheck } from 'lucide-react';
import { employeeApi } from '../../api/lecturerApi';

const LecturerDetailModal = ({ isOpen, onClose, lecturerId }) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && lecturerId) {
            fetchDetail();
        }
    }, [isOpen, lecturerId]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await employeeApi.getById(lecturerId);
            if (res.success) {
                setDetail(res.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải chi tiết:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20 transform animate-in zoom-in-95 duration-500">
                {/* Visual Header Background */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 shrink-0">
                    <button onClick={onClose} className="absolute top-6 right-6 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all z-20 backdrop-blur-sm">
                        <X size={24} />
                    </button>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                </div>

                {loading ? (
                    <div className="flex-1 p-24 flex flex-col items-center justify-center text-slate-400">
                        <Loader2 size={48} className="animate-spin mb-6 text-indigo-500" />
                        <p className="font-medium animate-pulse">Đang truy xuất hồ sơ cán bộ...</p>
                    </div>
                ) : detail ? (
                    <div className="flex-1 overflow-y-auto px-10 pb-12 pt-0 relative bg-white">
                        {/* Avatar & Hero Info */}
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end -mt-20 mb-12 relative z-10">
                            <div className="w-40 h-40 rounded-[2rem] bg-white p-2 shadow-2xl shadow-indigo-200/50 shrink-0 transform group-hover:rotate-3 transition-transform">
                                <div className="w-full h-full bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-indigo-500 border-2 border-slate-50">
                                    <UserCircle size={80} strokeWidth={1} />
                                </div>
                            </div>
                            <div className="flex-1 pb-2">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">{detail.fullName}</h2>
                                    <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-200">
                                        {detail.employeeCode}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
                                    <p className="flex items-center gap-2">
                                        <Briefcase size={18} className="text-indigo-500" /> 
                                        {detail.positionName || 'Chưa xếp chức danh'}
                                    </p>
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                    <p className="flex items-center gap-2">
                                        <ShieldCheck size={18} className="text-emerald-500" /> 
                                        {detail.departmentName || 'Chưa xếp Đơn vị'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                            {/* Cột trái: Thông tin chính */}
                            <div className="lg:col-span-3 space-y-10">
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                            <User size={18} />
                                        </span>
                                        Thông tin cơ bản
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                                        <InfoItem icon={<Mail />} label="Địa chỉ Email" value={detail.email} />
                                        <InfoItem icon={<Phone />} label="Số điện thoại" value={detail.phone} />
                                        <InfoItem icon={<Calendar />} label="Ngày sinh" value={detail.dateOfBirth} />
                                        <InfoItem icon={<MapPin />} label="Địa chỉ liên hệ" value={detail.address} />
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <Award size={18} />
                                        </span>
                                        Học thuật & Chuyên môn
                                    </h3>
                                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Học hàm / Học vị</p>
                                                <p className="text-slate-900 font-bold text-lg">
                                                    {[detail.academicTitle, detail.academicDegree].filter(Boolean).join(' — ') || 'Chưa cập nhật'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Chuyên môn sâu</p>
                                                <p className="text-slate-900 font-bold text-lg">{detail.specialization || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Cột phải: Thông tin nhân sự */}
                            <div className="lg:col-span-2">
                                <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl shadow-slate-200">
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400 mb-8 flex items-center justify-between">
                                        Hồ sơ Nhân sự
                                        <Briefcase size={16} />
                                    </h3>
                                    <ul className="space-y-8">
                                        <HumanResourceItem 
                                            icon={<Calendar size={18} />} 
                                            label="Ngày tuyển dụng" 
                                            value={detail.hireDate || 'N/A'} 
                                        />
                                        <HumanResourceItem 
                                            icon={<ShieldCheck size={18} />} 
                                            label="Loại hợp đồng" 
                                            value={detail.contractType || 'N/A'} 
                                        />
                                        <HumanResourceItem 
                                            icon={<DollarSign size={18} />} 
                                            label="Hệ số lương" 
                                            value={detail.salaryCoefficient || '0.00'} 
                                        />
                                    </ul>
                                    
                                    <div className="mt-12 pt-8 border-t border-white/10">
                                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                                <ShieldCheck size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white">Trạng thái hồ sơ</p>
                                                <p className="text-[10px] text-white/50">Đã xác thực bởi phòng đào tạo</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-20 text-center text-slate-400">Không tìm thấy dữ liệu cán bộ</div>
                )}
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="flex gap-4">
        <div className="text-slate-400 mt-1 shrink-0">{icon && <span className="[&>svg]:w-5 [&>svg]:h-5">{icon}</span>}</div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-slate-900 font-bold leading-relaxed">{value || 'N/A'}</p>
        </div>
    </div>
);

const HumanResourceItem = ({ icon, label, value }) => (
    <li className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-400 shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-white font-bold">{value}</p>
        </div>
    </li>
);

export default LecturerDetailModal;
