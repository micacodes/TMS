import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag } from 'lucide-react';
import Spinner from './Spinner.jsx';
//Creating tasks
const TaskForm = ({ isOpen, onClose, onSubmit, taskToEdit, isLoading }) => {
  const [task, setTask] = useState({ title: '', description: '', priority: 'medium', due_date: '' });

  useEffect(() => {
    if (taskToEdit) {
      
      setTask({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'medium',
        due_date: taskToEdit.due_date ? new Date(taskToEdit.due_date).toISOString().split('T')[0] : '',
      });
    } else {
     
      setTask({ title: '', description: '', priority: 'medium', due_date: '' });
    }
  }, [taskToEdit, isOpen]); 

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit({ ...task, due_date: task.due_date || null });
  };

  
  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors";

  return (
    
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose} 
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-lg animate-slide-up"
        onClick={(e) => e.stopPropagation()} 
      >
        
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

       
        <form onSubmit={handleSubmit} className="p-5 space-y-6">
         
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input id="title" name="title" type="text" required value={task.title} onChange={handleChange} className={inputStyle} />
          </div>

         
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" name="description" rows="4" value={task.description} onChange={handleChange} className={inputStyle} placeholder="Add more details..."></textarea>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="priority" className="flex items-center text-sm font-medium text-gray-700">
                <Flag size={14} className="mr-2" /> Priority
              </label>
              <select id="priority" name="priority" value={task.priority} onChange={handleChange} className={inputStyle}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="due_date" className="flex items-center text-sm font-medium text-gray-700">
                <Calendar size={14} className="mr-2" /> Due Date
              </label>
              <input id="due_date" name="due_date" type="date" value={task.due_date} onChange={handleChange} className={inputStyle} />
            </div>
          </div>
        </form>

       
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md font-semibold hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={isLoading} 
            className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading && <Spinner size="sm" />}
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;