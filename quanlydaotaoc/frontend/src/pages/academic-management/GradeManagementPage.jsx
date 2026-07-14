import { useState, useEffect, useMemo } from 'react';
import { 
    Calendar, Users, BookOpen, Clock, Loader2, Info, Plus, Trash2, 
    Settings, Save, Lock, FileSpreadsheet, TrendingUp, Award,
    CheckCircle2, AlertCircle, RefreshCw, BarChart2, ShieldCheck, ChevronRight,
    UserPlus, Search, UserCheck
} from 'lucide-react';
import { semesterApi } from '../../api/semesterApi';
import { gradeApi } from '../../api/gradeApi';
import { studentApi } from '../../api/studentApi';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import AddStudentsToSectionModal from '../../components/academic-management/AddStudentsToSectionModal';
import RegisterStudentCourseModal from '../../components/academic-management/RegisterStudentCourseModal';
import AddStudentByInfoModal from '../../components/academic-management/AddStudentByInfoModal';

const GradeManagementPage = () => {
    const user = useAuthStore((state) => state.user);
    const isStudent = user?.roles?.includes('SINHVIEN');
    const isLecturer = user?.roles?.includes('GIANGVIEN');
    const isStaff = user?.roles?.some(role => ['ADMIN', 'GIAOVU'].includes(role));

    // viewMode state (only for staff/lecturer)
    const [viewMode, setViewMode] = useState('section'); // section | student

    // --- Tab 1: Section-based State ---
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [loadingSemesters, setLoadingSemesters] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [activeTab, setActiveTab] = useState('grades'); // grades | config
    const [components, setComponents] = useState([]);
    const [studentsGrades, setStudentsGrades] = useState([]);
    const [loadingGrades, setLoadingGrades] = useState(false);
    const [savingGrades, setSavingGrades] = useState(false);
    const [isAddStudentsModalOpen, setIsAddStudentsModalOpen] = useState(false);
    const [isAddStudentByInfoModalOpen, setIsAddStudentByInfoModalOpen] = useState(false);
    const [configComponents, setConfigComponents] = useState([]);

    // --- Tab 2: Student-based State ---
    const [studentSearchKeyword, setStudentSearchKeyword] = useState('');
    const [studentSearchResults, setStudentSearchResults] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentTranscript, setStudentTranscript] = useState(null);
    const [loadingStudentTranscript, setLoadingStudentTranscript] = useState(false);
    const [isRegisterCourseModalOpen, setIsRegisterCourseModalOpen] = useState(false);
    const [editingGrades, setEditingGrades] = useState({}); // { [registrationId]: { [componentId]: scoreStr } }

    // --- Student Transcript View State ---
    const [transcript, setTranscript] = useState(null);
    const [loadingTranscript, setLoadingTranscript] = useState(false);

    // Initial load
    useEffect(() => {
        if (isStudent) {
            fetchStudentTranscript();
        } else {
            fetchSemesters();
        }
    }, [isStudent]);

    // When semester changes, load sections (Section view)
    useEffect(() => {
        if (selectedSemester && !isStudent && viewMode === 'section') {
            fetchSections(selectedSemester.id);
        }
    }, [selectedSemester, isStudent, viewMode]);

    // When section changes, load components and student grades (Section view)
    useEffect(() => {
        if (selectedSection && viewMode === 'section') {
            fetchSectionGradeData(selectedSection.id);
        }
    }, [selectedSection, viewMode]);

    // Debounced student search
    useEffect(() => {
        if (studentSearchKeyword.trim() === '') {
            setStudentSearchResults([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            try {
                const res = await studentApi.getAll({
                    keyword: studentSearchKeyword,
                    size: 10,
                    page: 0
                });
                if (res.success && res.data) {
                    setStudentSearchResults(res.data.content || []);
                }
            } catch (error) {
                console.error(error);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [studentSearchKeyword]);

    // Fetch student transcript (For logged-in Student)
    const fetchStudentTranscript = async () => {
        setLoadingTranscript(true);
        try {
            const res = await gradeApi.getMyTranscript();
            if (res.success) {
                setTranscript(res.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể tải bảng điểm cá nhân');
        } finally {
            setLoadingTranscript(false);
        }
    };

    // Fetch semesters
    const fetchSemesters = async () => {
        setLoadingSemesters(true);
        try {
            const res = await semesterApi.getAllSemesters();
            if (res.success && res.data) {
                setSemesters(res.data);
                // Set default active semester
                const active = res.data.find(s => s.isActive);
                if (active) setSelectedSemester(active);
                else if (res.data.length > 0) setSelectedSemester(res.data[0]);
            } else {
                setSemesters([]);
            }
        } catch (error) {
            toast.error('Lỗi khi tải danh sách học kỳ');
        } finally {
            setLoadingSemesters(false);
        }
    };

    // Fetch course sections by semester
    const fetchSections = async (semesterId) => {
        setLoadingSections(true);
        try {
            const res = await semesterApi.getSectionsBySemester(semesterId);
            if (res.success && res.data) {
                let data = res.data;
                // If lecturer, filter only their sections
                if (isLecturer && user) {
                    data = data.filter(sec => sec.lecturerName === user.fullName);
                }
                setSections(data);
                if (data.length > 0) {
                    setSelectedSection(data[0]);
                } else {
                    setSelectedSection(null);
                }
            } else {
                setSections([]);
                setSelectedSection(null);
            }
        } catch (error) {
            toast.error('Lỗi khi tải lớp học phần');
        } finally {
            setLoadingSections(false);
        }
    };

    // Load components and grades for selected section
    const fetchSectionGradeData = async (sectionId) => {
        setLoadingGrades(true);
        try {
            const [compRes, studentRes] = await Promise.all([
                gradeApi.getComponents(sectionId),
                gradeApi.getStudentGrades(sectionId)
            ]);

            if (compRes.success && studentRes.success) {
                const compData = compRes.data || [];
                const studentData = studentRes.data || [];

                setComponents(compData);
                setConfigComponents(compData.map(c => ({ ...c })));
                
                // Set local editing state for student grades
                setStudentsGrades(studentData.map(std => {
                    const gradeMap = {};
                    const compGrades = std.componentGrades || [];
                    compGrades.forEach(cg => {
                        if (cg && cg.componentId) {
                            gradeMap[cg.componentId] = cg.score !== null ? cg.score.toString() : '';
                        }
                    });
                    return {
                        ...std,
                        localGrades: gradeMap
                    };
                }));
            }
        } catch (error) {
            toast.error('Lỗi khi tải thông tin điểm lớp học phần');
        } finally {
            setLoadingGrades(false);
        }
    };

    // Load student transcript by ID (Admin view)
    const fetchStudentTranscriptById = async (studentId) => {
        setLoadingStudentTranscript(true);
        try {
            const res = await gradeApi.getStudentTranscript(studentId);
            if (res.success) {
                setStudentTranscript(res.data);
            }
        } catch (error) {
            toast.error("Không thể tải bảng điểm của sinh viên");
        } finally {
            setLoadingStudentTranscript(false);
        }
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        setStudentSearchKeyword('');
        setStudentSearchResults([]);
        setEditingGrades({});
        fetchStudentTranscriptById(student.id);
    };

    // Handle grade input change (Section view)
    const handleGradeChange = (registrationId, componentId, val) => {
        const student = studentsGrades.find(s => s.registrationId === registrationId);
        if (student?.isFinalized) return;

        if (val !== '' && !/^\d*\.?\d*$/.test(val)) return;
        const num = parseFloat(val);
        if (!isNaN(num) && (num < 0 || num > 10)) return;

        setStudentsGrades(prev => prev.map(std => {
            if (std.registrationId === registrationId) {
                const updatedLocal = { ...std.localGrades, [componentId]: val };
                
                let total = 0;
                let allEntered = true;
                
                for (const comp of components) {
                    const compVal = updatedLocal[comp.id];
                    if (compVal === '') {
                        allEntered = false;
                        break;
                    }
                    total += parseFloat(compVal) * (comp.weightPercentage / 100);
                }

                return {
                    ...std,
                    localGrades: updatedLocal,
                    calculatedTotal: allEntered ? total.toFixed(2) : null
                };
            }
            return std;
        }));
    };

    // Handle grade input change (Student view)
    const handleStudentGradeChange = (registrationId, componentId, val) => {
        if (val !== '' && !/^\d*\.?\d*$/.test(val)) return;
        const num = parseFloat(val);
        if (!isNaN(num) && (num < 0 || num > 10)) return;

        setEditingGrades(prev => {
            const studentRow = prev[registrationId] || {};
            const updatedRow = { ...studentRow, [componentId]: val };
            return {
                ...prev,
                [registrationId]: updatedRow
            };
        });
    };

    // Calculate dynamic letter grade and color (5-level scale system)
    const getGradeInfo = (scoreStr) => {
        if (scoreStr === null || scoreStr === undefined || scoreStr === '') return { letter: '-', color: 'text-slate-400', gpa: '-' };
        const score = parseFloat(scoreStr);
        if (isNaN(score)) return { letter: '-', color: 'text-slate-400', gpa: '-' };

        if (score >= 8.45) return { letter: 'A', color: 'text-emerald-600 font-black', gpa: '4.00' };
        if (score >= 6.95) return { letter: 'B', color: 'text-cyan-600 font-bold', gpa: '3.00' };
        if (score >= 5.45) return { letter: 'C', color: 'text-yellow-600 font-bold', gpa: '2.00' };
        if (score >= 3.95) return { letter: 'D', color: 'text-orange-500 font-bold', gpa: '1.00' };
        return { letter: 'F', color: 'text-rose-600 font-black animate-pulse', gpa: '0.00' };
    };

    // Helper to map component codes to standard categories
    const getComponentColumnKey = (code) => {
        const c = code?.toUpperCase() || '';
        if (c === 'CC' || c.includes('CHUYEN') || c.includes('ATTEND')) return 'chuyenCan';
        if (c === 'GK' || c.includes('GIUA') || c.includes('MID')) return 'giuaKy';
        if (c === 'CK' || c === 'THI' || c.includes('CUOI') || c.includes('EXAM')) return 'thi';
        if (c === 'KT' || c.includes('KIEM') || c.includes('QUIZ')) return 'kiemTra';
        if (c === 'TH' || c.includes('HANH') || c.includes('PRAC')) return 'thucHanh';
        if (c === 'TL' || c.includes('LUAN') || c.includes('ESSAY')) return 'tieuLuan';
        if (c === 'TD' || c.includes('THAI') || c.includes('ATTIT')) return 'thaiDo';
        return 'other';
    };

    // Save grades (Section view)
    const handleSaveGrades = async (finalize = false) => {
        if (finalize) {
            const confirm = window.confirm("Xác nhận khóa điểm lớp này? Không thể sửa đổi sau khi khóa.");
            if (!confirm) return;
        }

        setSavingGrades(true);
        try {
            const submissions = studentsGrades.map(std => {
                const gradesInput = components.map(comp => ({
                    componentId: comp.id,
                    score: std.localGrades[comp.id] !== '' ? parseFloat(std.localGrades[comp.id]) : null,
                    note: ""
                }));

                return {
                    registrationId: std.registrationId,
                    grades: gradesInput
                };
            });

            const res = await gradeApi.submitGrades(selectedSection.id, {
                submissions,
                finalize
            });

            if (res.success) {
                toast.success(finalize ? 'Đã khóa điểm thành công!' : 'Đã lưu điểm nháp!');
                fetchSectionGradeData(selectedSection.id);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu điểm');
        } finally {
            setSavingGrades(false);
        }
    };

    // Save student grades for single course (Student view)
    const handleSaveStudentCourseGrades = async (course, finalize = false) => {
        if (finalize) {
            const confirm = window.confirm("Khóa điểm môn học này cho sinh viên? Sau khi khóa sẽ không thể sửa đổi.");
            if (!confirm) return;
        }

        const registrationId = course.registrationId;
        const sectionId = course.courseSectionId;
        const rowEdits = editingGrades[registrationId] || {};

        const gradesInput = (course.componentGrades || []).map(comp => {
            const scoreStr = rowEdits[comp.componentId] !== undefined ? rowEdits[comp.componentId] : (comp.score !== null ? comp.score.toString() : '');
            return {
                componentId: comp.componentId,
                score: scoreStr !== '' ? parseFloat(scoreStr) : null,
                note: ""
            };
        });

        if (finalize) {
            const anyEmpty = gradesInput.some(g => g.score === null);
            if (anyEmpty) {
                toast.error("Vui lòng nhập đầy đủ tất cả các đầu điểm trước khi khóa.");
                return;
            }
        }

        setSavingGrades(true);
        try {
            const res = await gradeApi.submitGrades(sectionId, {
                submissions: [
                    {
                        registrationId,
                        grades: gradesInput
                    }
                ],
                finalize
            });

            if (res.success) {
                toast.success(finalize ? 'Đã khóa điểm môn học!' : 'Đã lưu điểm môn học!');
                fetchStudentTranscriptById(selectedStudent.id);
                setEditingGrades(prev => {
                    const copy = { ...prev };
                    delete copy[registrationId];
                    return copy;
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể lưu điểm môn học');
        } finally {
            setSavingGrades(false);
        }
    };

    // Configure components save
    const handleSaveConfig = async () => {
        const sum = configComponents.reduce((acc, c) => acc + parseFloat(c.weightPercentage || 0), 0);
        if (sum !== 100) {
            toast.error(`Tổng trọng số của các điểm thành phần là ${sum}%. Yêu cầu phải bằng đúng 100%!`);
            return;
        }

        setSavingGrades(true);
        try {
            const res = await gradeApi.configureComponents(selectedSection.id, configComponents);
            if (res.success) {
                toast.success('Thiết lập trọng số điểm thành công!');
                fetchSectionGradeData(selectedSection.id);
                setActiveTab('grades');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể lưu cấu hình trọng số');
        } finally {
            setSavingGrades(false);
        }
    };

    // Add component config input row
    const addConfigRow = () => {
        setConfigComponents(prev => [
            ...prev,
            {
                componentCode: '',
                componentName: '',
                weightPercentage: '',
                inputOrder: prev.length + 1,
                note: ''
            }
        ]);
    };

    // Remove component config input row
    const removeConfigRow = (index) => {
        setConfigComponents(prev => prev.filter((_, i) => i !== index));
    };

    // Update component config values
    const updateConfigValue = (index, key, val) => {
        setConfigComponents(prev => prev.map((item, i) => {
            if (i === index) {
                return { ...item, [key]: val };
            }
            return item;
        }));
    };

    // Check if any student is finalized
    const isSectionFinalized = useMemo(() => {
        return studentsGrades.some(s => s.isFinalized);
    }, [studentsGrades]);

    // Calculate row total score locally (Student view)
    const getRowCalculatedTotal = (course) => {
        const registrationId = course.registrationId;
        const rowEdits = editingGrades[registrationId] || {};
        
        let total = 0;
        let allEntered = true;

        if (!course.componentGrades || course.componentGrades.length === 0) return null;

        for (const comp of course.componentGrades) {
            const scoreStr = rowEdits[comp.componentId] !== undefined ? rowEdits[comp.componentId] : (comp.score !== null ? comp.score.toString() : '');
            if (scoreStr === '') {
                allEntered = false;
                break;
            }
            total += parseFloat(scoreStr) * (comp.weightPercentage / 100);
        }

        return allEntered ? total.toFixed(1) : null;
    };

    // Helper to render columns in Student view row
    const renderComponentCell = (course, colKey) => {
        const comp = (course.componentGrades || []).find(c => getComponentColumnKey(c.componentCode) === colKey);
        
        if (comp) {
            return (
                <>
                    <td className="py-2 px-1 border-r border-slate-100 text-center text-xs font-bold text-slate-500">
                        {comp.weightPercentage}%
                    </td>
                    <td className="py-2 px-1 border-r border-slate-200 text-center bg-slate-50/20">
                        <input
                            type="text"
                            value={
                                editingGrades[course.registrationId]?.[comp.componentId] !== undefined
                                ? editingGrades[course.registrationId][comp.componentId]
                                : (comp.score !== null ? comp.score.toString() : '')
                            }
                            onChange={(e) => handleStudentGradeChange(course.registrationId, comp.componentId, e.target.value)}
                            disabled={course.isFinalized}
                            className="w-11 text-center px-1 py-1 border border-slate-200 rounded-lg text-xs font-black focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100 disabled:border-slate-100"
                            placeholder="-"
                        />
                    </td>
                </>
            );
        } else {
            return (
                <>
                    <td className="py-2 px-1 border-r border-slate-100 text-center text-xs text-slate-300 font-bold">
                        0%
                    </td>
                    <td className="py-2 px-1 border-r border-slate-200 text-center text-xs text-slate-300">
                        0
                    </td>
                </>
            );
        }
    };

    // RENDER: Logged-in Student Transcript View
    if (isStudent) {
        return (
            <div className="flex flex-col gap-10 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-slate-200/60">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">
                            <Award size={14} className="animate-pulse" />
                            Kết quả tích lũy
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                            Kết Quả <span className="academic-text-gradient">Học Tập</span>
                        </h1>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest max-w-xl">
                            Tra cứu bảng điểm, tiến trình tích lũy tín chỉ và biểu đồ GPA cá nhân.
                        </p>
                    </div>
                </div>

                {loadingTranscript ? (
                    <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                        <Loader2 size={48} className="animate-spin mb-6 text-emerald-500" />
                        <p className="font-black text-xs tracking-[0.4em] uppercase text-slate-300">Đang đồng bộ hóa học bạ...</p>
                    </div>
                ) : transcript ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        {/* GPA Summaries (Left Aside) */}
                        <aside className="lg:col-span-4 xl:col-span-3 space-y-8 lg:sticky lg:top-28">
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl text-white relative overflow-hidden flex flex-col gap-8">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                                
                                <div className="relative z-10 flex items-center gap-3 border-b border-slate-800 pb-5">
                                    <TrendingUp size={20} className="text-emerald-500" />
                                    <div>
                                        <h3 className="font-black text-sm uppercase tracking-widest">Tiến Trình Tích Lũy</h3>
                                        <p className="text-[9px] font-black uppercase text-emerald-500/60 mt-0.5">{transcript.studentCode}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 relative z-10">
                                    <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">GPA Hệ 4</span>
                                        <span className="text-3xl font-black text-emerald-400 block mt-2">{transcript.cumulativeGpa}</span>
                                    </div>
                                    <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">GPA Hệ 10</span>
                                        <span className="text-3xl font-black text-teal-400 block mt-2">{transcript.cumulativeGpa10}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400 font-bold uppercase tracking-wider">Tín chỉ đăng ký</span>
                                        <span className="font-black text-slate-200">{transcript.totalCreditsRegistered}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400 font-bold uppercase tracking-wider">Tín chỉ tích lũy</span>
                                        <span className="font-black text-emerald-400">{transcript.totalCreditsEarned}</span>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Transcript Tables (Right Main) */}
                        <main className="lg:col-span-8 xl:col-span-9 space-y-12">
                            {transcript.semesters.length > 0 ? (
                                transcript.semesters.map((sem) => (
                                    <div key={sem.semesterId} className="bg-white rounded-[3rem] border border-slate-200/60 p-8 shadow-xl space-y-6">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs uppercase shadow-sm">
                                                    HK
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-900 text-lg leading-tight">{sem.semesterName}</h3>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{sem.semesterCode}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-right">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Tín chỉ học kỳ</span>
                                                    <span className="text-sm font-black text-slate-800">{sem.semesterCredits}</span>
                                                </div>
                                                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-2 text-right">
                                                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest block">GPA Học kỳ</span>
                                                    <span className="text-sm font-black text-emerald-600">{sem.semesterGpa}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-slate-100">
                                                        <th className="py-4 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider">Mã học phần</th>
                                                        <th className="py-4 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider">Tên môn học</th>
                                                        <th className="py-4 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">Tín chỉ</th>
                                                        <th className="py-4 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">Điểm tổng</th>
                                                        <th className="py-4 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">Điểm chữ</th>
                                                        <th className="py-4 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">GPA</th>
                                                        <th className="py-4 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">Trạng thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {sem.courses.map((course) => {
                                                        const gradeInfo = getGradeInfo(course.totalScore);
                                                        return (
                                                            <tr key={course.registrationId} className="hover:bg-slate-50/50 transition-colors">
                                                                <td className="py-4 px-2 text-xs font-bold text-slate-500 uppercase">{course.courseCode}</td>
                                                                <td className="py-4 px-2 text-xs font-black text-slate-800">{course.courseName}</td>
                                                                <td className="py-4 px-2 text-xs font-bold text-slate-600 text-center">{course.credits}</td>
                                                                <td className="py-4 px-2 text-xs font-black text-slate-800 text-center">
                                                                    {course.totalScore !== null ? course.totalScore : '-'}
                                                                </td>
                                                                <td className={`py-4 px-2 text-xs text-center ${gradeInfo.color}`}>
                                                                    {course.letterGrade || '-'}
                                                                </td>
                                                                <td className="py-4 px-2 text-xs font-bold text-slate-700 text-center">
                                                                    {course.gpaValue !== null ? course.gpaValue : '-'}
                                                                </td>
                                                                <td className="py-4 px-2 text-center">
                                                                    {course.isFinalized ? (
                                                                        <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                                            course.result === 'PASS' 
                                                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                                                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                                                                        }`}>
                                                                            {course.result === 'PASS' ? 'Đạt' : 'Trượt'}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex px-3 py-1 rounded-full bg-slate-50 text-slate-400 border border-slate-100 text-[9px] font-black uppercase tracking-wider">
                                                                            Đang học
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-2xl">
                                    <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-10 shadow-inner">
                                        <AlertCircle size={56} className="text-slate-200" />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase mb-4">Học bạ trống</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] max-w-xs text-center leading-relaxed">
                                        Không tìm thấy bất kỳ đăng ký môn học hoặc kết quả học tập nào.
                                    </p>
                                </div>
                            )}
                        </main>
                    </div>
                ) : (
                    <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-slate-100">
                        <p className="text-slate-400 font-bold italic">Không thể đồng bộ dữ liệu học bạ của bạn.</p>
                    </div>
                )}
            </div>
        );
    }

    // RENDER: Staff / Lecturer View
    return (
        <div className="flex flex-col gap-10 animate-in fade-in duration-700 pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-slate-200/60">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">
                        <Settings size={14} className="animate-pulse" />
                        Ban khảo thí hệ thống
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                        Quản Lý <span className="academic-text-gradient">Điểm Số</span>
                    </h1>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest max-w-xl">
                        Thiết lập trọng số điểm, lưu trữ điểm thành phần, và khóa học bạ sinh viên.
                    </p>
                </div>
            </div>

            {/* View Mode switcher */}
            <div className="flex gap-4 p-2 bg-slate-100 rounded-2xl w-fit">
                <button
                    onClick={() => setViewMode('section')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        viewMode === 'section'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-200/50'
                    }`}
                >
                    Nhập theo Lớp học phần
                </button>
                <button
                    onClick={() => setViewMode('student')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        viewMode === 'student'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-200/50'
                    }`}
                >
                    Nhập theo Sinh viên
                </button>
            </div>

            {/* --- VIEW MODE: SECTION --- */}
            {viewMode === 'section' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <aside className="lg:col-span-4 xl:col-span-3 space-y-8 lg:sticky lg:top-28">
                        {/* Semesters Card */}
                        <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-slate-800">
                            <div className="p-8 border-b border-slate-800 relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                                <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-3">
                                    <Calendar size={18} className="text-emerald-500" /> Học Kỳ
                                </h3>
                                <p className="text-emerald-500/40 text-[9px] font-black uppercase tracking-[0.25em] mt-1">Chu kỳ đào tạo</p>
                            </div>
                            <div className="p-4 max-h-[220px] overflow-y-auto custom-scrollbar-dark space-y-2">
                                {semesters.map((sem) => (
                                    <button
                                        key={sem.id}
                                        onClick={() => setSelectedSemester(sem)}
                                        className={`w-full p-4 rounded-xl transition-all text-left text-xs font-bold border-2 ${
                                            selectedSemester?.id === sem.id
                                            ? 'bg-emerald-500 border-emerald-400 text-slate-900'
                                            : 'bg-transparent border-transparent text-slate-300 hover:bg-slate-800'
                                        }`}
                                    >
                                        {sem.semesterName}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Class Sections Card */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col border border-slate-100">
                            <div className="p-8 border-b border-slate-100">
                                <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest flex items-center gap-3">
                                    <BookOpen size={18} className="text-emerald-600" /> Lớp Học Phần
                                </h3>
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] mt-1">Danh sách phân dạy</p>
                            </div>
                            <div className="p-4 max-h-[300px] overflow-y-auto custom-scrollbar-light space-y-2">
                                {loadingSections ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 size={24} className="animate-spin text-emerald-500" />
                                    </div>
                                ) : sections.length > 0 ? (
                                    sections.map((sec) => (
                                        <button
                                            key={sec.id}
                                            onClick={() => setSelectedSection(sec)}
                                            className={`w-full p-4 rounded-xl transition-all text-left border-2 ${
                                                selectedSection?.id === sec.id
                                                ? 'bg-slate-900 border-slate-800 text-white shadow-lg'
                                                : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="font-black text-xs">{sec.courseName}</div>
                                            <div className="text-[10px] opacity-70 mt-1 uppercase tracking-wider">{sec.classCode}</div>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-slate-400 italic text-xs p-4 text-center">Không có lớp học phần nào</p>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Grade Entry Workspace */}
                    <main className="lg:col-span-8 xl:col-span-9 space-y-8">
                        {selectedSection ? (
                            <>
                                {/* Class Summary Header */}
                                <div className="bg-white border border-slate-200/60 rounded-[3rem] p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                                            {selectedSection.classCode}
                                        </span>
                                        <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedSection.courseName}</h2>
                                        <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                                            <span className="flex items-center gap-1.5"><Users size={14} /> Sĩ số: {selectedSection.currentStudents || 0} / {selectedSection.maxStudents || 0}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={14} /> Giảng viên: {selectedSection.lecturerName || 'Chưa phân công'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0 relative z-10">
                                        {isStaff && (
                                            <>
                                                <button
                                                    onClick={() => setIsAddStudentByInfoModalOpen(true)}
                                                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95 shadow-md shadow-emerald-500/10"
                                                >
                                                    <UserPlus size={14} /> Nhập sinh viên
                                                </button>
                                                <button
                                                    onClick={() => setIsAddStudentsModalOpen(true)}
                                                    className="px-6 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95"
                                                >
                                                    <Users size={14} /> Đăng ký từ DS
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => setActiveTab('grades')}
                                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                                activeTab === 'grades'
                                                ? 'bg-slate-900 text-white shadow-md'
                                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                            }`}
                                        >
                                            Nhập điểm
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActiveTab('config');
                                                setConfigComponents(components.map(c => ({ ...c })));
                                            }}
                                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                                activeTab === 'config'
                                                ? 'bg-slate-900 text-white shadow-md'
                                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                            }`}
                                        >
                                            Cấu hình trọng số
                                        </button>
                                    </div>
                                </div>

                                {/* Dynamic Tab Body */}
                                {loadingGrades ? (
                                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                                        <Loader2 size={40} className="animate-spin mb-4 text-emerald-500" />
                                        <p className="font-black text-xs tracking-[0.2em] uppercase text-slate-300">Đang đồng bộ điểm học bạ...</p>
                                    </div>
                                ) : activeTab === 'config' ? (
                                    /* Cấu hình trọng số */
                                    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-8 shadow-xl space-y-6">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                                            <div>
                                                <h3 className="font-black text-slate-900 text-lg leading-tight">Cấu hình điểm thành phần</h3>
                                                <p className="text-slate-400 text-xs mt-1">Trọng số phần trăm cho từng cột điểm. Tổng các cột phải bằng đúng 100%.</p>
                                            </div>
                                            <button
                                                onClick={addConfigRow}
                                                disabled={isSectionFinalized}
                                                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-black flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                            >
                                                <Plus size={16} /> Thêm cột điểm
                                            </button>
                                        </div>

                                        {isSectionFinalized && (
                                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-amber-800 text-xs font-bold">
                                                <AlertCircle size={16} className="shrink-0" />
                                                <span>Môn học này đã có điểm được khóa/finalize. Bạn không thể thay đổi cấu trúc trọng số điểm nữa.</span>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            {configComponents.map((comp, idx) => (
                                                <div key={idx} className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                    <div className="w-full sm:w-28">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mã cột điểm (VD: CC, GK, CK)</label>
                                                        <input
                                                            type="text"
                                                            value={comp.componentCode || ''}
                                                            onChange={(e) => updateConfigValue(idx, 'componentCode', e.target.value.toUpperCase())}
                                                            disabled={isSectionFinalized}
                                                            className="w-full mt-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 disabled:bg-slate-100"
                                                            placeholder="Mã"
                                                        />
                                                    </div>
                                                    <div className="w-full sm:flex-1">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tên cột điểm (VD: Chuyên cần, Giữa kỳ,...)</label>
                                                        <input
                                                            type="text"
                                                            value={comp.componentName || ''}
                                                            onChange={(e) => updateConfigValue(idx, 'componentName', e.target.value)}
                                                            disabled={isSectionFinalized}
                                                            className="w-full mt-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 disabled:bg-slate-100"
                                                            placeholder="Tên đầy đủ"
                                                        />
                                                    </div>
                                                    <div className="w-full sm:w-28">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trọng số (%)</label>
                                                        <input
                                                            type="number"
                                                            value={comp.weightPercentage || ''}
                                                            onChange={(e) => updateConfigValue(idx, 'weightPercentage', e.target.value !== '' ? parseFloat(e.target.value) : '')}
                                                            disabled={isSectionFinalized}
                                                            className="w-full mt-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 disabled:bg-slate-100"
                                                            placeholder="Ví dụ: 30"
                                                            min="0"
                                                            max="100"
                                                        />
                                                    </div>
                                                    <div className="w-full sm:w-20">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Thứ tự nhập</label>
                                                        <input
                                                            type="number"
                                                            value={comp.inputOrder || ''}
                                                            onChange={(e) => updateConfigValue(idx, 'inputOrder', parseInt(e.target.value) || 0)}
                                                            disabled={isSectionFinalized}
                                                            className="w-full mt-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 disabled:bg-slate-100"
                                                            placeholder="1"
                                                        />
                                                    </div>
                                                    {!isSectionFinalized && (
                                                        <button
                                                            onClick={() => removeConfigRow(idx)}
                                                            className="mt-5 p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors border border-rose-100"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}

                                            {configComponents.length === 0 && (
                                                <p className="text-slate-400 italic text-xs text-center py-6">Chưa thiết lập bất kỳ trọng số điểm nào. Nhấn "Thêm cột điểm" để tạo.</p>
                                            )}
                                        </div>

                                        {!isSectionFinalized && configComponents.length > 0 && (
                                            <div className="flex justify-between items-center border-t border-slate-100 pt-5">
                                                <div className="text-xs font-bold text-slate-500">
                                                    Tổng trọng số: {' '}
                                                    <span className={`font-black ${
                                                        configComponents.reduce((acc, c) => acc + parseFloat(c.weightPercentage || 0), 0) === 100
                                                        ? 'text-emerald-600'
                                                        : 'text-rose-500'
                                                    }`}>
                                                        {configComponents.reduce((acc, c) => acc + parseFloat(c.weightPercentage || 0), 0)}%
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={handleSaveConfig}
                                                    disabled={savingGrades}
                                                    className="px-8 py-3 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-2xl flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                                >
                                                    {savingGrades ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                                    Lưu thiết lập
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* Bảng nhập điểm */
                                    <div className="bg-white rounded-[3rem] border border-slate-200/60 p-8 shadow-xl space-y-6">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
                                            <div>
                                                <h3 className="font-black text-slate-900 text-lg leading-tight">Danh sách nhập điểm lớp</h3>
                                                <p className="text-slate-400 text-xs mt-1">Cập nhật điểm thành phần trực tiếp dưới ô và lưu hoặc khóa kết quả.</p>
                                            </div>
                                            {components.length > 0 && !isSectionFinalized && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSaveGrades(false)}
                                                        disabled={savingGrades}
                                                        className="px-6 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-black flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                                    >
                                                        {savingGrades ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                                                        Lưu nháp
                                                    </button>
                                                    <button
                                                        onClick={() => handleSaveGrades(true)}
                                                        disabled={savingGrades}
                                                        className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black flex items-center gap-2 active:scale-95 disabled:opacity-50 shadow-md shadow-rose-500/10"
                                                    >
                                                        {savingGrades ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />}
                                                        Khóa điểm môn học
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {isSectionFinalized && (
                                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3 text-emerald-800 text-xs font-bold">
                                                <ShieldCheck size={16} className="shrink-0" />
                                                <span>Bảng điểm đã được Khóa và Finalize trên Hệ thống. Điểm số đã đồng bộ sang học bạ sinh viên.</span>
                                            </div>
                                        )}

                                        {components.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                                                <Info size={32} className="text-slate-300 mb-2" />
                                                <p className="text-slate-500 text-xs font-bold">Lớp học phần này chưa được cấu hình trọng số điểm thành phần!</p>
                                                <button
                                                    onClick={() => setActiveTab('config')}
                                                    className="mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 rounded-xl text-xs font-black"
                                                >
                                                    Thiết lập ngay
                                                </button>
                                            </div>
                                        ) : studentsGrades.length === 0 ? (
                                            /* Lớp học chưa có sinh viên fallback */
                                            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 text-center p-8">
                                                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100 shadow-sm">
                                                    <Users size={32} />
                                                </div>
                                                <h4 className="text-base font-black text-slate-800 uppercase tracking-wide">Lớp học chưa có sinh viên</h4>
                                                <p className="text-slate-500 text-xs mt-2 max-w-sm">
                                                    Chưa có sinh viên nào đăng ký lớp học phần này trong học kỳ hiện tại.
                                                </p>
                                                {isStaff && (
                                                    <div className="flex gap-4 mt-6">
                                                        <button
                                                            onClick={() => setIsAddStudentByInfoModalOpen(true)}
                                                            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-900 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                                                        >
                                                            <UserPlus size={16} /> Nhập sinh viên mới
                                                        </button>
                                                        <button
                                                            onClick={() => setIsAddStudentsModalOpen(true)}
                                                            className="px-6 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-black active:scale-95 transition-all flex items-center gap-2"
                                                        >
                                                            <Users size={16} /> Đăng ký từ danh sách
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="border-b border-slate-100">
                                                            <th className="py-4 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider">Mã SV</th>
                                                            <th className="py-4 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider">Họ và tên</th>
                                                            {components.map((comp) => (
                                                                <th key={comp.id} className="py-4 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">
                                                                    {comp.componentName} <span className="text-[8px] font-bold text-slate-300">({comp.weightPercentage}%)</span>
                                                                </th>
                                                            ))}
                                                            <th className="py-4 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">Tổng kết (10)</th>
                                                            <th className="py-4 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">Thang điểm 4</th>
                                                            <th className="py-4 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">Điểm chữ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {studentsGrades.map((std) => {
                                                            const displayTotal = std.totalScore !== null && std.totalScore !== undefined ? std.totalScore : std.calculatedTotal;
                                                            const gradeInfo = getGradeInfo(displayTotal);
                                                            return (
                                                                <tr key={std.registrationId} className="hover:bg-slate-50/50 transition-colors">
                                                                    <td className="py-4 px-2 text-xs font-bold text-slate-500 uppercase">{std.studentCode}</td>
                                                                    <td className="py-4 px-2 text-xs font-black text-slate-800">{std.studentName}</td>
                                                                    {components.map((comp) => (
                                                                        <td key={comp.id} className="py-2 px-2 text-center">
                                                                            <input
                                                                                type="text"
                                                                                value={std.localGrades?.[comp.id] || ''}
                                                                                onChange={(e) => handleGradeChange(std.registrationId, comp.id, e.target.value)}
                                                                                disabled={std.isFinalized || isSectionFinalized}
                                                                                className="w-16 text-center px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-black focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100 disabled:border-slate-100"
                                                                                placeholder="-"
                                                                            />
                                                                        </td>
                                                                    ))}
                                                                    <td className="py-4 px-2 text-center text-xs font-black text-slate-900 bg-slate-50/30">
                                                                        {displayTotal !== null ? displayTotal : '-'}
                                                                    </td>
                                                                    <td className="py-4 px-2 text-center text-xs font-black text-slate-500 bg-slate-50/30">
                                                                        {displayTotal !== null ? gradeInfo.gpa : '-'}
                                                                    </td>
                                                                    <td className={`py-4 px-2 text-center text-xs ${gradeInfo.color} bg-slate-50/30`}>
                                                                        {displayTotal !== null ? gradeInfo.letter : '-'}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-2xl">
                                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-10 shadow-inner">
                                    <Award size={56} className="text-slate-200" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase mb-4">Chọn lớp học phần</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] max-w-xs text-center leading-relaxed">
                                    Vui lòng chọn học kỳ và lớp học phần ở thanh bên để thực hiện cấu hình hoặc nhập điểm.
                                </p>
                            </div>
                        )}
                    </main>

                    {/* Class Student Selection Modal */}
                    <AddStudentsToSectionModal
                        isOpen={isAddStudentsModalOpen}
                        onClose={() => setIsAddStudentsModalOpen(false)}
                        sectionId={selectedSection?.id}
                        onSuccess={() => {
                            fetchSectionGradeData(selectedSection.id);
                            if (selectedSemester) {
                                fetchSections(selectedSemester.id);
                            }
                        }}
                        existingStudentIds={studentsGrades.map(s => s.studentCode)}
                    />

                    {/* Direct Student Info Input Modal */}
                    <AddStudentByInfoModal
                        isOpen={isAddStudentByInfoModalOpen}
                        onClose={() => setIsAddStudentByInfoModalOpen(false)}
                        sectionId={selectedSection?.id}
                        onSuccess={() => {
                            fetchSectionGradeData(selectedSection.id);
                            if (selectedSemester) {
                                fetchSections(selectedSemester.id);
                            }
                        }}
                    />
                </div>
            )}

            {/* --- VIEW MODE: STUDENT --- */}
            {viewMode === 'student' && (
                <div className="space-y-8 animate-fadeIn">
                    {/* Student Selection Panel */}
                    <div className="bg-white border border-slate-200/60 rounded-[3rem] p-8 shadow-xl max-w-3xl relative">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tìm kiếm sinh viên để nhập điểm</label>
                            <div className="relative group w-full">
                                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Gõ mã sinh viên (MSSV) hoặc họ và tên sinh viên..."
                                    value={studentSearchKeyword}
                                    onChange={(e) => setStudentSearchKeyword(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 shadow-sm text-sm"
                                />
                                
                                {/* Search Results Dropdown */}
                                {studentSearchResults.length > 0 && (
                                    <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-50 max-h-60 overflow-y-auto">
                                        {studentSearchResults.map((std) => (
                                            <div
                                                key={std.id}
                                                onClick={() => handleSelectStudent(std)}
                                                className="flex justify-between items-center px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
                                            >
                                                <div>
                                                    <p className="font-black text-slate-800 text-sm leading-none">{std.fullName}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-2">Mã SV: <span className="text-emerald-600 font-mono">{std.studentCode}</span> {std.className && `• Lớp: ${std.className}`}</p>
                                                </div>
                                                <ChevronRight size={16} className="text-slate-300" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Student Info Card & Transcript Edit Grid */}
                    {selectedStudent ? (
                        <div className="space-y-8">
                            {/* Profile card summary */}
                            <div className="bg-slate-900 text-white rounded-[3rem] p-8 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                                        <Users size={32} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                                {selectedStudent.studentCode}
                                            </span>
                                            {studentTranscript && (
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-2.5 py-1 bg-white/5 rounded-lg border border-white/5">
                                                    Tích lũy: {studentTranscript.totalCreditsEarned || 0} TC
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-3xl font-black mt-2 leading-none">{selectedStudent.fullName}</h2>
                                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide">
                                            Lớp sinh hoạt: {selectedStudent.className || 'Chưa xếp lớp'} • Khoa: {selectedStudent.departmentName || 'Đang cập nhật'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 shrink-0 relative z-10 w-full md:w-auto justify-between md:justify-end border-t border-white/5 pt-4 md:pt-0 md:border-0">
                                    {studentTranscript && (
                                        <div className="flex gap-4 text-right">
                                            <div>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">GPA Hệ 4</span>
                                                <span className="text-xl font-black text-emerald-400">{studentTranscript.cumulativeGpa || '0.0'}</span>
                                            </div>
                                            <div className="border-l border-white/10 pl-4">
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">GPA Hệ 10</span>
                                                <span className="text-xl font-black text-teal-400">{studentTranscript.cumulativeGpa10 || '0.0'}</span>
                                            </div>
                                        </div>
                                    )}
                                    {isStaff && (
                                        <button
                                            onClick={() => setIsRegisterCourseModalOpen(true)}
                                            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-emerald-500/20"
                                        >
                                            <Plus size={14} /> Đăng ký môn học
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Transcript Edit Tables */}
                            {loadingStudentTranscript ? (
                                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                                    <Loader2 size={40} className="animate-spin mb-4 text-emerald-500" />
                                    <p className="font-black text-xs tracking-[0.2em] uppercase text-slate-300">Đang tải học bạ sinh viên...</p>
                                </div>
                            ) : studentTranscript?.semesters && studentTranscript.semesters.length > 0 ? (
                                studentTranscript.semesters.map((sem) => (
                                    <div key={sem.semesterId} className="bg-white rounded-[3rem] border border-slate-200/60 p-8 shadow-xl space-y-6">
                                        {/* Semester title and stats */}
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-600 border border-slate-200/60 flex items-center justify-center font-black text-xs">
                                                    HK
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-900 text-base leading-tight">{sem.semesterName}</h3>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{sem.semesterCode}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-right">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Tín chỉ HK</span>
                                                    <span className="text-sm font-black text-slate-800">{sem.semesterCredits}</span>
                                                </div>
                                                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-2 text-right">
                                                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest block">GPA học kỳ</span>
                                                    <span className="text-sm font-black text-emerald-600">{sem.semesterGpa}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Grid Table */}
                                        <div className="overflow-x-auto rounded-2xl border border-slate-200/60">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-wider text-center">
                                                        <th rowSpan="2" className="py-3 px-2 border-r border-slate-200 text-left min-w-[70px]">Mã HP</th>
                                                        <th rowSpan="2" className="py-3 px-2 border-r border-slate-200 text-left min-w-[200px]">Tên học phần</th>
                                                        <th rowSpan="2" className="py-3 px-2 border-r border-slate-200 text-center min-w-[40px]">Tc</th>
                                                        <th colSpan="2" className="py-2 px-2 border-r border-slate-200 text-center">Kiểm tra</th>
                                                        <th colSpan="2" className="py-2 px-2 border-r border-slate-200 text-center">Thái độ</th>
                                                        <th colSpan="2" className="py-2 px-2 border-r border-slate-200 text-center">Thực hành</th>
                                                        <th colSpan="2" className="py-2 px-2 border-r border-slate-200 text-center">Chuyên cần</th>
                                                        <th colSpan="2" className="py-2 px-2 border-r border-slate-200 text-center">Giữa HP</th>
                                                        <th colSpan="2" className="py-2 px-2 border-r border-slate-200 text-center">Tiểu luận</th>
                                                        <th colSpan="2" className="py-2 px-2 border-r border-slate-200 text-center">Thi</th>
                                                        <th colSpan="3" className="py-2 px-2 border-r border-slate-200 text-center">Tổng kết</th>
                                                        <th rowSpan="2" className="py-3 px-2 text-center min-w-[120px]">Thao tác</th>
                                                    </tr>
                                                    <tr className="border-b border-slate-200 bg-slate-50 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">
                                                        <th className="py-1.5 px-1 border-r border-slate-100">%</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-200">Đ</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-100">%</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-200">Đ</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-100">%</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-200">Đ</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-100">%</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-200">Đ</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-100">%</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-200">Đ</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-100">%</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-200">Đ</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-100">%</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-200">Đ</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-100 bg-slate-50/50">T10</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-100 bg-slate-50/50">T4</th>
                                                        <th className="py-1.5 px-1 border-r border-slate-200 bg-slate-50/50">Chữ</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {sem.courses.map((course) => {
                                                        const calculatedTotal = getRowCalculatedTotal(course);
                                                        const displayTotal = course.isFinalized ? course.totalScore : calculatedTotal;
                                                        const gradeInfo = getGradeInfo(displayTotal);
                                                        const isRowLocked = course.isFinalized;

                                                        return (
                                                            <tr key={course.registrationId} className="hover:bg-slate-50/50 transition-colors">
                                                                <td className="py-3 px-2 border-r border-slate-100 text-xs font-bold text-slate-600 uppercase">{course.classCode || course.courseCode}</td>
                                                                <td className="py-3 px-2 border-r border-slate-100 text-xs font-black text-slate-800 max-w-[200px] truncate">{course.courseName}</td>
                                                                <td className="py-3 px-2 border-r border-slate-100 text-xs font-black text-slate-700 text-center">{course.credits}</td>
                                                                
                                                                {/* Components Columns mapping */}
                                                                {renderComponentCell(course, 'kiemTra')}
                                                                {renderComponentCell(course, 'thaiDo')}
                                                                {renderComponentCell(course, 'thucHanh')}
                                                                {renderComponentCell(course, 'chuyenCan')}
                                                                {renderComponentCell(course, 'giuaKy')}
                                                                {renderComponentCell(course, 'tieuLuan')}
                                                                {renderComponentCell(course, 'thi')}

                                                                {/* Final Totals columns */}
                                                                <td className="py-3 px-1 border-r border-slate-100 text-center text-xs font-black text-slate-800 bg-slate-50/30">
                                                                    {displayTotal !== null ? displayTotal : '-'}
                                                                </td>
                                                                <td className="py-3 px-1 border-r border-slate-100 text-center text-xs font-black text-slate-500 bg-slate-50/30">
                                                                    {displayTotal !== null ? gradeInfo.gpa : '-'}
                                                                </td>
                                                                <td className={`py-3 px-1 border-r border-slate-200 text-center text-xs ${gradeInfo.color} bg-slate-50/30`}>
                                                                    {course.isFinalized ? course.letterGrade : gradeInfo.letter}
                                                                </td>

                                                                {/* Actions Column */}
                                                                <td className="py-3 px-2 text-center">
                                                                    {isRowLocked ? (
                                                                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                                                            <ShieldCheck size={10} /> Đã khóa
                                                                        </span>
                                                                    ) : (
                                                                        <div className="flex justify-center gap-1.5">
                                                                            <button
                                                                                onClick={() => handleSaveStudentCourseGrades(course, false)}
                                                                                disabled={savingGrades}
                                                                                title="Lưu điểm nháp"
                                                                                className="p-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg active:scale-90 transition-transform disabled:opacity-50"
                                                                            >
                                                                                <Save size={12} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleSaveStudentCourseGrades(course, true)}
                                                                                disabled={savingGrades}
                                                                                title="Khóa và Finalize học bạ"
                                                                                className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg active:scale-90 transition-transform disabled:opacity-50 shadow-md shadow-rose-500/10"
                                                                            >
                                                                                <Lock size={12} />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-2xl">
                                    <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-10 shadow-inner">
                                        <AlertCircle size={56} className="text-slate-200" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase mb-4">Chưa có kết quả học tập</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] max-w-xs text-center leading-relaxed">
                                        Sinh viên này hiện tại chưa đăng ký bất kỳ môn học nào trong chu kỳ đào tạo.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-xl text-center p-8 max-w-3xl">
                            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <Search size={36} />
                            </div>
                            <h4 className="text-base font-black text-slate-800 uppercase tracking-wide">Chưa chọn sinh viên</h4>
                            <p className="text-slate-500 text-xs mt-2 max-w-sm">
                                Vui lòng sử dụng ô tìm kiếm ở trên để tra cứu hồ sơ và tiến hành nhập điểm trực tiếp cho sinh viên.
                            </p>
                        </div>
                    )}

                    {/* Student Course Registration Modal */}
                    <RegisterStudentCourseModal
                        isOpen={isRegisterCourseModalOpen}
                        onClose={() => setIsRegisterCourseModalOpen(false)}
                        studentId={selectedStudent?.id}
                        studentName={selectedStudent?.fullName}
                        onSuccess={() => {
                            if (selectedStudent) {
                                fetchStudentTranscriptById(selectedStudent.id);
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default GradeManagementPage;
