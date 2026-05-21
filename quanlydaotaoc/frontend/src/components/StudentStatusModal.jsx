import { useState, useEffect } from 'react';
import { studentApi } from '../api/studentApi';
import { History, Save, X, Clock } from 'lucide-react';

const StudentStatusModal = ({ isOpen, onClose, onSuccess, studentData }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        statusCode: 'ACTIVE',
        statusName: 'Đang học',
        startDate: new Date().toISOString().split('T')[0],
        reason: '',
        description: ''
    });

    const statusOptions = [
        { code: 'ACTIVE', name: 'Đang học' },
        { code: 'RESERVED', name: 'Bảo lưu' },
        { code: 'DROPPED', name: 'Thôi học' },
        { code: 'GRADUATED', name: 'Tốt nghiệp' },
        { code: 'SUSPENDED', name: 'Đình chỉ' }
    ];

    useEffect(() => {
        if (isOpen && studentData) {
            fetchHistory();
            // Mặc định chọn trạng thái hiện tại hoặc giá trị đầu tiên
            const current = statusOptions.find(o => o.code === studentData.statusCode) || statusOptions[0];
            setFormData({
                statusCode: current.code,
                statusName: current.name,
                startDate: new Date().toISOString().split('T')[0],
                reason: '',
                description: ''
            });
        }
    }, [isOpen, studentData]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await studentApi.getStatusHistory(studentData.id);
            if (response.success) {
                setHistory(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy lịch sử trạng thái:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'statusCode') {
            const selected = statusOptions.find(o => o.code === value);
            setFormData(prev => ({ 
                ...prev, 
                statusCode: value, 
                statusName: selected ? selected.name : '' 
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await studentApi.changeStatus(studentData.id, formData);
            if (response.success) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen || !studentData) return null;

    const getStatusBadgeClass = (code) => {
        switch (code) {
            case 'ACTIVE': return 'bg-green-100 text-green-700';
            case 'RESERVED': return 'bg-amber-100 text-amber-700';
            case 'DROPPED': return 'bg-red-100 text-red-700';
            case 'GRADUATED': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
                    <div>
                        <h3 className="text-xl font-bold">Thay đổi trạng thái sinh viên</h3>
                        <p className="text-indigo-100 text-sm mt-1">
                            {studentData.fullName} - {studentData.studentCode}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 flex flex-col md:flex-row gap-8">
                    
                    {/* Form Thay đổi */}
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Save size={16} /> Cập nhật trạng thái mới
                        </h4>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái mới *</label>
                                <select 
                                    name="statusCode" 
                                    value={formData.statusCode} 
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    {statusOptions.map(opt => (
                                        <option key={opt.code} value={opt.code}>{opt.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu *</label>
                                <input 
                                    name="startDate" 
                                    type="date" 
                                    value={formData.startDate} 
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lý do thay đổi</label>
                                <input 
                                    name="reason" 
                                    type="text" 
                                    value={formData.reason} 
                                    onChange={handleChange}
                                    placeholder="VD: Chuyển trường, nghỉ học kỳ..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú thêm</label>
                                <textarea 
                                    name="description" 
                                    rows="3"
                                    value={formData.description} 
                                    onChange={handleChange}
                                    placeholder="Thông tin chi tiết về quyết định thay đổi..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? 'Đang cập nhật...' : 'Xác nhận thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Lịch sử */}
                    <div className="flex-1 border-l border-gray-100 pl-0 md:pl-8">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <History size={16} /> Lịch sử thay đổi
                        </h4>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-8 text-gray-400 text-sm italic">Đang tải lịch sử...</div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 text-sm italic">Chưa có lịch sử thay đổi.</div>
                            ) : (
                                <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                                    {history.map((item, idx) => (
                                        <div key={item.id} className="relative pl-6">
                                            {/* Dot */}
                                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${idx === 0 ? 'bg-indigo-500 ring-4 ring-indigo-100' : 'bg-gray-300'}`}></div>
                                            
                                            <div className="flex flex-col">
                                                <div className="flex items-center justify-between">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadgeClass(item.statusCode)}`}>
                                                        {item.statusName}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                        <Clock size={10} /> {new Date(item.createdAt).toLocaleString('vi-VN')}
                                                    </span>
                                                </div>
                                                <div className="mt-1 text-sm font-semibold text-gray-800">
                                                    Từ: {new Date(item.startDate).toLocaleDateString('vi-VN')} 
                                                    {item.endDate && ` đến ${new Date(item.endDate).toLocaleDateString('vi-VN')}`}
                                                </div>
                                                {item.reason && <p className="text-xs text-gray-600 mt-0.5"><span className="font-medium">Lý do:</span> {item.reason}</p>}
                                                {item.description && <p className="text-xs text-gray-500 mt-0.5 italic">{item.description}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-600 hover:text-gray-900">
                        Hủy bỏ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentStatusModal;
