import { useState, useEffect } from 'react';
import { studentApi } from '../api/studentApi';
import {
    X, User, Mail, Phone, MapPin, Calendar,
    CreditCard, GraduationCap, School, Building,
    History, Clock, CheckCircle2, AlertCircle, BookOpen
} from 'lucide-react';

const StudentDetailModal = ({ isOpen, onClose, studentData }) => {
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        if (isOpen && studentData) {
            setLoadingHistory(true);
            studentApi.getStatusHistory(studentData.id)
                .then(res => {
                    if (res.success) setHistory(res.data);
                })
                .finally(() => setLoadingHistory(false));
        }
    }, [isOpen, studentData]);

    if (!isOpen || !studentData) return null;

    const getStatusStyles = (statusCode) => {
        if (statusCode === 'STUDYING' || statusCode === 'ACTIVE') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (statusCode === 'SUSPENDED') return 'bg-amber-100 text-amber-700 border-amber-200';
        if (statusCode === 'EXPELLED') return 'bg-rose-100 text-rose-700 border-rose-200';
        if (statusCode === 'GRADUATED') return 'bg-blue-100 text-blue-700 border-blue-200';
        return 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '---';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const InfoBlock = ({ icon: Icon, label, value, color = "blue" }) => (
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all group">
            <div className={`p-2.5 rounded-xl bg-${color}-100 text-${color}-600 group-hover:scale-110 transition-transform`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-sm font-bold text-slate-700 leading-snug">{value || '---'}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fadeIn" onClick={onClose}></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-fadeInScale flex flex-col max-h-full">

                {/* Header Section */}
                <div className="relative p-8 md:p-10 bg-gradient-to-br from-slate-900 to-indigo-950 text-white overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>

                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/80 hover:text-white z-10"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        {/* Avatar */}
                        <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl shadow-black/20">
                            <div className="w-full h-full rounded-[2.2rem] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-4xl font-black text-white">
                                {studentData.fullName.charAt(0)}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight">{studentData.fullName}</h2>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusStyles(studentData.statusCode)}`}>
                                    {studentData.statusName || studentData.statusCode}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-indigo-100/80 font-bold text-sm tracking-wide uppercase">
                                <div className="flex items-center gap-2">
                                    <CreditCard size={16} />
                                    <span>MSSV: <span className="text-white">{studentData.studentCode}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>Khóa: <span className="text-white">{studentData.admissionYear || '---'}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <School size={16} />
                                    <span>Lớp: <span className="text-white">{studentData.className || 'N/A'}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 custom-scrollbar">

                    {/* Primary Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                        {/* Column 1: Core Profile */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2 text-blue-600 font-black text-xs uppercase tracking-[0.2em]">
                                <User size={14} />
                                Hồ sơ cá nhân
                            </div>
                            <div className="grid gap-4">
                                <InfoBlock icon={Calendar} label="Ngày sinh" value={formatDate(studentData.dateOfBirth)} color="indigo" />
                                <InfoBlock icon={CreditCard} label="CMND/CCCD" value={studentData.personalIdentificationNumber} color="slate" />
                                <InfoBlock icon={MapPin} label="Thường trú" value={studentData.address} color="rose" />
                            </div>
                        </div>

                        {/* Column 2: Contact Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2 text-emerald-600 font-black text-xs uppercase tracking-[0.2em]">
                                <Mail size={14} />
                                Thông tin liên lạc
                            </div>
                            <div className="grid gap-4">
                                <InfoBlock icon={Mail} label="Email sinh viên" value={studentData.email} color="emerald" />
                                <InfoBlock icon={Phone} label="Số điện thoại" value={studentData.phone} color="blue" />
                                <InfoBlock icon={MapPin} label="Địa chỉ hiện tại" value={studentData.currentAddress} color="amber" />
                            </div>
                        </div>

                        {/* Column 3: Academic Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2 text-indigo-600 font-black text-xs uppercase tracking-[0.2em]">
                                <GraduationCap size={14} />
                                Chương trình đào tạo
                            </div>
                            <div className="grid gap-4">
                                <InfoBlock icon={BookOpen} label="Chuyên ngành" value={studentData.majorName} color="violet" />
                                <InfoBlock icon={Building} label="Khoa / Viện" value={studentData.departmentName} color="indigo" />
                                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-600 text-white rounded-xl">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <span className="text-xs font-black text-indigo-900 uppercase tracking-widest">Tiến độ</span>
                                    </div>
                                    <span className="text-sm font-black text-indigo-600">80%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status History Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-[0.2em]">
                                <History size={14} />
                                Nhật ký trạng thái học tập
                            </div>
                            {history.length > 0 && <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-tighter">{history.length} sự kiện</span>}
                        </div>

                        <div className="glass-card rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-100/50">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-[0.1em] border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Trạng thái</th>
                                        <th className="px-6 py-4">Thời gian áp dụng</th>
                                        <th className="px-6 py-4">Nội dung / Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loadingHistory ? (
                                        <tr><td colSpan="3" className="p-10 text-center animate-pulse text-slate-400 font-bold text-xs uppercase">Đang đồng bộ dữ liệu lịch sử...</td></tr>
                                    ) : history.length > 0 ? (
                                        history.map((status, index) => (
                                            <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(status.statusCode)}`}>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                                        {status.statusName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-700">{formatDate(status.startDate)}</span>
                                                        {status.endDate && <span className="text-[10px] text-slate-400 font-medium italic">đến {formatDate(status.endDate)}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-start gap-2">
                                                        <AlertCircle size={14} className="text-slate-300 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-600 leading-tight">{status.reason || 'Cập nhật hệ thống'}</p>
                                                            {status.description && <p className="text-xs text-slate-400 mt-1 italic">{status.description}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="p-16 text-center text-slate-300">
                                                <div className="flex flex-col items-center gap-2">
                                                    <History size={48} strokeWidth={1} />
                                                    <p className="font-bold text-xs uppercase tracking-widest">Không có dữ liệu lịch sử</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                        University Management System • {new Date().getFullYear()}
                    </p>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
                        >
                            Đóng hồ sơ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailModal;