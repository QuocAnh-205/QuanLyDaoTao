import { useState, useEffect } from 'react';
import { studentApi, classApi } from '../api/studentApi';

const StudentFormModal = ({ isOpen, onClose, onSuccess, initialData }) => {
    const isEdit = !!initialData;
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        studentCode: '',
        fullName: '',
        dateOfBirth: '',
        gender: '1',
        personalIdentificationNumber: '',
        dateOfIssue: '',
        cardPlace: '',
        email: '',
        phone: '',
        address: '',
        currentAddress: '',
        classId: '',
    });

    useEffect(() => {
        if (isOpen) {
            classApi.getAll().then(res => {
                if (res.success) setClasses(res.data);
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                studentCode: initialData.studentCode || '',
                fullName: initialData.fullName || '',
                dateOfBirth: initialData.dateOfBirth || '',
                gender: initialData.gender || '1',
                personalIdentificationNumber: initialData.personalIdentificationNumber || '',
                dateOfIssue: initialData.dateOfIssue || '',
                cardPlace: initialData.cardPlace || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                address: initialData.address || '',
                currentAddress: initialData.currentAddress || '',
                classId: initialData.classId || '',
            });
        } else {
            setFormData({
                studentCode: '',
                fullName: '',
                dateOfBirth: '',
                gender: '1',
                personalIdentificationNumber: '',
                dateOfIssue: '',
                cardPlace: '',
                email: '',
                phone: '',
                address: '',
                currentAddress: '',
                classId: '',
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response;
            if (isEdit) {
                response = await studentApi.update(initialData.id, formData);
            } else {
                response = await studentApi.create(formData);
            }

            if (response.success) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
                    <div>
                        <h3 className="text-xl font-bold">
                            {isEdit ? 'Chỉnh sửa Hồ sơ Sinh viên' : 'Thêm Sinh viên mới'}
                        </h3>
                        <p className="text-blue-100 text-sm mt-1">
                            Vui lòng điền đầy đủ thông tin bắt buộc (*)
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-8">
                    <form id="student-form" onSubmit={handleSubmit} className="space-y-8">

                        {/* Group 1: Tài khoản & Học tập */}
                        <section>
                            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 border-b pb-2">1. Thông tin Học vụ</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã Sinh viên *</label>
                                    <input name="studentCode" type="text" required disabled={isEdit} value={formData.studentCode} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 disabled:opacity-60" placeholder="VD: SV2026001" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lớp hành chính *</label>
                                    <select name="classId" required value={formData.classId} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                        <option value="">-- Chọn lớp --</option>
                                        {classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.className} ({c.classCode})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Group 2: Cá nhân */}
                        <section>
                            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 border-b pb-2">2. Thông tin Cá nhân</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên *</label>
                                    <input name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                        <option value="1">Nam</option>
                                        <option value="2">Nữ</option>
                                        <option value="0">Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh *</label>
                                    <input name="dateOfBirth" type="date" required value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số CMND/CCCD</label>
                                    <input name="personalIdentificationNumber" type="text" value={formData.personalIdentificationNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày cấp</label>
                                    <input name="dateOfIssue" type="date" value={formData.dateOfIssue} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nơi cấp</label>
                                    <input name="cardPlace" type="text" value={formData.cardPlace} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </section>

                        {/* Group 3: Liên hệ */}
                        <section>
                            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 border-b pb-2">3. Thông tin Liên lạc</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                    <input name="phone" type="text" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ thường trú</label>
                                    <input name="address" type="text" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ hiện tại</label>
                                    <input name="currentAddress" type="text" value={formData.currentAddress} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </section>

                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
                        Hủy bỏ
                    </button>
                    <button form="student-form" type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                        {loading ? 'Đang xử lý...' : isEdit ? 'Lưu thay đổi' : 'Hoàn tất Thêm mới'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentFormModal;