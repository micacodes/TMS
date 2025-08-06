import React from 'react';
import { Edit, Trash2, Calendar, Flag, CheckCircle2, Circle } from 'lucide-react';

//displaying a single task
const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
 
  const priorityStyles = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  };

  const isCompleted = task.status === 'completed';
  const isOverdue = !isCompleted && task.due_date && new Date(task.due_date) < new Date();

  return (
    
    <div 
      className={`
        bg-white rounded-lg shadow-md p-4 flex flex-col justify-between 
        hover:shadow-xl hover:-translate-y-1 transition-all duration-200
        border-l-4 ${isCompleted ? 'border-green-500' : isOverdue ? 'border-red-500' : 'border-blue-500'}
      `}
    >
      {/* --- Card Header: Title and Priority --- */}
      <div className="flex justify-between items-start gap-2">
        <h3 className={`text-lg font-bold ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
          {task.title}
        </h3>
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${priorityStyles[task.priority]}`}>
          <Flag size={12} />
          <span>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
        </div>
      </div>

      {/* --- Card Body: Description --- */}
      <p className={`text-sm my-3 ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
        {task.description || <span className="italic text-gray-400">No description</span>}
      </p>

      {/* --- Card Footer: Due Date and Actions --- */}
      <div className="mt-auto pt-2 border-t border-gray-100">
        <div className={`flex items-center text-sm mb-3 ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
          <Calendar size={14} className="mr-2 flex-shrink-0" />
          <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</span>
        </div>
        
        {/* Actions Row */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onStatusChange(task.id, isCompleted ? 'pending' : 'completed')}
            className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-md transition-colors ${
              isCompleted 
              ? 'text-gray-600 bg-gray-100 hover:bg-gray-200' 
              : 'text-blue-600 bg-blue-100 hover:bg-blue-200'
            }`}
          >
            {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            <span>{isCompleted ? 'Completed' : 'Mark as Done'}</span>
          </button>
          
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(task)} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-blue-700 transition-colors">
              <Edit size={18} />
            </button>
            <button onClick={() => onDelete(task.id)} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-red-700 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;