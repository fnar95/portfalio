// Data Storage
let students = JSON.parse(localStorage.getItem('students')) || [];
let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
let activities = JSON.parse(localStorage.getItem('activities')) || [];
let classes = JSON.parse(localStorage.getItem('classes')) || [];

// Authentication
let isAdminLoggedIn = false;
let currentUserType = null;

// Admin password
const ADMIN_PASSWORD = 'admin123';

// Activity Points System
const activityPoints = {
    'مشروع': 5,
    'مبادرة': 3,
    'درس تطبيقي': 4,
    'موهبة': 4,
    'ورشة عمل': 3,
    'دورة تدريبية': 4
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Initialize application
function initializeApp() {
    // Show login screen by default
    showLoginScreen();
    
    // Add sample data if empty
    if (students.length === 0) {
        addSampleData();
    }
}

// Show login screen
function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('main-header').style.display = 'none';
    document.querySelector('.main').style.display = 'none';
}

// Hide login screen and show main app
function hideLoginScreen() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-header').style.display = 'block';
    document.querySelector('.main').style.display = 'block';
}

// Show student access (no password required)
function showStudentAccess() {
    currentUserType = 'student';
    isAdminLoggedIn = false;
    hideLoginScreen();
    setupStudentInterface();
    updateDashboard();
    renderAllTables();
    updateRankings();
}

// Show admin login modal
function showAdminLogin() {
    document.getElementById('admin-login-modal').classList.add('active');
}

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    
    if (password === ADMIN_PASSWORD) {
        currentUserType = 'admin';
        isAdminLoggedIn = true;
        closeModal('admin-login-modal');
        hideLoginScreen();
        setupAdminInterface();
        updateDashboard();
        renderAllTables();
        updateRankings();
        showNotification('تم تسجيل الدخول بنجاح', 'success');
    } else {
        showNotification('كلمة المرور غير صحيحة', 'error');
    }
}

// Setup admin interface
function setupAdminInterface() {
    // Show all navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.style.display = 'flex';
    });
    
    // Show admin sections
    document.querySelectorAll('[data-admin="true"]').forEach(element => {
        element.style.display = 'flex';
    });
}

// Setup student interface
function setupStudentInterface() {
    // Hide admin-only navigation buttons
    document.querySelectorAll('[data-admin="true"]').forEach(element => {
        element.style.display = 'none';
    });
    
    // Show only activities and rankings sections
    showSection('activities');
    document.querySelector('[data-section="activities"]').classList.add('active');
}

// Logout function
function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        isAdminLoggedIn = false;
        currentUserType = null;
        showLoginScreen();
        
        // Reset navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-section="dashboard"]').classList.add('active');
        
        showNotification('تم تسجيل الخروج بنج��ح', 'success');
    }
}

// Add sample data for demonstration
function addSampleData() {
    // Sample students
    const sampleStudents = [
        { id: 1, name: 'أحمد محمد', grade: 'الخامس الابتدائي', points: 0, activities: 0 },
        { id: 2, name: 'فاطمة علي', grade: 'الرابع الابتدائي', points: 0, activities: 0 },
        { id: 3, name: 'محمد سالم', grade: 'السادس الابتدائي', points: 0, activities: 0 }
    ];
    
    // Sample teachers
    const sampleTeachers = [
        { id: 1, name: 'أستاذ خالد أحمد', subject: 'الرياضيات', grade: 'الخامس الابتدائي', points: 0, activities: 0 },
        { id: 2, name: 'أستاذة سارة محمد', subject: 'اللغة العربية', grade: 'الرابع الابتدائي', points: 0, activities: 0 }
    ];
    
    // Sample classes
    const sampleClasses = [
        { id: 1, name: 'الصف الرابع أ', description: 'فصل اللغة العربية' },
        { id: 2, name: 'الصف الخامس ب', description: 'فصل الرياضيات' }
    ];
    
    students = sampleStudents;
    teachers = sampleTeachers;
    classes = sampleClasses;
    
    saveData();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            showSection(section);
            
            // Update active nav button
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Ranking tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            showRankingTab(tab);
            
            // Update active tab
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Forms
    document.getElementById('admin-login-form').addEventListener('submit', handleAdminLogin);
    document.getElementById('add-student-form').addEventListener('submit', handleAddStudent);
    document.getElementById('add-teacher-form').addEventListener('submit', handleAddTeacher);
    document.getElementById('add-class-form').addEventListener('submit', handleAddClass);
    document.getElementById('add-activity-form').addEventListener('submit', handleAddActivity);
    
    // Activity type change
    document.getElementById('activity-type').addEventListener('change', updateActivityPoints);
    document.getElementById('participant-type').addEventListener('change', updateParticipantOptions);
    
    // Filters
    document.getElementById('activity-filter-type').addEventListener('change', filterActivities);
    document.getElementById('activity-filter-status').addEventListener('change', filterActivities);
}

// Show section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Show ranking tab
function showRankingTab(tabId) {
    document.querySelectorAll('.ranking-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Update dashboard statistics
function updateDashboard() {
    document.getElementById('total-students').textContent = students.length;
    document.getElementById('total-teachers').textContent = teachers.length;
    document.getElementById('total-activities').textContent = activities.filter(a => a.status === 'approved').length;
    
    const totalPoints = [...students, ...teachers].reduce((sum, person) => sum + person.points, 0);
    document.getElementById('total-points').textContent = totalPoints;
    
    // Update top lists
    updateTopLists();
}

// Update top lists in dashboard
function updateTopLists() {
    const topStudents = [...students]
        .sort((a, b) => b.points - a.points)
        .slice(0, 5);
    
    const topTeachers = [...teachers]
        .sort((a, b) => b.points - a.points)
        .slice(0, 5);
    
    renderTopList('top-students', topStudents);
    renderTopList('top-teachers', topTeachers);
}

// Render top list
function renderTopList(containerId, items) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'top-item';
        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="rank">${index + 1}</span>
                <span>${item.name}</span>
            </div>
            <span class="points">${item.points} نقطة</span>
        `;
        container.appendChild(div);
    });
    
    if (items.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6c757d;">لا تو��د بيانات</p>';
    }
}

// Render all tables
function renderAllTables() {
    renderStudentsTable();
    renderTeachersTable();
    renderClassesTable();
    renderActivitiesTable();
}

// Render students table
function renderStudentsTable() {
    const tbody = document.getElementById('students-table');
    tbody.innerHTML = '';
    
    students.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.name}</td>
            <td>${student.grade}</td>
            <td><span class="points">${student.points} نقطة</span></td>
            <td>${student.activities} مشاركة</td>
            <td>
                ${isAdminLoggedIn ? `
                    <button class="btn btn-danger btn-small" onclick="deleteStudent(${student.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Render teachers table
function renderTeachersTable() {
    const tbody = document.getElementById('teachers-table');
    tbody.innerHTML = '';
    
    teachers.forEach(teacher => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${teacher.name}</td>
            <td>${teacher.subject}</td>
            <td>${teacher.grade}</td>
            <td><span class="points">${teacher.points} نقطة</span></td>
            <td>${teacher.activities} مشاركة</td>
            <td>
                ${isAdminLoggedIn ? `
                    <button class="btn btn-danger btn-small" onclick="deleteTeacher(${teacher.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Render classes table
function renderClassesTable() {
    const tbody = document.getElementById('classes-table');
    tbody.innerHTML = '';
    
    classes.forEach(classItem => {
        const classStudents = students.filter(s => s.grade === classItem.name);
        const totalPoints = classStudents.reduce((sum, s) => sum + s.points, 0);
        const totalActivities = classStudents.reduce((sum, s) => sum + s.activities, 0);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${classItem.name}</td>
            <td>${classStudents.length} طالب</td>
            <td>${classItem.description || 'لا يوجد وصف'}</td>
            <td><span class="points">${totalPoints} نقطة</span></td>
            <td>${totalActivities} مشاركة</td>
            <td>
                ${isAdminLoggedIn ? `
                    <button class="btn btn-danger btn-small" onclick="deleteClass(${classItem.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Render activities table
function renderActivitiesTable() {
    const tbody = document.getElementById('activities-table');
    tbody.innerHTML = '';
    
    let filteredActivities = [...activities];
    
    // Apply filters
    const typeFilter = document.getElementById('activity-filter-type').value;
    const statusFilter = document.getElementById('activity-filter-status').value;
    
    if (typeFilter) {
        filteredActivities = filteredActivities.filter(a => a.type === typeFilter);
    }
    
    if (statusFilter) {
        filteredActivities = filteredActivities.filter(a => a.status === statusFilter);
    }
    
    filteredActivities.forEach(activity => {
        const participant = activity.participantType === 'student' 
            ? students.find(s => s.id === activity.participantId)
            : teachers.find(t => t.id === activity.participantId);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${activity.title}</td>
            <td>${activity.type}</td>
            <td>${participant ? participant.name : 'غير محدد'}</td>
            <td>${activity.points} نقطة</td>
            <td>${new Date(activity.date).toLocaleDateString('ar-SA')}</td>
            <td><span class="status-badge status-${activity.status}">${getStatusText(activity.status)}</span></td>
            <td>
                ${isAdminLoggedIn && activity.status === 'pending' ? `
                    <button class="btn btn-success btn-small" onclick="approveActivity(${activity.id})">
                        <i class="fas fa-check"></i> اعتماد
                    </button>
                    <button class="btn btn-danger btn-small" onclick="rejectActivity(${activity.id})">
                        <i class="fas fa-times"></i> رفض
                    </button>
                ` : isAdminLoggedIn ? `
                    <button class="btn btn-danger btn-small" onclick="deleteActivity(${activity.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Get status text
function getStatusText(status) {
    const statusTexts = {
        'pending': 'في انتظار الموافقة',
        'approved': 'معتمد',
        'rejected': 'مرفوض'
    };
    return statusTexts[status] || status;
}

// Update rankings
function updateRankings() {
    updateStudentsRanking();
    updateTeachersRanking();
    updateClassesRanking();
}

// Update students ranking
function updateStudentsRanking() {
    const sortedStudents = [...students].sort((a, b) => b.points - a.points);
    const container = document.getElementById('students-ranking-list');
    container.innerHTML = '';
    
    sortedStudents.forEach((student, index) => {
        const div = document.createElement('div');
        div.className = `ranking-item ${getRankingClass(index)}`;
        div.innerHTML = `
            <div class="ranking-info">
                <div class="ranking-rank">${index + 1}</div>
                <div class="ranking-details">
                    <h4>${student.name}</h4>
                    <p>${student.grade} - ${student.activities} مشاركة</p>
                </div>
            </div>
            <div class="ranking-points">${student.points} نقطة</div>
        `;
        container.appendChild(div);
    });
}

// Update teachers ranking
function updateTeachersRanking() {
    const sortedTeachers = [...teachers].sort((a, b) => b.points - a.points);
    const container = document.getElementById('teachers-ranking-list');
    container.innerHTML = '';
    
    sortedTeachers.forEach((teacher, index) => {
        const div = document.createElement('div');
        div.className = `ranking-item ${getRankingClass(index)}`;
        div.innerHTML = `
            <div class="ranking-info">
                <div class="ranking-rank">${index + 1}</div>
                <div class="ranking-details">
                    <h4>${teacher.name}</h4>
                    <p>${teacher.subject} - ${teacher.grade} - ${teacher.activities} مشاركة</p>
                </div>
            </div>
            <div class="ranking-points">${teacher.points} نقطة</div>
        `;
        container.appendChild(div);
    });
}

// Update classes ranking
function updateClassesRanking() {
    const classStats = {};
    
    // Calculate points for each class
    classes.forEach(classItem => {
        const classStudents = students.filter(s => s.grade === classItem.name);
        const totalPoints = classStudents.reduce((sum, s) => sum + s.points, 0);
        const totalActivities = classStudents.reduce((sum, s) => sum + s.activities, 0);
        
        classStats[classItem.id] = {
            name: classItem.name,
            points: totalPoints,
            students: classStudents.length,
            activities: totalActivities
        };
    });
    
    const sortedClasses = Object.values(classStats).sort((a, b) => b.points - a.points);
    const container = document.getElementById('classes-ranking-list');
    container.innerHTML = '';
    
    sortedClasses.forEach((classData, index) => {
        const div = document.createElement('div');
        div.className = `ranking-item ${getRankingClass(index)}`;
        div.innerHTML = `
            <div class="ranking-info">
                <div class="ranking-rank">${index + 1}</div>
                <div class="ranking-details">
                    <h4>${classData.name}</h4>
                    <p>${classData.students} طالب - ${classData.activities} مشاركة</p>
                </div>
            </div>
            <div class="ranking-points">${classData.points} نقطة</div>
        `;
        container.appendChild(div);
    });
}

// Get ranking class for styling
function getRankingClass(index) {
    if (index === 0) return 'gold';
    if (index === 1) return 'silver';
    if (index === 2) return 'bronze';
    return '';
}

// Update class options in dropdowns
function updateClassOptions() {
    const studentGradeSelect = document.getElementById('student-grade');
    const teacherGradeSelect = document.getElementById('teacher-grade');
    
    // Clear existing options (except the first one)
    studentGradeSelect.innerHTML = '<option value="">اختر الصف</option>';
    teacherGradeSelect.innerHTML = '<option value="">اختر الصف</option>';
    
    // Add classes to both dropdowns
    classes.forEach(classItem => {
        const studentOption = document.createElement('option');
        studentOption.value = classItem.name;
        studentOption.textContent = classItem.name;
        studentGradeSelect.appendChild(studentOption);
        
        const teacherOption = document.createElement('option');
        teacherOption.value = classItem.name;
        teacherOption.textContent = classItem.name;
        teacherGradeSelect.appendChild(teacherOption);
    });
}

// Modal functions
function showAddStudentModal() {
    if (!isAdminLoggedIn) {
        showNotification('يجب تسجيل الدخول كمدير للوصول لهذه الميزة', 'error');
        return;
    }
    updateClassOptions();
    document.getElementById('add-student-modal').classList.add('active');
}

function showAddTeacherModal() {
    if (!isAdminLoggedIn) {
        showNotification('يجب تسجيل الدخول كمدير للوصول لهذه الميزة', 'error');
        return;
    }
    updateClassOptions();
    document.getElementById('add-teacher-modal').classList.add('active');
}

function showAddClassModal() {
    if (!isAdminLoggedIn) {
        showNotification('يجب تسجيل الدخول كمدير للوصول لهذه الميزة', 'error');
        return;
    }
    
    document.getElementById('add-class-modal').classList.add('active');
}

function showAddActivityModal() {
    document.getElementById('add-activity-modal').classList.add('active');
    updateParticipantOptions();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    // Reset forms
    document.querySelectorAll('form').forEach(form => form.reset());
}

// Handle add student
function handleAddStudent(e) {
    e.preventDefault();
    
    const name = document.getElementById('student-name').value;
    const grade = document.getElementById('student-grade').value;
    
    const newStudent = {
        id: Date.now(),
        name,
        grade,
        points: 0,
        activities: 0
    };
    
    students.push(newStudent);
    saveData();
    renderStudentsTable();
    updateDashboard();
    updateRankings();
    closeModal('add-student-modal');
    
    showNotification('تم إضافة الطالب بنجاح', 'success');
}

// Handle add teacher
function handleAddTeacher(e) {
    e.preventDefault();
    
    const name = document.getElementById('teacher-name').value;
    const subject = document.getElementById('teacher-subject').value;
    const grade = document.getElementById('teacher-grade').value;
    
    const newTeacher = {
        id: Date.now(),
        name,
        subject,
        grade,
        points: 0,
        activities: 0
    };
    
    teachers.push(newTeacher);
    saveData();
    renderTeachersTable();
    updateDashboard();
    updateRankings();
    closeModal('add-teacher-modal');
    
    showNotification('تم إضافة المعلم بنجاح', 'success');
}

// Handle add class
function handleAddClass(e) {
    e.preventDefault();
    
    const name = document.getElementById('class-name').value;
    const description = document.getElementById('class-description').value;
    
    const newClass = {
        id: Date.now(),
        name,
        description
    };
    
    classes.push(newClass);
    saveData();
    renderClassesTable();
    updateRankings();
    closeModal('add-class-modal');
    
    showNotification('تم إضافة الفصل بنجاح', 'success');
}

// Handle add activity
function handleAddActivity(e) {
    e.preventDefault();
    
    const title = document.getElementById('activity-title').value;
    const type = document.getElementById('activity-type').value;
    const participantType = document.getElementById('participant-type').value;
    const participantId = parseInt(document.getElementById('participant-id').value);
    const description = document.getElementById('activity-description').value;
    const points = parseInt(document.getElementById('activity-points').value);
    
    const newActivity = {
        id: Date.now(),
        title,
        type,
        participantType,
        participantId,
        description,
        points,
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    activities.push(newActivity);
    saveData();
    renderActivitiesTable();
    updateDashboard();
    closeModal('add-activity-modal');
    
    showNotification('تم إضافة المشاركة بنجاح وهي في انتظار الموافقة', 'success');
}

// Update activity points based on type
function updateActivityPoints() {
    const type = document.getElementById('activity-type').value;
    const pointsInput = document.getElementById('activity-points');
    
    if (type && activityPoints[type]) {
        pointsInput.value = activityPoints[type];
    } else {
        pointsInput.value = '';
    }
}

// Update participant options based on type
function updateParticipantOptions() {
    const participantType = document.getElementById('participant-type').value;
    const participantSelect = document.getElementById('participant-id');
    
    participantSelect.innerHTML = '<option value="">اختر المشارك</option>';
    
    if (participantType === 'student') {
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.name;
            participantSelect.appendChild(option);
        });
    } else if (participantType === 'teacher') {
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.id;
            option.textContent = teacher.name;
            participantSelect.appendChild(option);
        });
    }
}

// Approve activity
function approveActivity(activityId) {
    if (!isAdminLoggedIn) {
        showNotification('يجب تسجيل الدخول كمدير للوصول لهذه الميزة', 'error');
        return;
    }
    
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
        activity.status = 'approved';
        
        // Add points to participant
        if (activity.participantType === 'student') {
            const student = students.find(s => s.id === activity.participantId);
            if (student) {
                student.points += activity.points;
                student.activities += 1;
            }
        } else if (activity.participantType === 'teacher') {
            const teacher = teachers.find(t => t.id === activity.participantId);
            if (teacher) {
                teacher.points += activity.points;
                teacher.activities += 1;
            }
        }
        
        saveData();
        renderAllTables();
        updateDashboard();
        updateRankings();
        
        showNotification('تم اعتماد المشاركة بنجاح', 'success');
    }
}

// Reject activity
function rejectActivity(activityId) {
    if (!isAdminLoggedIn) {
        showNotification('يجب تسجيل الدخول كمدير للوصول لهذه الميزة', 'error');
        return;
    }
    
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
        activity.status = 'rejected';
        
        saveData();
        renderActivitiesTable();
        
        showNotification('تم رفض المشاركة', 'warning');
    }
}

// Delete functions
function deleteStudent(studentId) {
    if (!isAdminLoggedIn) {
        showNotification('يجب تسجيل الدخول كمدير للوصول لهذه الميزة', 'error');
        return;
    }
    
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
        students = students.filter(s => s.id !== studentId);
        // Remove related activities
        activities = activities.filter(a => !(a.participantType === 'student' && a.participantId === studentId));
        
        saveData();
        renderAllTables();
        updateDashboard();
        updateRankings();
        
        showNotification('تم حذف الطالب بنجاح', 'success');
    }
}

function deleteTeacher(teacherId) {
    if (!isAdminLoggedIn) {
        showNotification('يجب تسجيل الدخول كمدير للوصول لهذه الميزة', 'error');
        return;
    }
    
    if (confirm('هل أنت متأكد من حذف هذا المعلم؟')) {
        teachers = teachers.filter(t => t.id !== teacherId);
        // Remove related activities
        activities = activities.filter(a => !(a.participantType === 'teacher' && a.participantId === teacherId));
        // Update classes
        classes.forEach(c => {
            if (c.teacherId === teacherId) {
                c.teacherId = null;
            }
        });
        
        saveData();
        renderAllTables();
        updateDashboard();
        updateRankings();
        
        showNotification('تم حذف المعلم بنجاح', 'success');
    }
}

function deleteClass(classId) {
    if (!isAdminLoggedIn) {
        showNotification('يجب تسجيل الدخول كمدير للوصول لهذه الميزة', 'error');
        return;
    }
    
    if (confirm('هل أنت متأكد من حذف هذا الفصل؟')) {
        classes = classes.filter(c => c.id !== classId);
        
        saveData();
        renderClassesTable();
        updateRankings();
        
        showNotification('تم حذف الفصل بنجاح', 'success');
    }
}

function deleteActivity(activityId) {
    if (!isAdminLoggedIn) {
        showNotification('يجب تسجيل الدخول كمدير للوصول لهذه الميزة', 'error');
        return;
    }
    
    if (confirm('هل أنت متأكد من حذف هذه المشاركة؟')) {
        const activity = activities.find(a => a.id === activityId);
        
        // If activity was approved, subtract points
        if (activity && activity.status === 'approved') {
            if (activity.participantType === 'student') {
                const student = students.find(s => s.id === activity.participantId);
                if (student) {
                    student.points -= activity.points;
                    student.activities -= 1;
                }
            } else if (activity.participantType === 'teacher') {
                const teacher = teachers.find(t => t.id === activity.participantId);
                if (teacher) {
                    teacher.points -= activity.points;
                    teacher.activities -= 1;
                }
            }
        }
        
        activities = activities.filter(a => a.id !== activityId);
        
        saveData();
        renderAllTables();
        updateDashboard();
        updateRankings();
        
        showNotification('تم حذف المشاركة بنجاح', 'success');
    }
}

// Filter activities
function filterActivities() {
    renderActivitiesTable();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('teachers', JSON.stringify(teachers));
    localStorage.setItem('activities', JSON.stringify(activities));
    localStorage.setItem('classes', JSON.stringify(classes));
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: ${type === 'warning' ? '#212529' : 'white'};
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease-in-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});