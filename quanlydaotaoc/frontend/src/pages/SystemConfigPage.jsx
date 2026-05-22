import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import systemConfigApi from '../api/systemConfigApi';
import { semesterApi } from '../api/semesterApi';
import {
    Settings, ShieldAlert, Save, RefreshCw, Loader2,
    Globe, GraduationCap, DollarSign, Mail, Phone,
    AlertTriangle, ShieldCheck, HelpCircle, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

const SystemConfigPage = () => {
    const { user } = useAuthStore();
    const [configs, setConfigs] = useState({
        SYSTEM_NAME: '',
        CONTACT_EMAIL: '',
        CONTACT_PHONE: '',
        MIN_CREDITS: '12',
        MAX_CREDITS: '25',
        TUITION_PER_CREDIT: '450000',
        ALLOW_REGISTRATION: 'false',
        MAINTENANCE_MODE: 'false',
        CURRENT_SEMESTER_ID: ''
    });
    
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    const isAdmin = user?.roles?.includes('ADMIN');

    useEffect(() => {
        if (isAdmin) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [isAdmin]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch system configurations
            const configRes = await systemConfigApi.getConfigs();
            if (configRes.success && configRes.data) {
                const configMap = {};
                configRes.data.forEach(item => {
                    configMap[item.configKey] = item.configValue;
                });
                
                setConfigs(prev => ({
                    ...prev,
                    ...configMap
                }));
            }

            // Fetch semesters for selection
            const semesterRes = await semesterApi.getAllSemesters();
            if (semesterRes.success && semesterRes.data) {
                setSemesters(semesterRes.data);
            }
        } catch (error) {
            console.error("Error loading system configuration matrix:", error);
            toast.error("Protocol Error: Configuration matrix synchronization failed");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (key, value) => {
        setConfigs(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const loadingToast = toast.loading("Formalizing configuration adjustments...");
        
        try {
            const payload = Object.keys(configs).map(key => ({
                configKey: key,
                configValue: String(configs[key])
            }));

            const res = await systemConfigApi.saveConfigs(payload);
            if (res.success) {
                toast.success("System configurations formalized successfully", { id: loadingToast });
                // Re-sync
                fetchData();
            } else {
                toast.error("Adjustments rejected by validation authority", { id: loadingToast });
            }
        } catch (error) {
            console.error("Failed to commit configurations:", error);
            toast.error("Commit Protocol Failure: Connection reset", { id: loadingToast });
        } finally {
            setSaving(false);
        }
    };

    // 403 Access Denied Fallback Interface
    if (!isAdmin) {
        return (
            <div className="w-full max-w-xl mx-auto py-16 px-4 animate-slideUp">
                <div className="academic-glass-card rounded-[3.5rem] p-12 text-center border-rose-100 shadow-2xl relative overflow-hidden bg-white/70">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -ml-16 -mb-16"></div>
                    
                    <div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500 mx-auto mb-8 border border-rose-100 shadow-lg shadow-rose-200/30 group animate-pulse">
                        <ShieldAlert size={40} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    
                    <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-rose-100 shadow-sm inline-block mb-4">
                        Access Protocol Violated
                    </span>
                    
                    <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter uppercase leading-none">Security Exclusion 403</h3>
                    <p className="text-slate-500 text-xs font-bold leading-relaxed mb-10 max-w-sm mx-auto tracking-normal">
                        Your administrative authorization tier is insufficient to view or manipulate the Core System Configuration Matrix. Please contact the grid commander for operational clearance.
                    </p>
                    
                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-3.5 bg-slate-900 hover:bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95 duration-300"
                    >
                        Return to Safe Sector
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 size={40} className="animate-spin text-emerald-500" />
                <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Synchronizing Core Config Matrix...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-slideUp">
            {/* Header Section: Hero Grid Banner */}
            <div className="academic-glass-card rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-emerald-100/50 shadow-2xl relative overflow-hidden bg-white/70">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl -ml-24 -mb-24"></div>

                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                        <Settings size={28} className="animate-spin-slow" style={{ animationDuration: '8s' }} />
                    </div>
                    <div>
                        <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100 shadow-sm inline-block mb-2">
                            Grid Operations Hub
                        </span>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">System Config</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mt-1.5 flex items-center gap-1.5">
                            <ShieldCheck size={12} className="text-emerald-500" /> Operational Control Terminal
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10 shrink-0">
                    <button
                        onClick={fetchData}
                        className="p-4 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl transition-all group bg-white shadow-sm"
                        title="Re-sync configurations"
                    >
                        <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-emerald-600 text-white text-[10px] font-black rounded-2xl transition-all shadow-xl shadow-slate-900/20 hover:shadow-emerald-500/25 active:scale-95 uppercase tracking-[0.2em] disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={14} className="animate-spin" /> Committing...
                            </>
                        ) : (
                            <>
                                <Save size={14} /> Commit Configs
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Config Board: Tabs & Fields layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                {/* Left side: Tab navigation */}
                <div className="lg:col-span-3 space-y-4 w-full">
                    <div className="academic-glass-card rounded-[2.2rem] p-4 border-slate-100 shadow-xl space-y-1 bg-white/60">
                        <TabButton 
                            active={activeTab === 'general'} 
                            onClick={() => setActiveTab('general')}
                            label="Core Systems"
                            description="Tên, liên hệ, bảo trì"
                            icon={<Globe size={18} />}
                        />
                        <TabButton 
                            active={activeTab === 'academic'} 
                            onClick={() => setActiveTab('academic')}
                            label="Academic Grid"
                            description="Học kỳ, tín chỉ, đăng ký"
                            icon={<GraduationCap size={18} />}
                        />
                        <TabButton 
                            active={activeTab === 'financial'} 
                            onClick={() => setActiveTab('financial')}
                            label="Financial Rates"
                            description="Học phí tín chỉ, tỷ giá"
                            icon={<DollarSign size={18} />}
                        />
                    </div>

                    <div className="p-6 bg-slate-900 rounded-[2.2rem] text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10 space-y-3">
                            <div className="flex items-center gap-2">
                                <Activity size={16} className="text-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">Live Grid Stats</span>
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-tight leading-none">Security Zone</h4>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                Any adjustments to this configuration block will impact all staging environments instantly. Care is advised.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right side: Field group container */}
                <div className="lg:col-span-9 w-full">
                    <form onSubmit={handleSave} className="academic-glass-card rounded-[2.5rem] p-10 border-emerald-100 shadow-xl bg-white/70 relative overflow-hidden space-y-8">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                            <Settings size={180} />
                        </div>

                        {/* Active Tab Panel */}
                        {activeTab === 'general' && (
                            <div className="space-y-8 animate-slideUp">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-3 uppercase tracking-[0.2em] mb-1">
                                        Core Systems Matrix
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Thiết lập tổng quan về định danh và thông tin hỗ trợ của hệ thống</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="SYSTEM_NAME — Tên hiển thị hệ thống"
                                        description="Tên thương hiệu xuất hiện trên tiêu đề, layout, email và tài liệu chính thức"
                                        value={configs.SYSTEM_NAME}
                                        onChange={(val) => handleInputChange('SYSTEM_NAME', val)}
                                        icon={<Globe size={16} />}
                                        placeholder="STD MANAGER"
                                    />
                                    <InputField
                                        label="CONTACT_EMAIL — Email hỗ trợ kỹ thuật"
                                        description="Địa chỉ tiếp nhận thông tin lỗi hệ thống và xử lý thắc mắc"
                                        value={configs.CONTACT_EMAIL}
                                        onChange={(val) => handleInputChange('CONTACT_EMAIL', val)}
                                        icon={<Mail size={16} />}
                                        placeholder="admin@stdmanager.edu.vn"
                                    />
                                    <InputField
                                        label="CONTACT_PHONE — Hotline liên lạc khẩn cấp"
                                        description="Số điện thoại tổng đài giải quyết sự cố đăng ký hoặc học phí"
                                        value={configs.CONTACT_PHONE}
                                        onChange={(val) => handleInputChange('CONTACT_PHONE', val)}
                                        icon={<Phone size={16} />}
                                        placeholder="024.1234.5678"
                                    />

                                    <ToggleField
                                        label="MAINTENANCE_MODE — Kích hoạt bảo trì hệ thống"
                                        description="Chặn quyền truy cập của sinh viên & giảng viên, chỉ giữ lại quyền của Quản trị viên tối cao"
                                        checked={configs.MAINTENANCE_MODE === 'true'}
                                        onChange={(val) => handleInputChange('MAINTENANCE_MODE', val ? 'true' : 'false')}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'academic' && (
                            <div className="space-y-8 animate-slideUp">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-3 uppercase tracking-[0.2em] mb-1">
                                        Academic Program Grid
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Thiết lập học vụ, học kỳ hiện hành và luật đăng ký môn học</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SelectField
                                        label="CURRENT_SEMESTER_ID — Học kỳ hoạt động"
                                        description="Lựa chọn học kỳ hiện hành để tự động thiết lập thời khóa biểu và đăng ký"
                                        value={configs.CURRENT_SEMESTER_ID}
                                        onChange={(val) => handleInputChange('CURRENT_SEMESTER_ID', val)}
                                        icon={<GraduationCap size={16} />}
                                        options={semesters.map(sem => ({
                                            value: sem.id,
                                            label: `${sem.semesterName} (${sem.academicYear})`
                                        }))}
                                    />

                                    <InputField
                                        label="MIN_CREDITS — Số tín chỉ tối thiểu"
                                        description="Quy định số lượng tín chỉ ít nhất sinh viên phải đăng ký trong một học kỳ thường"
                                        type="number"
                                        value={configs.MIN_CREDITS}
                                        onChange={(val) => handleInputChange('MIN_CREDITS', val)}
                                        icon={<HelpCircle size={16} />}
                                        placeholder="12"
                                    />

                                    <InputField
                                        label="MAX_CREDITS — Số tín chỉ tối đa"
                                        description="Quy định số lượng tín chỉ nhiều nhất cho phép đăng ký trong một học kỳ thường"
                                        type="number"
                                        value={configs.MAX_CREDITS}
                                        onChange={(val) => handleInputChange('MAX_CREDITS', val)}
                                        icon={<HelpCircle size={16} />}
                                        placeholder="25"
                                    />

                                    <ToggleField
                                        label="ALLOW_REGISTRATION — Mở cổng đăng ký học phần"
                                        description="Kích hoạt cơ chế đăng ký trực tuyến cho phép sinh viên chọn lớp học phần"
                                        checked={configs.ALLOW_REGISTRATION === 'true'}
                                        onChange={(val) => handleInputChange('ALLOW_REGISTRATION', val ? 'true' : 'false')}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'financial' && (
                            <div className="space-y-8 animate-slideUp">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-3 uppercase tracking-[0.2em] mb-1">
                                        Financial Rates Matrix
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Thiết lập đơn giá học phí trên đơn vị tín chỉ</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="TUITION_PER_CREDIT — Học phí/Tín chỉ (VND)"
                                        description="Mức học phí cơ sở áp dụng để tính toán hóa đơn học phí cho sinh viên dựa trên tín chỉ đăng ký"
                                        type="number"
                                        value={configs.TUITION_PER_CREDIT}
                                        onChange={(val) => handleInputChange('TUITION_PER_CREDIT', val)}
                                        icon={<DollarSign size={16} />}
                                        placeholder="450000"
                                    />

                                    <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 flex items-start gap-4">
                                        <div className="p-3 bg-white rounded-2xl text-emerald-600 border border-emerald-100 shadow-sm shrink-0">
                                            <AlertTriangle size={20} className="animate-bounce" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">Quy tắc tính phí</h4>
                                            <p className="text-[10.5px] text-slate-500 font-bold leading-normal">
                                                Tổng học phí = Số tín chỉ học phần * Học phí/Tín chỉ. Thay đổi này chỉ có hiệu lực với các hóa đơn học phí phát sinh mới sau thời điểm điều chỉnh.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, label, description, icon }) => (
    <button
        onClick={onClick}
        type="button"
        className={`w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all duration-300 group
            ${active 
                ? 'bg-slate-900 text-white shadow-xl rotate-0' 
                : 'hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'}`}
    >
        <div className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300
            ${active 
                ? 'bg-slate-800 border-slate-700 text-emerald-400 group-hover:rotate-6' 
                : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-white group-hover:text-emerald-500 group-hover:border-emerald-100 group-hover:rotate-6'}`}
        >
            {icon}
        </div>
        <div className="min-w-0 flex-1">
            <p className={`text-xs font-black uppercase tracking-widest ${active ? 'text-emerald-400' : 'text-slate-700'}`}>{label}</p>
            <p className={`text-[10px] truncate font-bold mt-0.5 ${active ? 'text-slate-400' : 'text-slate-400'}`}>{description}</p>
        </div>
    </button>
);

const InputField = ({ label, description, type = 'text', value, onChange, icon, placeholder }) => (
    <div className="space-y-2.5">
        <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest block">{label}</label>
        <div className="flex items-center gap-3 px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus-within:ring-4 focus-within:ring-emerald-500/5 focus-within:border-emerald-500/50 transition-all group shadow-sm">
            <div className="text-slate-400 group-focus-within:text-emerald-500 transition-colors shrink-0">
                {icon}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
            />
        </div>
        {description && (
            <p className="text-[10px] text-slate-400 font-bold leading-normal px-1">{description}</p>
        )}
    </div>
);

const SelectField = ({ label, description, value, onChange, icon, options = [] }) => (
    <div className="space-y-2.5">
        <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest block">{label}</label>
        <div className="flex items-center gap-3 px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus-within:ring-4 focus-within:ring-emerald-500/5 focus-within:border-emerald-500/50 transition-all group shadow-sm">
            <div className="text-slate-400 group-focus-within:text-emerald-500 transition-colors shrink-0">
                {icon}
            </div>
            <select
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 flex-1 min-w-0 cursor-pointer"
            >
                <option value="" disabled className="text-slate-400">-- Lựa chọn Học kỳ --</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value} className="text-slate-700">{opt.label}</option>
                ))}
            </select>
        </div>
        {description && (
            <p className="text-[10px] text-slate-400 font-bold leading-normal px-1">{description}</p>
        )}
    </div>
);

const ToggleField = ({ label, description, checked, onChange }) => (
    <div className="p-6 bg-white/40 border border-slate-200/60 rounded-3xl shadow-sm flex items-start gap-4 hover:bg-white transition-all group">
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`w-12 h-6 rounded-full p-1 transition-all shrink-0 duration-300 focus:outline-none flex items-center shadow-inner
                ${checked ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'}`}
        >
            <div className="w-4 h-4 rounded-full bg-white shadow-md transform active:scale-95 transition-all"></div>
        </button>
        <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest block cursor-pointer" onClick={() => onChange(!checked)}>
                {label}
            </label>
            {description && (
                <p className="text-[10px] text-slate-400 font-bold leading-normal">{description}</p>
            )}
        </div>
    </div>
);

export default SystemConfigPage;
