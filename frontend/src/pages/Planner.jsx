import React, { useState } from 'react';
import './Planner.css';

function Planner() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete project documentation', priority: 'high', status: 'pending', dueDate: '2025-11-15', category: 'Work' },
    { id: 2, title: 'Review pull requests', priority: 'medium', status: 'in-progress', dueDate: '2025-11-12', category: 'Work' },
    { id: 3, title: 'Team meeting preparation', priority: 'low', status: 'completed', dueDate: '2025-11-11', category: 'Meetings' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    category: 'Work'
  });

  const categories = ['Work', 'Personal', 'Meetings', 'Shopping', 'Health', 'Other'];
  const priorities = ['low', 'medium', 'high'];
  const statuses = ['pending', 'in-progress', 'completed'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...formData, id: task.id }
          : task
      ));
    } else {
      const newTask = {
        ...formData,
        id: Date.now()
      };
      setTasks([...tasks, newTask]);
    }

    resetForm();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      category: task.category
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      category: 'Work'
    });
    setEditingTask(null);
    setShowModal(false);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTaskStats = () => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length
    };
  };

  const stats = getTaskStats();

  return (
    <div className="planner-container">
      <header className="planner-header">
        <div className="header-content">
          <h1 className="header-title">TaskMate Planner</h1>
          <p className="header-subtitle">Organize your tasks and boost productivity</p>
        </div>
        <button className="btn-create" onClick={() => setShowModal(true)}>
          <span className="plus-icon">+</span> Create Task
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <div className="stat-number">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} 
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`} 
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} 
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="tasks-grid">
        {filteredTasks.length === 0 ? (
          <div className="no-tasks">
            <span className="empty-icon">📭</span>
            <h3>No tasks found</h3>
            <p>Create a new task to get started!</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={`task-card ${task.status}`}>
              <div className="task-header">
                <span className={`priority-badge priority-${task.priority}`}>
                  {task.priority}
                </span>
                <span className="category-badge">{task.category}</span>
              </div>
              <h3 className="task-title">{task.title}</h3>
              <div className="task-meta">
                <span className="due-date">📅 {task.dueDate}</span>
                <span className={`status-badge status-${task.status}`}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>
              <div className="task-actions">
                <button className="btn-edit" onClick={() => handleEdit(task)}>
                  ✏️ Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(task.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button className="modal-close" onClick={resetForm}>✕</button>
            </div>
            
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  className="form-input"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    {priorities.map(p => (
                      <option key={p} value={p}>{p.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>
                        {s.replace('-', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    className="form-input"
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
                <button className="btn-submit" onClick={handleSubmit}>
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Planner;