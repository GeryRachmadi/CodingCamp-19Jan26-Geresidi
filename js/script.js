/* =========================================
   State Management
   ========================================= */
// Retrieve todos from LocalStorage or initialize empty array
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';
let currentSort = 'date-asc';
let isEditing = false;

/* =========================================
   DOM Elements
   ========================================= */
const taskListEl = document.getElementById('taskList');
const emptyStateEl = document.getElementById('emptyState');
const dateDisplayEl = document.getElementById('dateDisplay');
const popup = document.getElementById('taskPopup');
const popupTitle = document.getElementById('popupTitle');
const taskForm = document.getElementById('taskForm');
const taskIdInput = document.getElementById('taskId');
const taskNameInput = document.getElementById('taskName');
const taskDueDateInput = document.getElementById('taskDueDate');
const statusButton = document.querySelectorAll('.status-button');
const nameError = document.getElementById('nameError');

/* =========================================
   Initialization
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    renderDate();
    renderTodos();
});

/* =========================================
   Helper Functions
   ========================================= */

// Render current date in the header
function renderDate() {
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    dateDisplayEl.textContent = new Date().toLocaleDateString('en-US', options);
}

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* =========================================
   Core Functionality (Status & Filter)
   ========================================= */

// Update the current status state and re-render
function statusTasks(filter) {
    currentFilter = filter;
    
    // Update active button styling
    statusButton.forEach(button => {
        if (button.dataset.filter === filter) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    renderTodos();
}

// Update the sort state and re-render
function handleSort(sortValue) {
    currentSort = sortValue;
    renderTodos();
}

/* =========================================
   Rendering Logic
   ========================================= */

// Main function to display the task list
function renderTodos() {
    taskListEl.innerHTML = '';
    
    // 1. Filter Logic
    let filtered = todos.filter(t => {
        if (currentFilter === 'active') return !t.completed;
        if (currentFilter === 'completed') return t.completed;
        return true;
    });

    // 2. Sorting Logic
    filtered.sort((a, b) => {
        if (currentSort === 'date-asc') {
            return new Date(a.date) - new Date(b.date);
        } else if (currentSort === 'date-desc') {
            return new Date(b.date) - new Date(a.date);
        } else if (currentSort === 'name-asc') {
            return a.text.localeCompare(b.text);
        } else if (currentSort === 'name-desc') {
            return b.text.localeCompare(a.text);
        }
        return 0;
    });

    // 3. Empty State Logic
    if (filtered.length === 0) {
        emptyStateEl.classList.add('show');
    } else {
        emptyStateEl.classList.remove('show');
    }

    // 4. Generate HTML for each task
    filtered.forEach(todo => {
        const li = document.createElement('li');
        li.className = `task-item ${todo.completed ? 'completed' : ''}`;
        
        // Date formatting
        const dateObj = new Date(todo.date);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const isOverdue = !todo.completed && new Date(todo.date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);

        li.innerHTML = `
            <div class="task-left">
                <!-- Checkbox -->
                <div class="custom-checkbox ${todo.completed ? 'checked' : ''}" onclick="toggleComplete('${todo.id}')">
                    <i class="fas fa-check"></i>
                </div>
                <!-- Task Details -->
                <div class="task-content">
                    <span class="task-text">${escapeHtml(todo.text)}</span>
                    <span class="task-date ${isOverdue ? 'overdue' : ''}">
                        <i class="far fa-calendar"></i> ${dateStr} ${isOverdue ? '(Overdue)' : ''}
                    </span>
                </div>
            </div>
            <!-- Action Buttons -->
            <div class="actions">
                <button class="action-button edit" onclick="openEditPopup('${todo.id}')"><i class="fas fa-pen"></i></button>
                <button class="action-button delete" onclick="deleteTodo('${todo.id}')"><i class="fas fa-trash"></i></button>
            </div>
        `;
        taskListEl.appendChild(li);
    });
    
    // Save to LocalStorage
    localStorage.setItem('todos', JSON.stringify(todos));
}

/* =========================================
   Form & Data Handling
   ========================================= */

// Handle Add/Edit Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    const text = taskNameInput.value.trim();
    const date = taskDueDateInput.value;

    // Validation
    if (!text) {
        nameError.style.display = 'block';
        return;
    }
    nameError.style.display = 'none';

    if (isEditing) {
        // Edit existing task
        const id = taskIdInput.value;
        const index = todos.findIndex(t => t.id === id);
        if (index > -1) {
            todos[index].text = text;
            todos[index].date = date;
        }
    } else {
        // Add new task
        todos.push({
            id: crypto.randomUUID(),
            text: text,
            date: date,
            completed: false
        });
    }

    closePopup();
    renderTodos();
    
    // If adding a new task while in 'Completed' view, switch to 'All'
    if (currentFilter === 'completed' && !isEditing) statusTasks('all');
}

// Toggle Task Completion Status
function toggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
    }
}

// Delete Task
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
    alert('Task deleted successfully!');
}

/* =========================================
   Popup / Modal Handling
   ========================================= */

function openPopup() {
    popupTitle.textContent = "Add New Task";
    taskForm.reset();
    taskIdInput.value = '';
    taskDueDateInput.valueAsDate = new Date(); // Default to today
    isEditing = false;
    nameError.style.display = 'none';
    popup.classList.add('active');
}

function openEditPopup(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    popupTitle.textContent = "Edit Task";
    taskIdInput.value = todo.id;
    taskNameInput.value = todo.text;
    taskDueDateInput.value = todo.date;
    
    isEditing = true;
    popup.classList.add('active');
}

function closePopup() {
    popup.classList.remove('active');
}