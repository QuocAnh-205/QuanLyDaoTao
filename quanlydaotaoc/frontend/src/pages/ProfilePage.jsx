import { useState, useEffect, useRef } from 'react';
import { profileApi } from '../api/profileApi';
import {
    User, Mail, Phone, Calendar, MapPin, Briefcase,
    Award, BookOpen, Shield, Loader2, CreditCard,
    Edit3, Camera, Sparkles, Globe, ShieldCheck,
    GraduationCap, Activity, Layout, UserCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProfileEditModal from '../components/ProfileEditModal';
import useAuthStore from '../store/useAuthStore';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const fileInputRef = useRef(null);
    const setAuth = useAuthStore(state => state.setAuth);
    const token = useAuthStore(state => state.token);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await profileApi.getProfile();
            if (res.success) {
                setProfile(res.data);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error(error);
            setError(true);
            toast.error("Lỗi kết nối: Đồng bộ thông tin cá nhân thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const loadingToast = toast.loading("Đang tải ảnh đại diện lên hệ thống...");
        try {
            const res = await profileApi.updateAvatar(file);
            if (res.success) {
                toast.success("Cập nhật ảnh đại diện thành công", { id: loadingToast });
                const updatedProfile = { ...profile, avatarUrl: res.data };
                setProfile(updatedProfile);

                setAuth(token, {
                    ...useAuthStore.getState().user,
                    avatarUrl: res.data
                });
            }
        } catch (error) {
            toast.error("Lỗi khi tải ảnh đại diện lên", { id: loadingToast });
        }
    };

    const handleProfileUpdated = (updatedData) => {
        setProfile(updatedData);
        setAuth(token, {
            ...useAuthStore.getState().user,
            fullName: updatedData.fullName,
            email: updatedData.email
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 size={40} className="animate-spin text-emerald-500" />
                <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Đang nạp thông tin cá nhân...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12 bg-white rounded-[3rem] border border-slate-100 shadow-2xl animate-fadeIn">
                <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 border border-rose-100 shadow-inner">
                    <User size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Tải thông tin thất bại</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8 max-w-xs">Đã xảy ra lỗi đồng bộ hóa hồ sơ tài khoản.</p>
                <button
                    onClick={fetchProfile}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    const isStudent = profile.profileType === 'STUDENT';
    const isEmployee = profile.profileType === 'EMPLOYEE';
    const subProfile = isStudent ? profile.studentProfile : profile.employeeProfile;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header Section: Premium Hero Card */}
            <div className="academic-glass-card rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 border-emerald-100/50 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl -ml-24 -mb-24"></div>

                <div className="absolute top-8 right-8 z-20">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-[10px] font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 uppercase tracking-[0.2em]"
                    >
                        <Edit3 size={14} /> Cập nhật hồ sơ
                    </button>
                </div>

                <div className="relative group/avatar cursor-pointer shrink-0" onClick={handleAvatarClick}>
                    <div className="w-40 h-40 rounded-[2.5rem] border-8 border-white overflow-hidden bg-slate-50 flex items-center justify-center transition-all group-hover/avatar:scale-105 duration-500 shadow-2xl relative z-10">
                        {profile.avatarUrl ? (
                            <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <UserCircle size={64} className="text-slate-200" />
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-emerald-600/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 z-20 backdrop-blur-sm">
                        <Camera size={32} className="text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-white rounded-2xl shadow-lg z-30 flex items-center justify-center">
                        <ShieldCheck size={18} className="text-white" />
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                <div className="flex-1 text-center md:text-left relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{profile.fullName}</h1>
                        <div className="flex gap-2 justify-center md:justify-start">
                            {profile.roles.map(role => (
                                <span key={role} className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100 shadow-sm">
                                    {role === 'ADMIN' ? 'QUẢN TRỊ VIÊN' : role === 'GIAOVU' ? 'GIÁO VỤ' : role === 'GIANGVIEN' ? 'GIẢNG VIÊN' : role === 'SINHVIEN' ? 'SINH VIÊN' : role}
                                </span>
                            ))}
                        </div>
                    </div>
                    <p className="text-emerald-600 font-black text-lg mb-6 flex items-center justify-center md:justify-start gap-2">
                        <Sparkles size={18} className="animate-pulse" />
                        @{profile.username}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-center justify-center md:justify-start gap-4 p-4 bg-white/40 rounded-2xl border border-white/60 shadow-sm group/item hover:bg-white transition-all">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover/item:text-emerald-500 shadow-sm border border-slate-100 transition-colors">
                                <Mail size={18} />
                            </div>
                            <div className="text-left">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Địa chỉ Email</p>
                                <p className="text-sm font-black text-slate-700 truncate">{profile.email || 'Chưa thiết lập'}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-4 p-4 bg-white/40 rounded-2xl border border-white/60 shadow-sm group/item hover:bg-white transition-all">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover/item:text-emerald-500 shadow-sm border border-slate-100 transition-colors">
                                <Phone size={18} />
                            </div>
                            <div className="text-left">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</p>
                                <p className="text-sm font-black text-slate-700 truncate">{profile.phone || 'Chưa thiết lập'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Sections: Grid Bento */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Bento: Identity Specs */}
                <div className="lg:col-span-5 space-y-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    <div className="academic-glass-card rounded-[2.5rem] p-8 border-slate-100 shadow-xl space-y-8 relative overflow-hidden bg-white/60">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                            <User size={120} />
                        </div>
                        <h3 className="text-xs font-black text-slate-900 flex items-center gap-3 uppercase tracking-[0.2em] relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                <Layout size={16} />
                            </div>
                            Thông tin cơ bản
                        </h3>

                        <div className="grid grid-cols-1 gap-6 relative z-10">
                            <DetailItem label="Giới tính" value={subProfile?.gender === '1' ? 'Nam' : subProfile?.gender === '2' ? 'Nữ' : 'Khác'} icon={<User size={18} />} />
                            <DetailItem label="Ngày sinh" value={subProfile?.dateOfBirth || 'Chưa cập nhật'} icon={<Calendar size={18} />} />
                            <DetailItem label="Địa chỉ thường trú" value={subProfile?.address || 'Chưa cập nhật'} icon={<MapPin size={18} />} />
                            {isStudent && (
                                <DetailItem label="Số CMND / CCCD" value={subProfile?.personalIdentificationNumber || 'Chưa cập nhật'} icon={<CreditCard size={18} />} />
                            )}
                        </div>
                    </div>

                    <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <Activity size={20} className="text-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Trạng thái bảo mật</span>
                            </div>
                            <h4 className="text-xl font-black mb-2 uppercase tracking-tight">Quyền truy cập hợp lệ</h4>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed italic">Tài khoản đã được xác minh trên hệ thống quản lý đào tạo.</p>
                        </div>
                    </div>
                </div>

                {/* Right Bento: Operational Architecture */}
                <div className="lg:col-span-7 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    <div className="academic-glass-card rounded-[2.5rem] p-10 border-emerald-100 shadow-xl space-y-10 bg-white/70 h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                            <Briefcase size={150} />
                        </div>
                        <div className="flex items-center justify-between relative z-10">
                            <h3 className="text-xs font-black text-slate-900 flex items-center gap-3 uppercase tracking-[0.2em]">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
                                    <Shield size={16} />
                                </div>
                                {isStudent ? 'Thông tin học tập' : 'Thông tin công tác'}
                            </h3>
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                                <Globe size={12} /> Đã xác minh
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
                            {isStudent ? (
                                <>
                                    <DetailItem label="Mã sinh viên" value={subProfile.studentCode} icon={<Award size={18} />} highlight />
                                    <DetailItem label="Lớp sinh hoạt" value={subProfile.className} icon={<Layout size={18} />} />
                                    <DetailItem label="Khoa chủ quản" value={subProfile.departmentName} icon={<Briefcase size={18} />} />
                                    <DetailItem label="Chuyên ngành" value={subProfile.majorName} icon={<BookOpen size={18} />} />
                                    <DetailItem label="Khóa tuyển sinh" value={subProfile.admissionYear} icon={<Calendar size={18} />} />
                                    <DetailItem label="Trạng thái học tập" value={subProfile.statusName} icon={<Activity size={18} />} />
                                </>
                            ) : isEmployee ? (
                                <>
                                    <DetailItem label="Mã nhân viên" value={subProfile.employeeCode} icon={<Award size={18} />} highlight />
                                    <DetailItem label="Đơn vị khoa / phòng" value={subProfile.departmentName} icon={<Briefcase size={18} />} />
                                    <DetailItem label="Chức vụ" value={subProfile.positionName} icon={<Shield size={18} />} />
                                    <DetailItem label="Học vị" value={subProfile.academicDegree} icon={<Award size={18} />} />
                                    <DetailItem label="Chuyên môn sâu" value={subProfile.specialization} icon={<BookOpen size={18} />} />
                                    <DetailItem label="Ngày nhận công tác" value={subProfile.hireDate} icon={<Calendar size={18} />} />
                                </>
                            ) : (
                                <div className="col-span-2 py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest italic">Yêu cầu liên kết hồ sơ thông tin</p>
                                </div>
                            )}
                        </div>

                        {isStudent && (
                            <div className="pt-10 border-t border-emerald-100/50 relative z-10">
                                <div className="flex items-center gap-6 p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-500/10 border border-emerald-50 shrink-0">
                                        <GraduationCap size={32} />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tiến trình học tập</h4>
                                        <p className="text-sm font-black text-slate-800 leading-tight">Hồ sơ hợp lệ cho các kỳ đăng ký học phần kế tiếp.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ProfileEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={profile}
                onUpdate={handleProfileUpdated}
                roles={profile?.roles || []}
            />
        </div>
    );
};

const DetailItem = ({ label, value, icon, highlight }) => (
    <div className={`flex items-start gap-4 group transition-all ${highlight ? 'scale-105 origin-left' : ''}`}>
        <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${highlight
                ? 'bg-slate-900 text-white shadow-xl rotate-3'
                : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:rotate-6'
            }`}>
            {icon}
        </div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 group-hover:text-emerald-600 transition-colors">{label}</p>
            <p className={`text-sm font-black tracking-tight ${highlight ? 'text-slate-900 text-base' : 'text-slate-700'}`}>
                {value || 'Chưa thiết lập'}
            </p>
        </div>
    </div>
);

export default ProfilePage;
