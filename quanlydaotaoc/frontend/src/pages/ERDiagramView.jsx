import React from 'react';

const ERDiagramView = () => {
    // Danh sách đầy đủ 13 nhóm bảng chức năng (theo db__tables.txt)
    const groups = [
        { id: 'I', name: 'Xác thực & Phân quyền', count: 5, tables: ['users', 'roles', 'user_roles', 'permissions', 'role_permissions'], implemented: true },
        { id: 'II', name: 'Hồ sơ Sinh viên', count: 3, tables: ['students', 'student_status', 'student_classes'], implemented: true },
        { id: 'III', name: 'Nhân sự & Giảng viên', count: 7, tables: ['departments', 'positions', 'employees', 'lecturer_degrees', 'lecturer_positions_history', 'contracts', 'lecturer_specializations'], implemented: true },
        { id: 'IV', name: 'Chương trình & Môn học', count: 5, tables: ['majors', 'training_programs', 'courses', 'training_program_courses', 'course_prerequisites'], implemented: true },
        { id: 'V', name: 'Học kỳ & Lớp học phần', count: 4, tables: ['semesters', 'course_sections', 'student_course_sections', 'lecturer_course_sections'], implemented: true },
        { id: 'VI', name: 'Đăng ký học phần', count: 3, tables: ['registration_periods', 'course_registrations', 'equivalent_courses'], implemented: false },
        { id: 'VII', name: 'Lịch học & Cơ sở vật chất', count: 4, tables: ['buildings', 'rooms', 'time_slots', 'schedules'], implemented: false },
        { id: 'VIII', name: 'Điểm & Đánh giá', count: 4, tables: ['grade_components', 'student_component_grades', 'student_summaries', 'grade_scales'], implemented: false },
        { id: 'IX', name: 'Học phí & Tài chính', count: 3, tables: ['tuition_fees', 'student_tuition', 'payments'], implemented: false },
        { id: 'X', name: 'Khảo thí & Lịch thi', count: 6, tables: ['exam_types', 'exams', 'exam_rooms', 'exam_registrations', 'exam_results', 'exam_papers'], implemented: false },
        { id: 'XI', name: 'Xét tốt nghiệp', count: 2, tables: ['graduation_conditions', 'graduation_results'], implemented: false },
        { id: 'XII', name: 'Thông báo & Hệ thống', count: 4, tables: ['notifications', 'user_notifications', 'logs', 'settings'], implemented: false },
        { id: 'XIV', name: 'Liên lạc Email', count: 6, tables: ['email_templates', 'email_attachments', 'email_groups', 'email_queue', 'smtp_configs', 'email_logs'], implemented: false },
    ];

    const mainRelations = [
        { from: 'users', to: 'students/employees', via: 'user_id' },
        { from: 'departments', to: 'majors/courses', via: 'department_id' },
        { from: 'student_classes', to: 'students', via: 'class_id' },
        { from: 'courses', to: 'course_sections', via: 'course_id' },
        { from: 'course_sections', to: 'course_registrations', via: 'course_section_id' },
        { from: 'course_registrations', to: 'grades/tuition', via: 'registration_id' },
        { from: 'buildings', to: 'rooms', via: 'building_id' },
        { from: 'exams', to: 'exam_rooms', via: 'exam_id' }
    ];

    return (
        <div className="p-4 bg-[#f8fafc] min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">University DB Schema Overview</h1>
                    <p className="text-slate-500 mt-2 font-medium">Hệ thống stdmanager | SQL Server | 13 Nhóm chức năng | 60+ Bảng dữ liệu</p>
                    <div className="flex justify-center gap-4 mt-4">
                        <span className="flex items-center gap-2 text-xs font-bold px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span> Đã triển khai (Giai đoạn 1 & 2)
                        </span>
                        <span className="flex items-center gap-2 text-xs font-bold px-3 py-1 bg-slate-100 text-slate-400 rounded-full border border-slate-200">
                            Kế hoạch phát triển
                        </span>
                    </div>
                </div>

                {/* Grid Groups */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            className={`relative bg-white rounded-2xl border-2 p-5 transition-all duration-500 shadow-sm hover:shadow-md ${group.implemented
                                    ? 'border-indigo-500 ring-4 ring-indigo-50'
                                    : 'border-slate-100 opacity-40 grayscale blur-[0.8px]'
                                }`}
                        >
                            {!group.implemented && (
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <span className="bg-slate-800/80 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter">Planned</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-lg ${group.implemented ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        {group.id}
                                    </span>
                                    <h3 className="text-sm font-bold text-slate-800">{group.name}</h3>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">{group.count} tables</span>
                            </div>

                            <ul className="space-y-1.5">
                                {group.tables.map((table) => (
                                    <li key={table} className="text-[11px] text-slate-600 flex items-center gap-2 font-mono">
                                        <span className={`w-1 h-1 rounded-full ${group.implemented ? 'bg-amber-400' : 'bg-slate-300'}`}></span>
                                        {table}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Quick Relations Overview */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                    </div>

                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <span className="p-2 bg-indigo-500 rounded-xl">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </span>
                        Các mối quan hệ thực thể chính (FK)
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {mainRelations.map((rel, i) => (
                            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 backdrop-blur-sm">
                                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2 uppercase tracking-tighter">
                                    <span>From</span>
                                    <span>To</span>
                                </div>
                                <div className="flex items-center justify-between font-bold text-xs">
                                    <span className="text-indigo-400">{rel.from}</span>
                                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    <span className="text-amber-400">{rel.to}</span>
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-700 text-[10px] text-slate-500 italic">
                                    via {rel.via}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ERDiagramView;