import { useState, useEffect } from 'react';
import { X, Save, UserPlus, FileEdit, Info, Briefcase, GraduationCap, Phone, Mail, MapPin } from 'lucide-react';
import { employeeApi } from '../../api/lecturerApi';
import toast from 'react-hot-toast';

const LecturerFormModal = ({ isOpen, onClose, data, departments, positions }) => {
    const isEdit = !!data;
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'work'

    const [formData, setFormData] = useState({
        employeeCode: '',
        fullName: '',
        dateOfBirth: '',
        gender: '1',
        email: '',
        phone: '',
        address: '',
        departmentId: '',
        positionId: '',
        hireDate: '',
        contractType: '',
        salaryCoefficient: '',
        academicDegree: '',
        academicTitle: '',
        specialization: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                employeeCode: data.employeeCode || '',
                fullName: data.fullName || '',
                dateOfBirth: data.dateOfBirth || '',
                gender: data.gender || '1',
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
                departmentId: data.departmentId || '',
                positionId: data.positionId || '',
                hireDate: data.hireDate || '',
                contractType: data.contractType || '',
                salaryCoefficient: data.salaryCoefficient || '',
                academicDegree: data.academicDegree || '',
                academicTitle: data.academicTitle || '',
                specialization: data.specialization || ''
            });
        } else {
            setFormData({
                employeeCode: '', fullName: '', dateOfBirth: '', gender: '1', email: '', phone: '',
                address: '', departmentId: '', positionId: '', hireDate: '', contractType: '',
                salaryCoefficient: '', academicDegree: '', academicTitle: '', specialization: ''
            });
        }
    }, [data, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData };
            if (!payload.departmentId) payload.departmentId = null;
            if (!payload.positionId) payload.positionId = null;

            if (isEdit) {
                const res = await employeeApi.update(data.id, payload);
                if (res.success) {
                    toast.success("Cập nhật thông tin thành công!");
                    onClose();
                }
            } else {
                const res = await employeeApi.create(payload);
                if (res.success) {
                    toast.success("Thêm mới cán bộ thành công!");
                    onClose();
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi lưu thông tin");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-200/50 border border-slate-100 w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden transform animate-in slide-in-from-bottom-8 duration-500">
                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            {isEdit ? <FileEdit size={24} className="text-white" /> : <UserPlus size={24} className="text-white" />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">{isEdit ? 'Chỉnh sửa Hồ sơ' : 'Thêm Cán bộ mới'}</h3>
                            <p className="text-indigo-200 text-xs mt-0.5">Vui lòng điền đầy đủ các thông tin bắt buộc (*)</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all">
                        <X size={22} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-8 bg-white border-b border-slate-100 flex gap-8 shrink-0">
                    <button 
                        onClick={() => setActiveTab('personal')}
                        className={`py-4 text-sm font-bold transition-all relative ${activeTab === 'personal' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Thông tin cá nhân
                        {activeTab === 'personal' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('work')}
                        className={`py-4 text-sm font-bold transition-all relative ${activeTab === 'work' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Công tác & Học vụ
                        {activeTab === 'work' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <form id="lecturerForm" onSubmit={handleSubmit}>
                        {activeTab === 'personal' ? (
                            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <Info size={14} className="text-indigo-500" /> Mã Cán bộ (*)
                                        </label>
                                        <input required name="employeeCode" value={formData.employeeCode} onChange={handleChange} disabled={isEdit}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none disabled:bg-slate-100 disabled:text-slate-500 transition-all text-sm font-medium" 
                                            placeholder="VD: GV202401" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Họ và tên (*)</label>
                                        <input required name="fullName" value={formData.fullName} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium" 
                                            placeholder="Nguyễn Văn A" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <Mail size={14} className="text-indigo-500" /> Email (*)
                                        </label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium" 
                                            placeholder="example@edu.vn" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <Phone size={14} className="text-indigo-500" /> Số điện thoại
                                        </label>
                                        <input name="phone" value={formData.phone} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium" 
                                            placeholder="09xx xxx xxx" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Giới tính</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium appearance-none">
                                            <option value="1">Nam</option>
                                            <option value="2">Nữ</option>
                                            <option value="0">Khác</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Ngày sinh</label>
                                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium" />
                                    </div>
                                </section>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <MapPin size={14} className="text-indigo-500" /> Địa chỉ thường trú
                                    </label>
                                    <textarea name="address" value={formData.address} onChange={handleChange} rows="2"
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium"
                                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố..."></textarea>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <Briefcase size={14} className="text-indigo-500" /> Khoa / Viện công tác (*)
                                        </label>
                                        <select required name="departmentId" value={formData.departmentId} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium">
                                            <option value="">-- Chọn Khoa/Viện --</option>
                                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Chức danh / Vị trí (*)</label>
                                        <select required name="positionId" value={formData.positionId} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium">
                                            <option value="">-- Chọn Chức danh --</option>
                                            {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <GraduationCap size={14} className="text-indigo-500" /> Học vị
                                        </label>
                                        <input name="academicDegree" value={formData.academicDegree} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium" 
                                            placeholder="Thạc sĩ, Tiến sĩ..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Học hàm</label>
                                        <input name="academicTitle" value={formData.academicTitle} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium" 
                                            placeholder="Giáo sư, Phó Giáo sư..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Chuyên môn sâu</label>
                                        <input name="specialization" value={formData.specialization} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium" 
                                            placeholder="VD: Khoa học máy tính" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Loại hợp đồng</label>
                                        <input name="contractType" value={formData.contractType} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium" 
                                            placeholder="Hợp đồng dài hạn, Cơ hữu..." />
                                    </div>
                                </section>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-white border-t border-slate-100 flex justify-end gap-4 shrink-0">
                    <button type="button" onClick={onClose} disabled={loading}
                        className="px-6 py-3 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">
                        Hủy bỏ
                    </button>
                    <button type="submit" form="lecturerForm" disabled={loading}
                        className="px-8 py-3 flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all shadow-lg shadow-indigo-100 disabled:opacity-50">
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Save size={18} />
                        )}
                        {isEdit ? 'Cập nhật hồ sơ' : 'Lưu thông tin'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LecturerFormModal;
