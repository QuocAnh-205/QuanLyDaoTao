import { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { profileApi } from '../api/profileApi';

const ProfileEditModal = ({ isOpen, onClose, initialData, onUpdate, roles = [] }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    const canEditSensitiveInfo = roles.includes('ADMIN') || roles.includes('GIAOVU');

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || '',
                email: initialData.email || '',
                phone: initialData.phone || ''
            });
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await profileApi.updateProfile(formData);
            if (res.success) {
                toast.success("Cập nhật hồ sơ thành công");
                onUpdate(res.data);
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi cập nhật hồ sơ");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-fadeInScale">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <User size={20} className="text-gray-400" /> Chỉnh sửa hồ sơ
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {!canEditSensitiveInfo && (
                        <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-xs flex gap-2 items-start">
                            <Lock size={16} className="shrink-0 mt-0.5" />
                            <p>Tên và Email được quản lý bởi Hệ thống. Vui lòng liên hệ Giáo vụ nếu cần thay đổi.</p>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Họ và tên</label>
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                required
                                disabled={!canEditSensitiveInfo}
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                className={`w-full pl-10 pr-4 py-2.5 border border-gray-100 rounded-xl text-sm transition-all outline-none ${!canEditSensitiveInfo ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900'}`}
                                placeholder="Nhập họ tên đầy đủ"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                required
                                disabled={!canEditSensitiveInfo}
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className={`w-full pl-10 pr-4 py-2.5 border border-gray-100 rounded-xl text-sm transition-all outline-none ${!canEditSensitiveInfo ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900'}`}
                                placeholder="example@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Số điện thoại</label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all outline-none"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>Lưu thay đổi</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;
