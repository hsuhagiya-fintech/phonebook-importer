class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentId = Math.max(0, ...this.tasks.map(t => t.id)) + 1;
    }

    addTask(title, description, priority = 'medium', dueDate = null) {
        const task = {
            id: this.currentId++,
            title,
            description,
            priority,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.push(task);
        this.saveToStorage();
        return task;
    }

    deleteTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    toggleComplete(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    getTasks(filter = 'all') {
        switch (filter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            case 'high-priority':
                return this.tasks.filter(task => task.priority === 'high');
            default:
                return [...this.tasks];
        }
    }

    getTask(id) {
        return this.tasks.find(task => task.id === id);
    }

    updateTask(id, updates) {
        const task = this.getTask(id);
        if (task) {
            Object.assign(task, updates);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveToStorage();
    }

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const active = total - completed;
        
        return { total, completed, active };
    }

    saveToStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    exportTasks() {
        return JSON.stringify(this.tasks, null, 2);
    }

importTasks(jsonData) {
    try {
        const importedTasks = JSON.parse(jsonData);
if (Array.isArray(importedTasks) && importedTasks.every(task => 
    task.id !== undefined && 
    task.title !== undefined && 
    task.description !== undefined)) {
    this.tasks = importedTasks;
    this.currentId = Math.max(0, ...this.tasks.map(t => t.id)) + 1;
    this.saveToStorage();
    return true;
} else {
    const invalidTasks = importedTasks.filter(task => 
        task.id === undefined || 
        task.title === undefined || 
        task.description === undefined);
    console.error('Imported tasks do not have the required structure', invalidTasks);
}
    } catch (error) {
importTasks(jsonData) {
    try {
        const importedTasks = JSON.parse(jsonData);
        if (Array.isArray(importedTasks) && importedTasks.every(task => 
            task.id !== undefined && 
            task.title !== undefined && 
            task.description !== undefined)) {
            this.tasks = importedTasks;
            this.currentId = Math.max(0, ...this.tasks.map(t => t.id)) + 1;
            this.saveToStorage();
            return true;
        } else {
            const invalidTasks = importedTasks.filter(task => 
                task.id === undefined || 
                task.title === undefined || 
                task.description === undefined);
            console.error('Imported tasks do not have the required structure', { invalidTasks, originalData: jsonData });
        }
    } catch (error) {
        console.error('Invalid JSON data', { error: error.message, attemptedData: jsonData });
    }
    return false;
}
    }
    return false;
}
}

// Example usage:
// const tm = new TaskManager();
// tm.addTask('Learn JavaScript', 'Complete advanced JS concepts');
// tm.addTask('Build project', 'Create a portfolio project', 'high');
// console.log(tm.getTasks('active'));