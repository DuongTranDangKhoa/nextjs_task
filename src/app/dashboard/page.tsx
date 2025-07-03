'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { apiService, type Task, type NoteItem, type User } from '../../lib/api';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newItem, setNewItem] = useState('');
  const [operationLoading, setOperationLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    if (!apiService.isLoggedIn()) {
      router.push('/');
      return;
    }

    // Get current user
    const user = apiService.getCurrentUser();
    setCurrentUser(user);

    loadTasks();
  }, [router]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const fetchedTasks = await apiService.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Không thể tải danh sách tasks. Vui lòng thử lại.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    router.push('/');
  };

  const createNewTask = async () => {
    try {
      setOperationLoading(true);
      const newTask = await apiService.createTask({
        title: 'Task mới',
        userId: currentUser ? parseInt(currentUser.id) : 1,
        noteItems: [{ content: 'Việc cần làm...' }]
      });
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError('Không thể tạo task mới. Vui lòng thử lại.');
      console.error('Error creating task:', err);
    } finally {
      setOperationLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    // Confirm before delete
    if (!confirm('Bạn có chắc chắn muốn xóa task này?')) {
      return;
    }

    try {
      setOperationLoading(true);
      setError(''); // Clear previous errors
      await apiService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      
      // Close modal if deleting the task being edited
      if (editingTask && editingTask.id === id) {
        setShowModal(false);
        setEditingTask(null);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể xóa task. Vui lòng thử lại.';
      setError(`Lỗi xóa task: ${errorMessage}`);
      console.error('Error deleting task:', err);
    } finally {
      setOperationLoading(false);
    }
  };

  const editTask = (task: Task) => {
    setEditingTask({ ...task });
    setShowModal(true);
  };

  const updateTask = async () => {
    if (!editingTask) return;

    try {
      setOperationLoading(true);
      const updatedTask = await apiService.updateTask(editingTask.id, {
        title: editingTask.title,
        userId: editingTask.userId,
        noteItems: editingTask.noteItems.map(item => ({ content: item.content }))
      });
      
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? updatedTask : task
      ));
      
      setShowModal(false);
      setEditingTask(null);
    } catch (err) {
      setError('Không thể cập nhật task. Vui lòng thử lại.');
      console.error('Error updating task:', err);
    } finally {
      setOperationLoading(false);
    }
  };

  const addItemToTask = () => {
    if (newItem.trim() && editingTask) {
      const newNoteItem: NoteItem = {
        id: Date.now(), // Temporary ID
        content: newItem.trim(),
        noteId: editingTask.id
      };
      
      setEditingTask({
        ...editingTask,
        noteItems: [...editingTask.noteItems, newNoteItem]
      });
      setNewItem('');
    }
  };

  const removeItemFromTask = (index: number) => {
    if (!editingTask) return;

    // Confirm before delete  
    if (!confirm('Bạn có chắc chắn muốn xóa item này?')) {
      return;
    }

    const newNoteItems = editingTask.noteItems.filter((_, i) => i !== index);
    
    setEditingTask({
      ...editingTask,
      noteItems: newNoteItems
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-48 bg-white shadow-lg p-4 flex flex-col">
        <button
          onClick={createNewTask}
          disabled={operationLoading}
          className="w-full bg-gray-200 hover:bg-gray-300 border-2 border-gray-400 rounded-lg py-3 px-4 flex items-center justify-center transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-6 h-6 text-gray-600" />
        </button>
        
        {/* Spacer */}
        <div className="flex-1"></div>
        
        {/* User info */}
        {currentUser && (
          <div className="mb-4 p-3 bg-gray-100 rounded-lg">
            <div className="text-sm text-gray-600 text-center">
              <p className="font-medium">Xin chào!</p>
              <p className="text-blue-600">{currentUser.username}</p>
            </div>
          </div>
        )}
        
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-100 hover:bg-red-200 border border-red-300 rounded-lg py-2 px-4 flex items-center justify-center gap-2 transition-colors text-red-700"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          <span className="text-sm">Đăng xuất</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button 
              onClick={() => setError('')}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <h2 className="text-xl mb-4">Chưa có task nào</h2>
            <p>Nhấn nút + để tạo task đầu tiên của bạn</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-gray-200 rounded-lg p-4 border-2 border-gray-400 relative">
                {/* Edit and Delete buttons */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => editTask(task)}
                    disabled={operationLoading}
                    className="p-1 hover:bg-gray-300 rounded disabled:opacity-50"
                  >
                    <PencilIcon className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    disabled={operationLoading}
                    className="p-1 hover:bg-red-100 rounded disabled:opacity-50 transition-colors"
                    title="Xóa task"
                  >
                    <TrashIcon className="w-4 h-4 text-red-600 hover:text-red-800" />
                  </button>
                </div>

                {/* Task content */}
                <div className="pr-12">
                  <h3 className="font-semibold text-gray-800 mb-2">{task.title}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {task.noteItems.map((item, index) => (
                      <li key={item.id || index} className="text-gray-800">
                        {item.content}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for editing task */}
      {showModal && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4 border-2 border-blue-400">
            {/* Modal header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chỉnh sửa task</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={operationLoading}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteTask(editingTask.id)}
                  disabled={operationLoading}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal content */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({
                    ...editingTask,
                    title: e.target.value
                  })}
                  disabled={operationLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nội dung
                </label>
                <ul className="space-y-2 mb-3">
                  {editingTask.noteItems.map((item, index) => (
                    <li key={item.id || index} className="flex items-center gap-2">
                      <span className="text-gray-800">•</span>
                      <span className="flex-1 text-gray-800">{item.content}</span>
                      <button
                        onClick={() => removeItemFromTask(index)}
                        disabled={operationLoading}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItemToTask()}
                    placeholder="Thêm item mới..."
                    disabled={operationLoading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                  />
                  <button
                    onClick={addItemToTask}
                    disabled={operationLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={updateTask}
                disabled={operationLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {operationLoading ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 