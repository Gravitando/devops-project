import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import './TodoList.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [filter, setFilter] = useState('all');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const data = await createTask({ title: newTitle, description: newDescription });
      setTasks([data.task, ...tasks]);
      setNewTitle('');
      setNewDescription('');
    } catch (err) {
      alert('Error creating task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const data = await updateTask(task._id, { completed: !task.completed });
      setTasks(tasks.map(t => t._id === task._id ? data.task : t));
    } catch (err) {
      alert('Error updating task');
    }
  };

  const handleStartEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = async (taskId) => {
    if (!editTitle.trim()) return;

    try {
      const data = await updateTask(taskId, { title: editTitle, description: editDescription });
      setTasks(tasks.map(t => t._id === taskId ? data.task : t));
      handleCancelEdit();
    } catch (err) {
      alert('Error updating task');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      alert('Error deleting task');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="todolist-wrapper">
      {/* Animated background elements */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>

      <div className="todolist-container">
        {/* Header */}
        <header className="todolist-header">
          <div className="header-left">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <h1>TaskFlow</h1>
          </div>
          <div className="user-info">
            <div className="user-avatar">{(user?.name || 'U').charAt(0).toUpperCase()}</div>
            <span className="user-name">{user?.name || 'User'}</span>
            <button onClick={handleLogout} className="logout-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="main-content">
          {/* Left Panel - Create Task */}
          <div className="left-panel">
            <div className="panel-card create-card">
              <h2>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                New Task
              </h2>
              <form className="task-form" onSubmit={handleCreateTask}>
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  maxLength={200}
                  required
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  maxLength={1000}
                />
                <button type="submit" className="submit-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Task
                </button>
              </form>
            </div>

            {/* Stats */}
            <div className="panel-card stats-card">
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-num">{tasks.length}</span>
                  <span className="stat-lbl">Total</span>
                </div>
                <div className="stat-box pending">
                  <span className="stat-num">{pendingCount}</span>
                  <span className="stat-lbl">Pending</span>
                </div>
                <div className="stat-box completed">
                  <span className="stat-num">{completedCount}</span>
                  <span className="stat-lbl">Done</span>
                </div>
              </div>
              <div className="progress-section">
                <div className="progress-header">
                  <span>Progress</span>
                  <span className="progress-pct">{progressPercent}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Task List */}
          <div className="right-panel">
            <div className="panel-card tasks-card">
              <div className="tasks-header">
                <h2>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  My Tasks
                </h2>
                <div className="filter-tabs">
                  <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                  <button className={`filter-tab ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
                  <button className={`filter-tab ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Done</button>
                </div>
              </div>

              <div className="tasks-list">
                {tasks.length === 0 ? (
                  <div className="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                      <rect x="9" y="3" width="6" height="4" rx="1" />
                    </svg>
                    <p>No tasks yet. Create one!</p>
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <p>No {filter} tasks</p>
                  </div>
                ) : (
                  filteredTasks.map(task => (
                    <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                      {editingId === task._id ? (
                        <div className="task-edit">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            maxLength={200}
                            autoFocus
                            placeholder="Title"
                          />
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            maxLength={1000}
                            placeholder="Description"
                          />
                          <div className="edit-actions">
                            <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                            <button onClick={() => handleSaveEdit(task._id)} className="save-btn">Save</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="task-check">
                            <input
                              type="checkbox"
                              id={`task-${task._id}`}
                              checked={task.completed}
                              onChange={() => handleToggleComplete(task)}
                            />
                            <label htmlFor={`task-${task._id}`}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20,6 9,17 4,12" />
                              </svg>
                            </label>
                          </div>
                          <div className="task-info">
                            <h4>{task.title}</h4>
                            {task.description && <p>{task.description}</p>}
                          </div>
                          <div className="task-actions">
                            <button onClick={() => handleStartEdit(task)} className="action-btn edit" title="Edit">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button onClick={() => handleDelete(task._id)} className="action-btn delete" title="Delete">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3,6 5,6 21,6" />
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              </svg>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
