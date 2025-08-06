import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Spinner from '../components/Spinner';
import { PlusCircle, Search } from 'lucide-react';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Filtering and Searching State ---
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      toast.error('Could not fetch tasks.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    const apiCall = taskToEdit 
      ? api.put(`/tasks/${taskToEdit.id}`, formData) 
      : api.post('/tasks', formData);

    try {
      await apiCall;
      toast.success(taskToEdit ? 'Task updated successfully!' : 'Task created successfully!');
      handleCloseModal();
      fetchTasks(); // Refetch tasks to show the latest data
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const originalTasks = [...tasks];
    // Optimistic UI update
    setTasks(currentTasks => currentTasks.map(t => t.id === taskId ? {...t, status: newStatus} : t));

    try {
      // Find the task to get all its properties for the update call
      const taskToUpdate = originalTasks.find(t => t.id === taskId);
      await api.put(`/tasks/${taskId}`, { ...taskToUpdate, status: newStatus });
      toast.success('Task status updated!');
    } catch (error) {
      toast.error('Could not update status.');
      setTasks(originalTasks); // Revert on failure
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        toast.success('Task deleted successfully!');
        fetchTasks(); // Refetch
      } catch (error) {
        toast.error('Could not delete task.');
      }
    }
  };

  // --- Filtering Logic ---
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (filterStatus === 'all') return true;
        return task.status === filterStatus;
      })
      .filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [tasks, filterStatus, searchQuery]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <button onClick={handleOpenCreateModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              <PlusCircle size={20} />
              Create New Task
            </button>
          </div>

          {/* Filter and Search Controls */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by title..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-lg ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>All</button>
              <button onClick={() => setFilterStatus('pending')} className={`px-4 py-2 rounded-lg ${filterStatus === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Pending</button>
              <button onClick={() => setFilterStatus('completed')} className={`px-4 py-2 rounded-lg ${filterStatus === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Completed</button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
          ) : (
            filteredTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700">No tasks found.</h3>
                <p className="text-gray-500 mt-2">Why not create one now?</p>
              </div>
            )
          )}
        </div>
      </main>
      <TaskForm 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        taskToEdit={taskToEdit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default DashboardPage;