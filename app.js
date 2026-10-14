document.addEventListener('DOMContentLoaded', () => {
    
    /* -------------------------------------------------------------
       1. ROUTING INTERFACES AND VISUAL THEMING
    ------------------------------------------------------------- */
    const tabs = document.querySelectorAll('.nav-tab');
    const views = document.querySelectorAll('.tab-view');
    const toggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            views.forEach(v => v.classList.remove('active-view'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active-view');
        });
    });

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    
    toggleBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        root.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');
    });

    /* -------------------------------------------------------------
       2. REACTIVE LOGIC ENGINE (Isolated CRUD Operations)
    ------------------------------------------------------------- */
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const todoCount = document.getElementById('todo-count');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');

    // Safe State Deserialization Engine
    let tasks = (() => {
        try {
            return JSON.parse(localStorage.getItem('ARCH_PORTFOLIO_TASKS')) || [];
        } catch (e) {
            console.error("Storage vector isolation triggered. Resetting cache matrix.", e);
            return [];
        }
    })();
    
    let currentFilter = 'all';

    // Atomic Cache Commit
    function commitState() {
        try {
            localStorage.setItem('ARCH_PORTFOLIO_TASKS', JSON.stringify(tasks));
        } catch (e) {
            console.error("Write execution failed on storage commit.", e);
        }
        renderStateTree();
    }

    // High Performance Fragment Injection DOM Engine
    function renderStateTree() {
        const fragment = document.createDocumentFragment();
        todoList.innerHTML = '';

        const activeFilterTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        activeFilterTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;

            li.innerHTML = `
                <div class="todo-item-left">
                    <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''} data-action="toggle">
                    <input type="text" class="todo-text" value="${escapeHtml(task.title)}" data-action="edit">
                </div>
                <div class="action-group">
                    <button class="icon-btn" data-action="delete" aria-label="Purge node link">🗑️</button>
                </div>
            `;
            fragment.appendChild(li);
        });

        todoList.appendChild(fragment);
        const outstandingActiveCount = tasks.filter(t => !t.completed).length;
        todoCount.textContent = `${outstandingActiveCount} item${outstandingActiveCount !== 1 ? 's' : ''} active`;
    }

    // Clean String Cleansing Filter (XSS Prevention Framework)
    function escapeHtml(string) {
        return string.replace(/[&<>"']/g, (match) => {
            const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
            return entities[match];
        });
    }

    // CREATE Operation Hook
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const payload = todoInput.value.trim();
        if (!payload) return;

        tasks.push({
            id: 'node_' + crypto.randomUUID(),
            title: payload,
            completed: false
        });

        todoInput.value = '';
        commitState();
    });

    // EVENT DELEGATION CAPTURE TRACKER (Single Entry Point for CRUD actions)
    todoList.addEventListener('click', (e) => {
        const target = e.target;
        const parentNode = target.closest('.todo-item');
        if (!parentNode) return;

        const targetNodeId = parentNode.dataset.id;
        const actionIntent = target.dataset.action;

        if (actionIntent === 'delete') {
            tasks = tasks.filter(item => item.id !== targetNodeId);
            commitState();
        }

        if (actionIntent === 'toggle') {
            tasks = tasks.map(item => item.id === targetNodeId ? { ...item, completed: target.checked } : item);
            commitState();
        }
    });

    // UPDATE Operation Focus Tracker
    todoList.addEventListener('focusout', (e) => {
        const target = e.target;
        if (target.dataset.action === 'edit') {
            const parentNode = target.closest('.todo-item');
            const targetNodeId = parentNode.dataset.id;
            const updatedPayload = target.value.trim();

            if (updatedPayload) {
                tasks = tasks.map(item => item.id === targetNodeId ? { ...item, title: updatedPayload } : item);
                commitState();
            } else {
                renderStateTree();
            }
        }
    });

    // FILTER Control Pipeline
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderStateTree();
        });
    });

    // PURGE Vector Clear Hook
    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(item => !item.completed);
        commitState();
    });

    // Run Engine
    renderStateTree();
});
