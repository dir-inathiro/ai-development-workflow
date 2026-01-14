'use client';

import { useState } from 'react';

type TaskStatus = 'Pending' | 'Running' | 'Completed';

interface SubTask {
  id: string;
  title: string;
  status: TaskStatus;
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  subtasks: SubTask[];
  isEditing?: boolean;
  isExpanded?: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: 'Pending',
        subtasks: [],
        isExpanded: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskTitle = (taskId: string, newTitle: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, title: newTitle, isEditing: false } : task
    ));
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const toggleTaskExpanded = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isExpanded: !task.isExpanded } : task
    ));
  };

  const toggleTaskEditing = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isEditing: !task.isEditing } : task
    ));
  };

  const addSubTask = (taskId: string, subtaskTitle: string) => {
    if (subtaskTitle.trim()) {
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          const newSubtask: SubTask = {
            id: Date.now().toString(),
            title: subtaskTitle,
            status: 'Pending',
          };
          return { ...task, subtasks: [...task.subtasks, newSubtask] };
        }
        return task;
      }));
    }
  };

  const deleteSubTask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, subtasks: task.subtasks.filter(st => st.id !== subtaskId) };
      }
      return task;
    }));
  };

  const updateSubTaskTitle = (taskId: string, subtaskId: string, newTitle: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.map(st =>
            st.id === subtaskId ? { ...st, title: newTitle } : st
          ),
        };
      }
      return task;
    }));
  };

  const updateSubTaskStatus = (taskId: string, subtaskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.map(st =>
            st.id === subtaskId ? { ...st, status: newStatus } : st
          ),
        };
      }
      return task;
    }));
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-200 text-gray-700';
      case 'Running':
        return 'bg-blue-200 text-blue-700';
      case 'Completed':
        return 'bg-green-200 text-green-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          TODO管理アプリ
        </h1>

        {/* Add New Task */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              追加
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              タスクがありません。上記から新しいタスクを追加してください。
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                {/* Task Header */}
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => toggleTaskExpanded(task.id)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {task.isExpanded ? '▼' : '▶'}
                  </button>

                  {task.isEditing ? (
                    <input
                      type="text"
                      defaultValue={task.title}
                      onBlur={(e) => updateTaskTitle(task.id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          updateTaskTitle(task.id, e.currentTarget.value);
                        }
                      }}
                      autoFocus
                      className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  ) : (
                    <h2 className="flex-1 text-xl font-semibold text-gray-800 dark:text-white">
                      {task.title}
                    </h2>
                  )}

                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Running">Running</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button
                    onClick={() => toggleTaskEditing(task.id)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    編集
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    削除
                  </button>
                </div>

                {/* Subtasks */}
                {task.isExpanded && (
                  <div className="ml-8 mt-4 space-y-3">
                    {/* Add Subtask */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="サブタスクを追加..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSubTask(task.id, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addSubTask(task.id, input.value);
                          input.value = '';
                        }}
                        className="px-4 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
                      >
                        追加
                      </button>
                    </div>

                    {/* Subtask List */}
                    {task.subtasks.map(subtask => (
                      <div key={subtask.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <input
                          type="text"
                          defaultValue={subtask.title}
                          onBlur={(e) => updateSubTaskTitle(task.id, subtask.id, e.target.value)}
                          className="flex-1 px-2 py-1 text-sm bg-transparent border-none focus:outline-none dark:text-white"
                        />

                        <select
                          value={subtask.status}
                          onChange={(e) => updateSubTaskStatus(task.id, subtask.id, e.target.value as TaskStatus)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subtask.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Running">Running</option>
                          <option value="Completed">Completed</option>
                        </select>

                        <button
                          onClick={() => deleteSubTask(task.id, subtask.id)}
                          className="px-2 py-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          削除
                        </button>
                      </div>
                    ))}

                    {task.subtasks.length === 0 && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                        サブタスクがありません
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
