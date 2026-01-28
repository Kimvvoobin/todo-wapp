// ===== Firebase 설정 =====
// TODO: Firebase 프로젝트 설정 정보를 입력하세요
const firebaseConfig = {
    apiKey: "AIzaSyCCkiPa5kmQpQDDrwsHpdacMq1FiCzAODg",
    authDomain: "todo-wapp-25c3b.firebaseapp.com",
    projectId: "todo-wapp-25c3b",
    storageBucket: "todo-wapp-25c3b.firebasestorage.app",
    messagingSenderId: "259122737816",
    appId: "1:259122737816:web:7a6bafe31d21bcc492d6ed"
};

// Firebase 초기화 (설정이 완료된 경우에만)
let db = null;
let todosCollection = null;
let firebaseInitialized = false;

try {
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        todosCollection = db.collection('todos');
        firebaseInitialized = true;
        console.log('Firebase 초기화 완료');
    }
} catch (error) {
    console.warn('Firebase 초기화 실패, LocalStorage만 사용합니다:', error);
}

// ===== 전역 변수 =====
let todos = [];
let currentFilter = 'all';
let editingTodoId = null;

// ===== DOM 요소 =====
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const themeToggle = document.getElementById('themeToggle');
const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    loadTodos();
    setupEventListeners();
    
    // Firebase 실시간 리스너 설정
    if (firebaseInitialized) {
        setupFirebaseListener();
    }
});

// ===== 이벤트 리스너 설정 =====
function setupEventListeners() {
    // TODO 추가
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // 필터 버튼
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            setFilter(filter);
        });
    });

    // 액션 버튼
    clearCompletedBtn.addEventListener('click', clearCompleted);
    clearAllBtn.addEventListener('click', clearAll);

    // 다크 모드 토글
    themeToggle.addEventListener('click', toggleTheme);

    // 모달 이벤트
    saveEditBtn.addEventListener('click', saveEdit);
    cancelEditBtn.addEventListener('click', closeEditModal);
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        } else if (e.key === 'Escape') {
            closeEditModal();
        }
    });

    // 모달 배경 클릭 시 닫기
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
}

// ===== TODO 추가 =====
async function addTodo() {
    const text = todoInput.value.trim();
    
    if (!text) {
        return;
    }

    const newTodo = {
        id: generateId(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    todoInput.value = '';
    
    // Firebase에 저장
    if (firebaseInitialized) {
        try {
            await todosCollection.add(newTodo);
        } catch (error) {
            console.error('Firebase 저장 실패:', error);
            saveToLocalStorage();
        }
    } else {
        saveToLocalStorage();
    }

    renderTodos();
    updateStats();
}

// ===== TODO 완료 토글 =====
async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    todo.completed = !todo.completed;

    // Firebase 업데이트
    if (firebaseInitialized) {
        try {
            const doc = await todosCollection.where('id', '==', id).get();
            if (!doc.empty) {
                await doc.docs[0].ref.update({ completed: todo.completed });
            }
        } catch (error) {
            console.error('Firebase 업데이트 실패:', error);
            saveToLocalStorage();
        }
    } else {
        saveToLocalStorage();
    }

    renderTodos();
    updateStats();
}

// ===== TODO 수정 =====
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    editingTodoId = id;
    editInput.value = todo.text;
    editModal.classList.add('show');
    editInput.focus();
    editInput.select();
}

async function saveEdit() {
    if (!editingTodoId) return;

    const text = editInput.value.trim();
    if (!text) {
        alert('할 일을 입력해주세요.');
        return;
    }

    const todo = todos.find(t => t.id === editingTodoId);
    if (todo) {
        todo.text = text;

        // Firebase 업데이트
        if (firebaseInitialized) {
            try {
                const doc = await todosCollection.where('id', '==', editingTodoId).get();
                if (!doc.empty) {
                    await doc.docs[0].ref.update({ text: text });
                }
            } catch (error) {
                console.error('Firebase 업데이트 실패:', error);
                saveToLocalStorage();
            }
        } else {
            saveToLocalStorage();
        }

        renderTodos();
    }

    closeEditModal();
}

function closeEditModal() {
    editModal.classList.remove('show');
    editingTodoId = null;
    editInput.value = '';
}

// ===== TODO 삭제 =====
async function deleteTodo(id) {
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }

    // Firebase에서 삭제
    if (firebaseInitialized) {
        try {
            const doc = await todosCollection.where('id', '==', id).get();
            if (!doc.empty) {
                await doc.docs[0].ref.delete();
            }
        } catch (error) {
            console.error('Firebase 삭제 실패:', error);
        }
    }

    todos = todos.filter(t => t.id !== id);
    saveToLocalStorage();
    renderTodos();
    updateStats();
}

// ===== 필터링 =====
function setFilter(filter) {
    currentFilter = filter;
    
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderTodos();
}

function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

// ===== TODO 렌더링 =====
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    todoList.innerHTML = '';
    
    if (filteredTodos.length === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
        
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', todo.id);
            
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    aria-label="완료 상태 토글"
                >
                <span class="todo-text" aria-label="할 일: ${todo.text}">${escapeHtml(todo.text)}</span>
                <div class="todo-actions">
                    <button class="todo-btn edit-btn" aria-label="수정">수정</button>
                    <button class="todo-btn delete-btn" aria-label="삭제">삭제</button>
                </div>
            `;
            
            // 이벤트 리스너
            const checkbox = li.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => toggleTodo(todo.id));
            
            const text = li.querySelector('.todo-text');
            text.addEventListener('click', () => editTodo(todo.id));
            
            const editBtn = li.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => editTodo(todo.id));
            
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
            
            todoList.appendChild(li);
        });
    }
}

// ===== 통계 업데이트 =====
function updateStats() {
    const total = todos.length;
    const active = todos.filter(t => !t.completed).length;
    const completed = todos.filter(t => t.completed).length;
    
    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
}

// ===== 전체 삭제 =====
async function clearAll() {
    if (!confirm('모든 할 일을 삭제하시겠습니까?')) {
        return;
    }

    // Firebase에서 모두 삭제
    if (firebaseInitialized) {
        try {
            const snapshot = await todosCollection.get();
            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        } catch (error) {
            console.error('Firebase 삭제 실패:', error);
        }
    }

    todos = [];
    saveToLocalStorage();
    renderTodos();
    updateStats();
}

// ===== 완료 항목 삭제 =====
async function clearCompleted() {
    const completedTodos = todos.filter(t => t.completed);
    
    if (completedTodos.length === 0) {
        alert('완료된 할 일이 없습니다.');
        return;
    }

    if (!confirm(`완료된 ${completedTodos.length}개의 할 일을 삭제하시겠습니까?`)) {
        return;
    }

    // Firebase에서 완료된 항목 삭제
    if (firebaseInitialized) {
        try {
            const completedIds = completedTodos.map(t => t.id);
            const snapshot = await todosCollection.where('id', 'in', completedIds).get();
            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        } catch (error) {
            console.error('Firebase 삭제 실패:', error);
        }
    }

    todos = todos.filter(t => !t.completed);
    saveToLocalStorage();
    renderTodos();
    updateStats();
}

// ===== 데이터 로드 =====
async function loadTodos() {
    // Firebase에서 로드 시도
    if (firebaseInitialized) {
        try {
            const snapshot = await todosCollection.orderBy('createdAt', 'desc').get();
            todos = snapshot.docs.map(doc => doc.data());
            saveToLocalStorage(); // LocalStorage에도 백업
        } catch (error) {
            console.error('Firebase 로드 실패, LocalStorage에서 로드:', error);
            loadFromLocalStorage();
        }
    } else {
        loadFromLocalStorage();
    }

    renderTodos();
    updateStats();
}

// ===== Firebase 실시간 리스너 =====
function setupFirebaseListener() {
    todosCollection.orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
        const changes = snapshot.docChanges();
        
        changes.forEach(change => {
            const todoData = change.doc.data();
            
            if (change.type === 'added') {
                // 중복 체크
                if (!todos.find(t => t.id === todoData.id)) {
                    todos.push(todoData);
                }
            } else if (change.type === 'modified') {
                const index = todos.findIndex(t => t.id === todoData.id);
                if (index !== -1) {
                    todos[index] = todoData;
                }
            } else if (change.type === 'removed') {
                todos = todos.filter(t => t.id !== todoData.id);
            }
        });

        // createdAt 기준 정렬
        todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        renderTodos();
        updateStats();
        saveToLocalStorage(); // LocalStorage에도 동기화
    }, (error) => {
        console.error('Firebase 리스너 오류:', error);
    });
}

// ===== LocalStorage 관리 =====
function saveToLocalStorage() {
    try {
        localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
        console.error('LocalStorage 저장 실패:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const stored = localStorage.getItem('todos');
        if (stored) {
            todos = JSON.parse(stored);
        }
    } catch (error) {
        console.error('LocalStorage 로드 실패:', error);
        todos = [];
    }
}

// ===== 다크 모드 =====
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = themeToggle.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// ===== 유틸리티 함수 =====
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
