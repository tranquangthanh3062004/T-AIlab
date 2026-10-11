export type Language = 'vi' | 'en';

export const translations = {
  vi: {
    // Brand & Header
    brandTitle: 'CHINAI',
    brandTag: 'Hệ Điều Hành Học Tập AI',
    learnMode: 'Chế độ Học (Learn)',
    engineerMode: 'Kỹ sư IDE (Workspace)',
    navHome: 'Tổng quan',
    navCurriculum: 'Lộ trình học',
    navDiagnostic: 'Đánh giá năng lực',
    navIde: 'Kỹ sư IDE',
    navDatasets: 'Dữ liệu & Runs',
    navNews: 'Radar Tin tức AI',
    navTutor: 'Trợ lý AI Tutor',
    streakLabel: 'ngày',
    xpLabel: 'XP',
    levelLabel: 'Cấp',
    langToggle: 'Tiếng Việt',

    // Home View
    heroBadge: 'CHINAI · Hệ điều hành Học tập & Kỹ thuật AI',
    heroHeading: 'Học AI từ số 0. Xây dựng hệ thống thực chiến. Bám sát nghiên cứu.',
    heroSubheading: 'Nền tảng đào tạo AI chuẩn mực: Kết hợp trực giác mô phỏng 2D, môi trường lập trình Monaco IDE có sandbox an toàn, và radar tin tức công bố khoa học xác thực từ arXiv, DeepMind, OpenAI.',
    btnContinueLearning: 'Tiếp tục bài học',
    btnOpenIde: 'Mở Engineer IDE',
    btnTakeDiagnostic: 'Làm bài Đánh giá 2 phút',
    
    // Gamification
    streakTitle: 'Chuỗi ngày học liên tục',
    streakKeep: 'Học hôm nay để giữ chuỗi!',
    dailyGoalTitle: 'Mục tiêu kinh nghiệm hôm nay',
    dailyGoalTotal: 'Tổng tích lũy',
    levelTitle: 'Cấp độ học viên',
    curriculumProgressTitle: 'Tiến độ 7 Lộ trình',
    completedLabel: 'Đã hoàn thành',
    recommendedNext: 'Đề xuất bài học tiếp theo',
    resumeLessonBtn: 'Học tiếp bài này',
    badgesTitle: 'Huy hiệu Danh dự Đã Mở Khóa',

    // 3 Pillars
    pillarsTitle: 'Ba Trụ Cột Nền Tảng của CHINAI',
    pillar1Title: 'Lộ Trình Đào Tạo AI Cấu Trúc (7 Tracks)',
    pillar1Desc: 'Đi từ nền tảng trực quan, Python tính toán, toán học tối ưu đến Classical ML, Deep Learning, LLM Engineering và MLOps phục vụ sản xuất.',
    pillar1Action: 'Khám phá 7 Lộ trình Syllabus →',
    pillar2Title: 'Không Gian Kỹ Sư Monaco IDE',
    pillar2Desc: 'Môi trường code đa file với isolated Python sandbox bảo mật AST, kiểm tra phân phối dữ liệu CSV và đo lường siêu tham số thử nghiệm.',
    pillar2Action: 'Khởi chạy Monaco Workspace →',
    pillar3Title: 'Radar Tin Tức AI Xác Thực',
    pillar3Desc: 'Cập nhật nghiên cứu mới nhất từ arXiv, OpenAI, Google DeepMind và Hugging Face. Khử trùng lặp qua SHA-256 và tóm tắt có trích dẫn khoa học.',
    pillar3Action: 'Xem Radar Tin tức Xác thực →',

    // Learn & Lesson
    curriculumHeading: 'Chương Trình Học Tập AI Cấu Trúc',
    curriculumSubheading: 'Tiến bộ vững chắc từ người mới bắt đầu đến kỹ sư AI sản xuất thực thụ. Mỗi bài học kết hợp giữa trực giác tư duy, mô hình tương tác thời gian thực, bài tập lập trình sandbox có kiểm thử tự động và trắc nghiệm củng cố.',
    hoursLabel: 'Giờ học',
    backToCurriculum: 'Quay lại Lộ trình học',
    lessonObjectives: 'Mục Tiêu Bài Học Trọng Tâm',
    section1Intuition: '1. Ý Niệm Trực Quan & Mô Hình Tư Duy (Mental Model)',
    section2Formal: '2. Công Thức & Giải Nghĩa Từng Ký Hiệu',
    section3Code: '3. Ví Dụ Minh Họa Mã Nguồn Hoạt Động',
    section4Misconceptions: '4. Những Sai Lầm Thường Gặp (Misconceptions)',
    section5Exercise: '5. Thực Hành Lập Trình Sandbox (+30 XP)',
    section6Quiz: '6. Kiểm Tra Đánh Giá Kiến Thức (Quiz)',
    runAndVerify: 'Chạy & Kiểm thử Sandbox',
    verifyingCode: 'Đang xác minh trong Sandbox...',
    loadSolution: 'Tải Lời giải Mẫu',
    submitQuizBtn: 'Nộp Bài Trắc Nghiệm & Ghi Nhận Điểm',
    lessonSummary: 'Tóm Tắt Bài Học',
    nextLessonBtn: 'Bài Học Kế Tiếp',
    minuteRead: 'phút học',

    // Formula Guide
    formulaCardTitle: 'Công Thức Toán Học & Bảng Ký Hiệu Trực Quan',
    formulaMeaningTitle: 'Ý nghĩa công thức:',
    formulaSymbolsTitle: 'Bảng giải nghĩa chi tiết từng ký hiệu:',
    formulaWalkthroughTitle: 'Ví dụ tính toán bằng số cụ thể:',

    // Workspace
    workspaceTitle: 'Không Gian Lập Trình Monaco Sandbox',
    workspaceSubtitle: 'Python 3.13 Isolated Sandbox với AST Security Visitor',
    saveBtn: 'Lưu File',
    runSandboxBtn: 'Chạy trong Sandbox',
    terminalOutput: 'Kết quả Đầu ra Terminal',
    terminalClear: 'Xóa màn hình',
    aiAssistantTitle: 'Trợ Lý Kỹ Sư AI',
    explorerTitle: 'Tập tin Dự án',
    newFilePlaceholder: 'ten_file.py hoac data.csv',

    // News
    newsTitle: 'Radar Tin Tức AI & Nghiên Cứu Xác Thực',
    newsSubtitle: 'Thu thập liên tục từ các bài báo arXiv, phòng thí nghiệm OpenAI, DeepMind và mô hình mã nguồn mở Hugging Face.',
    pollFeedsBtn: 'Quét Nguồn Cập Nhật',
    pollingFeeds: 'Đang kết nối RSS upstream...',
    searchNewsPlaceholder: 'Tìm kiếm nghiên cứu, mô hình, tác giả...',
    bookmarkOnlyLabel: 'Đã lưu',
    categoryAll: 'Tất cả chủ đề',

    // Tutor
    tutorTitle: 'Trợ Lý AI Gia Sư CHINAI',
    tutorSubtitle: 'Mọi câu trả lời được neo chắc chắn vào 7 Lộ trình học và công bố khoa học xác thực với trích dẫn minh bạch.',
    tutorPlaceholder: 'Đặt câu hỏi về Gradient Descent, Overfitting, Vector Embeddings...',
    sendBtn: 'Gửi'
  },
  en: {
    // Brand & Header
    brandTitle: 'CHINAI',
    brandTag: 'AI Learning Operating System',
    learnMode: 'Learn Mode',
    engineerMode: 'Engineer Workspace',
    navHome: 'Overview',
    navCurriculum: 'Curriculum',
    navDiagnostic: 'Diagnostic',
    navIde: 'IDE',
    navDatasets: 'Datasets & Runs',
    navNews: 'News Radar',
    navTutor: 'AI Tutor',
    streakLabel: 'days',
    xpLabel: 'XP',
    levelLabel: 'Lvl',
    langToggle: 'English',

    // Home View
    heroBadge: 'CHINAI · AI Learning Operating System',
    heroHeading: 'Learn AI from Zero. Build Real Systems. Stay Grounded in Research.',
    heroSubheading: 'A unified learning platform uniting structured foundational curricula, a professional Monaco IDE with isolated sandboxed execution, and source-grounded research intelligence.',
    btnContinueLearning: 'Continue Learning',
    btnOpenIde: 'Open Engineer IDE',
    btnTakeDiagnostic: 'Take 2-Min Diagnostic',

    // Gamification
    streakTitle: 'Learning Day Streak',
    streakKeep: 'Learn today to keep your streak!',
    dailyGoalTitle: "Today's XP Goal",
    dailyGoalTotal: 'Total accumulated',
    levelTitle: 'Learner Tier',
    curriculumProgressTitle: '7 Tracks Progress',
    completedLabel: 'Completed',
    recommendedNext: 'Recommended Next Lesson',
    resumeLessonBtn: 'Resume Lesson',
    badgesTitle: 'Earned Honor Badges',

    // 3 Pillars
    pillarsTitle: 'Three Core Pillars of CHINAI',
    pillar1Title: 'Structured AI Curriculum (7 Tracks)',
    pillar1Desc: 'From visual intuition and numerical computing to classical ML, deep neural nets, LLM engineering, and production MLOps.',
    pillar1Action: 'Explore 7 Syllabus Tracks →',
    pillar2Title: 'Engineer Monaco IDE Workspace',
    pillar2Desc: 'Multi-panel project editor, isolated Python sandbox runner with AST security, CSV dataset inspection, and experiment tracking.',
    pillar2Action: 'Launch Monaco Workspace →',
    pillar3Title: 'Verified AI News Radar',
    pillar3Desc: 'Real-time peer preprints and official lab publications from arXiv, OpenAI, DeepMind, and Hugging Face with verifiable citations.',
    pillar3Action: 'View Verified Research Signals →',

    // Learn & Lesson
    curriculumHeading: 'Structured AI Learning Tracks',
    curriculumSubheading: 'Progress from complete beginner to production AI engineer. Every lesson features intuitive mental models, interactive visual sandboxes, verified code exercises, and knowledge checks.',
    hoursLabel: 'Hours',
    backToCurriculum: 'Back to Curriculum',
    lessonObjectives: 'Key Learning Objectives',
    section1Intuition: '1. Intuitive Mental Model',
    section2Formal: '2. Mathematical Formulation & Symbol Breakdown',
    section3Code: '3. Worked Code Demonstration',
    section4Misconceptions: '4. Common Misconceptions',
    section5Exercise: '5. Practical Sandbox Exercise (+30 XP)',
    section6Quiz: '6. Knowledge Check Assessment',
    runAndVerify: 'Run & Verify',
    verifyingCode: 'Verifying in Sandbox...',
    loadSolution: 'Load Solution',
    submitQuizBtn: 'Submit Answers & Check Mastery',
    lessonSummary: 'Lesson Summary',
    nextLessonBtn: 'Next Lesson',
    minuteRead: 'min read',

    // Formula Guide
    formulaCardTitle: 'Mathematical Formula & Symbol Notation Guide',
    formulaMeaningTitle: 'Formula Objective:',
    formulaSymbolsTitle: 'Detailed Symbol-by-Symbol Breakdown:',
    formulaWalkthroughTitle: 'Step-by-Step Numerical Walkthrough:',

    // Workspace
    workspaceTitle: 'Monaco Engineering Workspace',
    workspaceSubtitle: 'Python 3.13 Isolated Sandbox with AST Security Scanner',
    saveBtn: 'Save File',
    runSandboxBtn: 'Run in Sandbox',
    terminalOutput: 'Terminal Output',
    terminalClear: 'Clear Console',
    aiAssistantTitle: 'Workspace AI Assistant',
    explorerTitle: 'Project Files',
    newFilePlaceholder: 'filename.py or data.csv',

    // News
    newsTitle: 'AI News Radar & Research Signals',
    newsSubtitle: 'Continuously ingested from arXiv preprints, OpenAI, Google DeepMind, and Hugging Face official releases.',
    pollFeedsBtn: 'Poll Live Feeds',
    pollingFeeds: 'Connecting upstream feeds...',
    searchNewsPlaceholder: 'Search papers, models, authors...',
    bookmarkOnlyLabel: 'Saved Only',
    categoryAll: 'All Categories',

    // Tutor
    tutorTitle: 'CHINAI Knowledge Tutor',
    tutorSubtitle: 'Strictly grounded in platform syllabus lessons and verified research records with verifiable citations.',
    tutorPlaceholder: 'Ask anything about Gradient Descent, Overfitting, Vector Embeddings...',
    sendBtn: 'Send'
  }
};
