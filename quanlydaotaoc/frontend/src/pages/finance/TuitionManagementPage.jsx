import { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { studentTuitionApi, paymentApi } from '../../api/tuitionApi';
import { semesterApi } from '../../api/semesterApi';
import { classApi } from '../../api/studentApi';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import {
    DollarSign, TrendingUp, AlertCircle,
    Search, Play, CreditCard, Gift, History,
    CheckCircle2, AlertTriangle, X, Award, ChevronLeft,
    ChevronRight, HelpCircle, QrCode, Banknote, Wallet,
    Smartphone, ShieldCheck, UserPlus, Trash2, CalendarDays
} from 'lucide-react';

/* ===================================================================
   HẰNG SỐ & HELPERS
   =================================================================== */
const BANK_INFO = {
    bankName: 'Vietcombank',
    accountNo: '1234567890',
    accountName: 'TRUONG DAI HOC ABC',
    bin: '970436',           // Vietcombank BIN
};

/** Tạo chuỗi VietQR content */
const buildVietQR = (amount, content) => {
    const { bin, accountNo } = BANK_INFO;
    // Format chuẩn EMVCo / VietQR quick-link
    return `https://qr.sepay.vn/img?acc=${accountNo}&bank=${bin}&amount=${amount}&des=${encodeURIComponent(content)}&template=compact`;
};

const formatVND = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

const METHOD_LABELS = { 1: 'Chuyển khoản', 2: 'Tiền mặt', 3: 'Ví điện tử' };

const STATUS_CONFIG = {
    1: { label: 'Đã hoàn thành', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2, dot: 'bg-emerald-500' },
    2: { label: 'Nộp một phần', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, dot: 'bg-amber-500', pulse: true },
    3: { label: 'Còn nợ học phí', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle, dot: 'bg-red-500', pulse: true },
    4: { label: 'Quá hạn đóng', color: 'text-rose-800', bg: 'bg-rose-100', border: 'border-rose-300', icon: AlertCircle, dot: 'bg-rose-600' },
};

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] ?? {
        label: 'Chưa xác định', color: 'text-gray-600', bg: 'bg-gray-100',
        border: 'border-gray-200', icon: HelpCircle, dot: 'bg-gray-400'
    };
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
            {cfg.pulse
                ? <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                : <Icon size={11} />
            }
            {cfg.label}
        </span>
    );
};

/* ===================================================================
   STAT CARD COMPONENT
   =================================================================== */
const StatCard = ({ icon: Icon, label, value, sub, accent }) => {
    const accents = {
        blue: 'bg-blue-50 border-blue-100 text-blue-600',
        green: 'bg-emerald-50 border-emerald-100 text-emerald-600',
        red: 'bg-red-50 border-red-100 text-red-600',
        indigo: 'bg-indigo-50 border-indigo-100 text-indigo-600',
    };
    const iconBg = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-emerald-100 text-emerald-600',
        red: 'bg-red-100 text-red-600',
        indigo: 'bg-indigo-100 text-indigo-600',
    };
    return (
        <div className={`p-5 rounded-2xl border bg-white shadow-sm flex items-start gap-4 transition-all hover:shadow-md`}>
            <div className={`p-3 rounded-xl ${iconBg[accent]}`}>
                <Icon size={22} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-xl font-bold text-gray-900 truncate">{value}</p>
                {sub && <p className={`text-xs mt-0.5 font-medium ${accents[accent].split(' ')[2]}`}>{sub}</p>}
            </div>
        </div>
    );
};

/* ===================================================================
   QR PAYMENT PANEL
   =================================================================== */
const QRPaymentPanel = ({ tuition, amount }) => {
    const content = `HP ${tuition.studentCode} ${tuition.semesterCode}`;
    const qrValue = buildVietQR(amount, content);

    return (
        <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
                <QrCode size={16} className="text-indigo-600" />
                <span className="text-sm font-bold text-indigo-700">Quét mã QR để thanh toán</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* QR Code */}
                <div className="p-3 bg-white rounded-xl border border-indigo-200 shadow-sm flex-shrink-0">
                    <QRCodeSVG
                        value={qrValue}
                        size={140}
                        bgColor="#ffffff"
                        fgColor="#1e1b4b"
                        level="M"
                        includeMargin={false}
                    />
                </div>
                {/* Bank Info */}
                <div className="flex-1 space-y-2 text-sm">
                    <p className="font-bold text-gray-800">{BANK_INFO.bankName}</p>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Số tài khoản:</span>
                            <span className="font-mono font-bold text-indigo-700">{BANK_INFO.accountNo}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Chủ tài khoản:</span>
                            <span className="font-semibold text-gray-800 text-right text-xs">{BANK_INFO.accountName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Số tiền:</span>
                            <span className="font-bold text-emerald-700">{formatVND(amount)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Nội dung CK:</span>
                            <code className="font-bold text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">{content}</code>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 italic mt-2">
                        * Nhập đúng nội dung chuyển khoản để hệ thống xử lý tự động
                    </p>
                </div>
            </div>
        </div>
    );
};

/* ===================================================================
   MAIN PAGE COMPONENT
   =================================================================== */
const TuitionManagementPage = () => {
    const { user } = useAuthStore();
    const isStudent = user?.roles?.includes('SINHVIEN');
    const isAdminOrGiaovu = user?.roles?.includes('ADMIN') || user?.roles?.includes('GIAOVU');

    const [semesters, setSemesters] = useState([]);
    const [classes, setClasses] = useState([]);
    const [filters, setFilters] = useState({
        semesterId: '',
        classId: '',
        status: '',
        keyword: isStudent ? user?.username : '',
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        sortDir: 'desc'
    });

    const [loading, setLoading] = useState(false);
    const [tuitions, setTuitions] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [stats, setStats] = useState({ totalReceivables: 0, totalPaid: 0, totalDebt: 0, completionRate: 0 });

    const [activeModal, setActiveModal] = useState(null);
    const [selectedTuition, setSelectedTuition] = useState(null);
    const [historyLogs, setHistoryLogs] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const [paymentForm, setPaymentForm] = useState({
        amountPaid: '',
        paymentMethod: '1',
        transactionRef: '',
        notes: ''
    });

    const [adjustForm, setAdjustForm] = useState({
        scholarshipDeduction: '',
        exemptionAmount: ''
    });

    const [manualForm, setManualForm] = useState({
        studentCode: '',
        totalCredits: '',
        rawAmount: '',
        scholarshipDeduction: '',
        exemptionAmount: '',
        paidAmount: '',
        deadline: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
        notes: ''
    });

    /* --- Load metadata --- */
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [semRes, clsRes] = await Promise.all([
                    semesterApi.getAllSemesters(),
                    classApi.getAll()
                ]);
                if (semRes.success) {
                    setSemesters(semRes.data);
                    const activeSem = semRes.data.find(s => s.isActive) || semRes.data[0];
                    if (activeSem) setFilters(p => ({ ...p, semesterId: activeSem.id }));
                }
                if (clsRes.success) setClasses(clsRes.data);
            } catch (e) { console.error(e); }
        };
        fetchMetadata();
    }, []);

    /* --- Load tuition list --- */
    const fetchTuitionList = useCallback(async () => {
        setLoading(true);
        try {
            const res = await studentTuitionApi.getAll(filters);
            if (res.success) {
                const list = res.data.content || [];
                setTuitions(list);
                setTotalPages(res.data.totalPages);
                setTotalElements(res.data.totalElements);
                let totalNet = 0, totalPaidAmt = 0, totalDebtAmt = 0;
                list.forEach(t => {
                    totalNet += t.netAmount || 0;
                    totalPaidAmt += t.paidAmount || 0;
                    totalDebtAmt += t.debtAmount || 0;
                });
                setStats({
                    totalReceivables: totalNet,
                    totalPaid: totalPaidAmt,
                    totalDebt: totalDebtAmt,
                    completionRate: totalNet > 0 ? Math.round((totalPaidAmt / totalNet) * 100) : 100
                });
            }
        } catch (e) {
            toast.error('Không thể tải thông tin học phí.');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        if (filters.semesterId) fetchTuitionList();
    }, [filters.semesterId, filters.classId, filters.status, filters.page, filters.size, fetchTuitionList]);

    /* --- Calculate All --- */
    const handleCalculateAll = async () => {
        if (!filters.semesterId) { toast.error('Vui lòng chọn học kỳ'); return; }
        const sem = semesters.find(s => s.id === filters.semesterId);
        if (!window.confirm(`Tính học phí hàng loạt cho học kỳ "${sem?.semesterName}"?`)) return;
        const id = toast.loading('Đang tính toán học phí hàng loạt...');
        try {
            const res = await studentTuitionApi.calculateAll(filters.semesterId);
            if (res.success) { toast.success('Tính toán hoàn tất!', { id }); fetchTuitionList(); }
            else toast.error(res.message, { id });
        } catch { toast.error('Có lỗi xảy ra khi tính học phí.', { id }); }
    };

    /* --- Manual Tuition Modal --- */
    const openManualModal = () => {
        setManualForm({
            studentCode: '',
            totalCredits: '',
            rawAmount: '',
            scholarshipDeduction: '0',
            exemptionAmount: '0',
            paidAmount: '0',
            deadline: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
            notes: ''
        });
        setActiveModal('manual');
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        if (!manualForm.studentCode.trim()) { toast.error('Vui lòng nhập mã sinh viên'); return; }
        if (!filters.semesterId) { toast.error('Vui lòng chọn học kỳ trước'); return; }
        const id = toast.loading('Đang tạo hồ sơ học phí...');
        try {
            const payload = {
                studentCode: manualForm.studentCode.trim().toUpperCase(),
                semesterId: filters.semesterId,
                totalCredits: manualForm.totalCredits ? parseInt(manualForm.totalCredits) : 0,
                rawAmount: manualForm.rawAmount ? parseFloat(manualForm.rawAmount) : null,
                scholarshipDeduction: parseFloat(manualForm.scholarshipDeduction || '0'),
                exemptionAmount: parseFloat(manualForm.exemptionAmount || '0'),
                paidAmount: parseFloat(manualForm.paidAmount || '0'),
                deadline: manualForm.deadline || null,
                notes: manualForm.notes
            };
            const res = await studentTuitionApi.createManual(payload);
            if (res.success) {
                toast.success(`Tạo hồ sơ học phí cho ${manualForm.studentCode} thành công!`, { id });
                setActiveModal(null);
                fetchTuitionList();
            } else toast.error(res.message || 'Có lỗi xảy ra', { id });
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Lỗi khi tạo hồ sơ học phí.', { id });
        }
    };

    /* --- Delete Tuition --- */
    const handleDeleteTuition = async (tuition) => {
        if (!window.confirm(`Xóa hồ sơ học phí của "${tuition.studentName}" (${tuition.studentCode})?\nHành động này không thể hoàn tác!`)) return;
        const id = toast.loading('Đang xóa hồ sơ học phí...');
        try {
            const res = await studentTuitionApi.delete(tuition.id);
            if (res.success) { toast.success('Đã xóa hồ sơ học phí!', { id }); fetchTuitionList(); }
            else toast.error(res.message, { id });
        } catch { toast.error('Lỗi khi xóa hồ sơ học phí.', { id }); }
    };

    /* --- Payment Modal --- */
    const openPaymentModal = (tuition) => {
        setSelectedTuition(tuition);
        setPaymentForm({
            amountPaid: String(tuition.debtAmount),
            paymentMethod: '1',
            transactionRef: '',
            notes: `Nộp học phí ${tuition.semesterName}`
        });
        setShowQR(false);
        setActiveModal('payment');
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        const amount = parseFloat(paymentForm.amountPaid);
        if (!amount || amount <= 0) { toast.error('Vui lòng nhập số tiền hợp lệ'); return; }
        const id = toast.loading('Đang ghi nhận thanh toán...');
        try {
            const res = await paymentApi.create({
                tuitionId: selectedTuition.id,
                amountPaid: amount,
                paymentMethod: parseInt(paymentForm.paymentMethod),
                transactionRef: paymentForm.transactionRef,
                notes: paymentForm.notes
            });
            if (res.success) {
                toast.success('Thanh toán thành công!', { id });
                setActiveModal(null);
                fetchTuitionList();
            } else toast.error(res.message, { id });
        } catch { toast.error('Lỗi khi ghi nhận thanh toán.', { id }); }
    };

    /* --- Adjust Modal --- */
    const openAdjustModal = (tuition) => {
        setSelectedTuition(tuition);
        setAdjustForm({
            scholarshipDeduction: String(tuition.scholarshipDeduction),
            exemptionAmount: String(tuition.exemptionAmount)
        });
        setActiveModal('adjust');
    };

    const handleAdjustSubmit = async (e) => {
        e.preventDefault();
        const id = toast.loading('Đang lưu điều chỉnh...');
        try {
            const res = await studentTuitionApi.adjust(selectedTuition.id, {
                scholarshipDeduction: parseFloat(adjustForm.scholarshipDeduction || '0'),
                exemptionAmount: parseFloat(adjustForm.exemptionAmount || '0')
            });
            if (res.success) { toast.success('Điều chỉnh học phí thành công!', { id }); setActiveModal(null); fetchTuitionList(); }
            else toast.error(res.message, { id });
        } catch { toast.error('Lỗi khi điều chỉnh học phí.', { id }); }
    };

    /* --- History Modal --- */
    const openHistoryModal = async (tuition) => {
        setSelectedTuition(tuition);
        setActiveModal('history');
        setHistoryLoading(true);
        try {
            const res = await paymentApi.getByTuitionId(tuition.id);
            if (res.success) setHistoryLogs(res.data);
        } catch { toast.error('Không thể tải lịch sử giao dịch.'); }
        finally { setHistoryLoading(false); }
    };

    /* ----------------------------------------------------------------
       RENDER
    ---------------------------------------------------------------- */
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">

                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                            <DollarSign className="text-indigo-600" size={28} />
                            Quản lý Học phí Sinh viên
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Tính toán, theo dõi công nợ và ghi nhận thanh toán học phí theo học kỳ.
                        </p>
                    </div>
                    {isAdminOrGiaovu && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCalculateAll}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow transition-all active:scale-95"
                            >
                                <Play size={15} fill="white" />
                                Tính học phí kỳ này
                            </button>
                            <button
                                onClick={openManualModal}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold shadow border border-gray-300 transition-all active:scale-95"
                            >
                                <UserPlus size={15} className="text-indigo-600" />
                                Thêm sinh viên nợ
                            </button>
                        </div>
                    )}
                </div>

                {/* ── STAT CARDS ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={DollarSign} label="Học phí phải thu" value={formatVND(stats.totalReceivables)} sub="Tổng kỳ hiện tại" accent="blue" />
                    <StatCard icon={CheckCircle2} label="Đã thanh toán" value={formatVND(stats.totalPaid)} sub="Đã ghi nhận" accent="green" />
                    <StatCard icon={AlertCircle} label="Còn dư nợ" value={formatVND(stats.totalDebt)} sub="Cần đôn đốc" accent="red" />
                    <StatCard
                        icon={TrendingUp}
                        label="Tỷ lệ hoàn thành"
                        value={`${stats.completionRate}%`}
                        sub={
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700"
                                    style={{ width: `${stats.completionRate}%` }}
                                />
                            </div>
                        }
                        accent="indigo"
                    />
                </div>

                {/* ── FILTERS ── */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-4 items-end">
                    <div className="min-w-[180px]">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Học kỳ</label>
                        <select
                            value={filters.semesterId}
                            onChange={e => setFilters(p => ({ ...p, semesterId: e.target.value, page: 0 }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                        >
                            {semesters.map(s => <option key={s.id} value={s.id}>{s.semesterName}</option>)}
                        </select>
                    </div>

                    {isAdminOrGiaovu && (
                        <div className="min-w-[180px]">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Lớp hành chính</label>
                            <select
                                value={filters.classId}
                                onChange={e => setFilters(p => ({ ...p, classId: e.target.value, page: 0 }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                            >
                                <option value="">Tất cả các lớp</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.className}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="min-w-[180px]">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Trạng thái</label>
                        <select
                            value={filters.status}
                            onChange={e => setFilters(p => ({ ...p, status: e.target.value, page: 0 }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                        >
                            <option value="">Tất cả</option>
                            <option value="1">✅ Đã hoàn thành</option>
                            <option value="2">🟡 Nộp một phần</option>
                            <option value="3">🔴 Còn nợ học phí</option>
                            <option value="4">⚠️ Quá hạn đóng</option>
                        </select>
                    </div>

                    {!isStudent && (
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Tìm kiếm</label>
                            <div className="relative">
                                <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tên hoặc mã sinh viên..."
                                    value={filters.keyword}
                                    onChange={e => setFilters(p => ({ ...p, keyword: e.target.value, page: 0 }))}
                                    className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── TABLE ── */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="px-5 py-3.5 text-left">Sinh viên</th>
                                    <th className="px-5 py-3.5 text-left">Lớp</th>
                                    <th className="px-5 py-3.5 text-center">TC</th>
                                    <th className="px-5 py-3.5 text-right">Học phí gốc</th>
                                    <th className="px-5 py-3.5 text-right">Giảm trừ</th>
                                    <th className="px-5 py-3.5 text-right">Phải nộp</th>
                                    <th className="px-5 py-3.5 text-right">Đã nộp</th>
                                    <th className="px-5 py-3.5 text-right text-red-600">Còn nợ</th>
                                    <th className="px-5 py-3.5 text-center">Trạng thái</th>
                                    <th className="px-5 py-3.5 text-center">Hạn nộp</th>
                                    <th className="px-5 py-3.5 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="11" className="py-16 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                                Đang tải dữ liệu...
                                            </div>
                                        </td>
                                    </tr>
                                ) : tuitions.length === 0 ? (
                                    <tr>
                                        <td colSpan="11" className="py-16 text-center text-gray-400 italic">
                                            Không có dữ liệu học phí cho học kỳ này.
                                        </td>
                                    </tr>
                                ) : tuitions.map(t => (
                                    <tr key={t.id} className="hover:bg-indigo-50/40 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-gray-900">{t.studentName}</div>
                                            <div className="text-xs text-indigo-600 font-mono font-bold mt-0.5">{t.studentCode}</div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 font-medium">{t.className}</td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 font-bold rounded-md text-xs">{t.totalCredits}</span>
                                        </td>
                                        <td className="px-5 py-4 text-right text-gray-700 font-medium">{formatVND(t.rawAmount)}</td>
                                        <td className="px-5 py-4 text-right">
                                            {(t.scholarshipDeduction > 0 || t.exemptionAmount > 0) ? (
                                                <div className="text-emerald-700 text-xs space-y-0.5">
                                                    {t.scholarshipDeduction > 0 && <div>HB: -{formatVND(t.scholarshipDeduction)}</div>}
                                                    {t.exemptionAmount > 0 && <div>MG: -{formatVND(t.exemptionAmount)}</div>}
                                                </div>
                                            ) : <span className="text-gray-400">—</span>}
                                        </td>
                                        <td className="px-5 py-4 text-right font-bold text-gray-900">{formatVND(t.netAmount)}</td>
                                        <td className="px-5 py-4 text-right text-emerald-700 font-semibold">{formatVND(t.paidAmount)}</td>
                                        <td className="px-5 py-4 text-right">
                                            <span className={`font-bold text-sm ${t.debtAmount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                                {t.debtAmount > 0 ? formatVND(t.debtAmount) : '—'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center"><StatusBadge status={t.status} /></td>
                                        <td className="px-5 py-4 text-center text-xs text-gray-500 font-medium">
                                            {t.deadline ? new Date(t.deadline).toLocaleDateString('vi-VN') : '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-center gap-1.5">
                                                {isAdminOrGiaovu && t.debtAmount > 0 && (
                                                    <button
                                                        onClick={() => openPaymentModal(t)}
                                                        title="Ghi nhận thanh toán"
                                                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors border border-indigo-100"
                                                    >
                                                        <CreditCard size={15} />
                                                    </button>
                                                )}
                                                {isAdminOrGiaovu && (
                                                    <button
                                                        onClick={() => openAdjustModal(t)}
                                                        title="Điều chỉnh miễn giảm / học bổng"
                                                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors border border-emerald-100"
                                                    >
                                                        <Gift size={15} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openHistoryModal(t)}
                                                    title="Xem lịch sử giao dịch"
                                                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200"
                                                >
                                                    <History size={15} />
                                                </button>
                                                {isAdminOrGiaovu && (
                                                    <button
                                                        onClick={() => handleDeleteTuition(t)}
                                                        title="Xóa hồ sơ học phí"
                                                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors border border-red-100"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {(totalPages > 1 || totalElements > 0) && (
                        <div className="px-5 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                Hiển thị {filters.page * filters.size + 1}–{Math.min((filters.page + 1) * filters.size, totalElements)} / {totalElements} bản ghi
                            </span>
                            <div className="flex items-center gap-1.5">
                                <button
                                    disabled={filters.page === 0}
                                    onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
                                    className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-sm font-semibold text-gray-700 px-2">
                                    {filters.page + 1} / {totalPages || 1}
                                </span>
                                <button
                                    disabled={filters.page >= totalPages - 1}
                                    onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
                                    className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                MODAL: PAYMENT
            ══════════════════════════════════════════════════════════ */}
            {activeModal === 'payment' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 bg-indigo-600 flex items-center justify-between">
                            <div className="flex items-center gap-2.5 text-white">
                                <CreditCard size={20} />
                                <div>
                                    <h3 className="font-bold text-base leading-tight">Ghi nhận đóng học phí</h3>
                                    <p className="text-indigo-200 text-xs mt-0.5">{selectedTuition?.studentName} • {selectedTuition?.studentCode}</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-indigo-700 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 max-h-[80vh] overflow-y-auto">
                            {/* Debt Summary */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-100 mb-5">
                                <span className="text-sm text-red-700 font-semibold">Dư nợ học phí kỳ này:</span>
                                <span className="text-lg font-bold text-red-700">{formatVND(selectedTuition?.debtAmount)}</span>
                            </div>

                            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                {/* Amount */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số tiền đóng (VNĐ)</label>
                                    <input
                                        type="number"
                                        required
                                        min={1}
                                        value={paymentForm.amountPaid}
                                        onChange={e => { setPaymentForm(p => ({ ...p, amountPaid: e.target.value })); setShowQR(false); }}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-bold text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        placeholder="Ví dụ: 5000000"
                                    />
                                </div>

                                {/* Payment method */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hình thức thanh toán</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: '1', label: 'Chuyển khoản', icon: Banknote },
                                            { value: '2', label: 'Tiền mặt', icon: Wallet },
                                            { value: '3', label: 'Ví điện tử', icon: Smartphone },
                                        ].map(({ value, label, icon: Icon }) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => { setPaymentForm(p => ({ ...p, paymentMethod: value })); setShowQR(false); }}
                                                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                                                    paymentForm.paymentMethod === value
                                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                }`}
                                            >
                                                <Icon size={18} />
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* QR for bank transfer */}
                                {paymentForm.paymentMethod === '1' && (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => setShowQR(v => !v)}
                                            className="w-full flex items-center justify-center gap-2 py-2 border border-indigo-200 rounded-xl text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
                                        >
                                            <QrCode size={16} />
                                            {showQR ? 'Ẩn mã QR' : 'Xem mã QR thanh toán'}
                                        </button>
                                        {showQR && parseFloat(paymentForm.amountPaid) > 0 && (
                                            <QRPaymentPanel
                                                tuition={selectedTuition}
                                                amount={parseFloat(paymentForm.amountPaid)}
                                            />
                                        )}
                                    </div>
                                )}

                                {/* Transaction ref */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mã giao dịch / Số phiếu</label>
                                    <input
                                        type="text"
                                        value={paymentForm.transactionRef}
                                        onChange={e => setPaymentForm(p => ({ ...p, transactionRef: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono placeholder:font-sans placeholder:text-gray-400"
                                        placeholder="VCB2024101500123456 hoặc bỏ trống"
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ghi chú</label>
                                    <textarea
                                        value={paymentForm.notes}
                                        onChange={e => setPaymentForm(p => ({ ...p, notes: e.target.value }))}
                                        rows={2}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400 resize-none"
                                        placeholder="Nội dung ghi chú..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setActiveModal(null)}
                                        className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
                                        Hủy bỏ
                                    </button>
                                    <button type="submit"
                                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all active:scale-95">
                                        Xác nhận giao dịch
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                MODAL: ADJUST
            ══════════════════════════════════════════════════════════ */}
            {activeModal === 'adjust' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 bg-emerald-600 flex items-center justify-between">
                            <div className="flex items-center gap-2.5 text-white">
                                <Gift size={20} />
                                <div>
                                    <h3 className="font-bold text-base leading-tight">Miễn giảm học phí & Học bổng</h3>
                                    <p className="text-emerald-200 text-xs mt-0.5">{selectedTuition?.studentName} • {selectedTuition?.studentCode}</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-700 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6">
                            {/* Summary box */}
                            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 mb-5 text-sm space-y-1">
                                <div className="flex justify-between"><span className="text-gray-500">Học phí gốc:</span><span className="font-semibold text-gray-800">{formatVND(selectedTuition?.rawAmount)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Đã nộp:</span><span className="font-semibold text-emerald-700">{formatVND(selectedTuition?.paidAmount)}</span></div>
                            </div>

                            <form onSubmit={handleAdjustSubmit} className="space-y-4">
                                <div>
                                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                                        <Award size={14} className="text-amber-500" /> Học bổng (VNĐ)
                                    </label>
                                    <input
                                        type="number" min={0}
                                        value={adjustForm.scholarshipDeduction}
                                        onChange={e => setAdjustForm(p => ({ ...p, scholarshipDeduction: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Miễn giảm chính sách (VNĐ)</label>
                                    <input
                                        type="number" min={0}
                                        value={adjustForm.exemptionAmount}
                                        onChange={e => setAdjustForm(p => ({ ...p, exemptionAmount: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setActiveModal(null)}
                                        className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
                                        Hủy bỏ
                                    </button>
                                    <button type="submit"
                                        className="flex-1 py--2.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all active:scale-95">
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                MODAL: HISTORY
            ══════════════════════════════════════════════════════════ */}
            {activeModal === 'history' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5 text-white">
                                <History size={20} />
                                <div>
                                    <h3 className="font-bold text-base leading-tight">Lịch sử thanh toán</h3>
                                    <p className="text-gray-400 text-xs mt-0.5">{selectedTuition?.studentName} • {selectedTuition?.semesterName}</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Tổng kết học phí */}
                        <div className="px-6 pt-4 pb-2 grid grid-cols-3 gap-3 border-b border-gray-100">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-0.5">Phải nộp</p>
                                <p className="font-bold text-gray-900 text-sm">{formatVND(selectedTuition?.netAmount)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-0.5">Đã nộp</p>
                                <p className="font-bold text-emerald-700 text-sm">{formatVND(selectedTuition?.paidAmount)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-0.5">Còn nợ</p>
                                <p className={`font-bold text-sm ${selectedTuition?.debtAmount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                    {formatVND(selectedTuition?.debtAmount)}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 max-h-[55vh] overflow-y-auto">
                            {historyLoading ? (
                                <div className="py-12 text-center text-gray-400">Đang tải lịch sử...</div>
                            ) : historyLogs.length === 0 ? (
                                <div className="py-12 text-center text-gray-400 italic">Chưa có giao dịch nào được ghi nhận.</div>
                            ) : (
                                <div className="space-y-3">
                                    {historyLogs.map(log => (
                                        <div key={log.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0">
                                                <ShieldCheck size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                                    <span className="text-base font-bold text-emerald-700">{formatVND(log.amountPaid)}</span>
                                                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full uppercase">Thành công</span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                                                    <div>Hình thức: <span className="font-semibold text-gray-700">{METHOD_LABELS[log.paymentMethod] || 'Khác'}</span></div>
                                                    {log.transactionRef && (
                                                        <div>Mã GD: <code className="font-bold font-mono text-indigo-700">{log.transactionRef}</code></div>
                                                    )}
                                                    {log.notes && <div className="italic text-gray-400 truncate">{log.notes}</div>}
                                                    <div className="text-gray-400">{new Date(log.paymentDate).toLocaleString('vi-VN')}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setActiveModal(null)}
                                className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold transition-colors">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ══════════════════════════════════════════════════════════
                MODAL: THÊM SINH VIÊN NỢ THỦ CÔNG
            ══════════════════════════════════════════════════════════ */}
            {activeModal === 'manual' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
                            <div className="flex items-center gap-2.5 text-white">
                                <UserPlus size={20} />
                                <div>
                                    <h3 className="font-bold text-base leading-tight">Thêm hồ sơ nợ học phí thủ công</h3>
                                    <p className="text-indigo-200 text-xs mt-0.5">
                                        Học kỳ: <span className="font-bold">{semesters.find(s => s.id === filters.semesterId)?.semesterName || '—'}</span>
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-indigo-700 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 max-h-[80vh] overflow-y-auto">
                            {/* Info box */}
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 mb-5">
                                <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800">
                                    Chức năng này dùng để tạo thủ công hồ sơ học phí cho sinh viên chưa có đăng ký học phần, hoặc cần ghi nhận nợ đặc biệt. Hệ thống sẽ tự áp dụng định mức theo ngành và khóa của sinh viên.
                                </p>
                            </div>

                            <form onSubmit={handleManualSubmit} className="space-y-4">
                                {/* Student Code */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Mã sinh viên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={manualForm.studentCode}
                                        onChange={e => setManualForm(p => ({ ...p, studentCode: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:font-sans placeholder:normal-case placeholder:font-normal"
                                        placeholder="Ví dụ: SV20200001"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Nhập mã sinh viên (tự động chuyển in hoa). Có thể dùng các mã: SV20200001, SV20210002, ...</p>
                                </div>

                                {/* Credits & Raw Amount */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số tín chỉ đăng ký</label>
                                        <input
                                            type="number" min={0} max={30}
                                            value={manualForm.totalCredits}
                                            onChange={e => setManualForm(p => ({ ...p, totalCredits: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            placeholder="VD: 15"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Học phí gốc (VNĐ)</label>
                                        <input
                                            type="number" min={0}
                                            value={manualForm.rawAmount}
                                            onChange={e => setManualForm(p => ({ ...p, rawAmount: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            placeholder="Tự tính nếu bỏ trống"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 -mt-2">Nếu bỏ trống "Học phí gốc", hệ thống tự tính: đơn giá/TC × số TC + phí cơ sở.</p>

                                {/* Deductions */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-1.5">
                                            <Award size={13} className="text-amber-500" /> Học bổng (VNĐ)
                                        </label>
                                        <input
                                            type="number" min={0}
                                            value={manualForm.scholarshipDeduction}
                                            onChange={e => setManualForm(p => ({ ...p, scholarshipDeduction: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Miễn giảm chính sách (VNĐ)</label>
                                        <input
                                            type="number" min={0}
                                            value={manualForm.exemptionAmount}
                                            onChange={e => setManualForm(p => ({ ...p, exemptionAmount: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                {/* Already paid & Deadline */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Đã nộp trước đó (VNĐ)</label>
                                        <input
                                            type="number" min={0}
                                            value={manualForm.paidAmount}
                                            onChange={e => setManualForm(p => ({ ...p, paidAmount: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-1.5">
                                            <CalendarDays size={13} className="text-indigo-500" /> Hạn nộp
                                        </label>
                                        <input
                                            type="date"
                                            value={manualForm.deadline}
                                            onChange={e => setManualForm(p => ({ ...p, deadline: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setActiveModal(null)}
                                        className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
                                        Hủy bỏ
                                    </button>
                                    <button type="submit"
                                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all active:scale-95">
                                        Tạo hồ sơ học phí
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TuitionManagementPage;
