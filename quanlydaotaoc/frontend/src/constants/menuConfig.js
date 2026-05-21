export const MENU_ITEMS = [
    {
        title: 'Quản lý Sinh viên',
        path: '/students',
        roles: ['ADMIN', 'GIAOVU'],
    },
    {
        title: 'Quản lý Lớp học',
        path: '/student-classes',
        roles: ['ADMIN', 'GIAOVU'],
    },
    {
        title: 'Quản lý Giảng viên',
        path: '/lecturers',
        roles: ['ADMIN', 'GIAOVU'],
    },
    {
        title: 'Danh mục Môn học',
        path: '/academic',
        roles: ['ADMIN', 'GIAOVU'],
    },
    {
        title: 'Quản lý Đào tạo',
        path: '/academic-management',
        roles: ['ADMIN', 'GIAOVU'],
    },
    {
        title: 'Quản lý Học phí',
        path: '/tuition',
        roles: ['ADMIN', 'GIAOVU', 'SINHVIEN'],
    },
];