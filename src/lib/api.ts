const API_BASE_URL = 'https://6865de8e89803950dbb0763a.mockapi.io';

interface User {
  id: string;
  username: string;
  password: string;
}

interface NoteItem {
  id: number;
  content: string;
  noteId: number;
}

interface Task {
  id: number;
  title: string;
  userId: number;
  noteItems: NoteItem[];
}

interface CreateTaskRequest {
  title: string;
  userId: number;
  noteItems: { content: string }[];
}

interface UpdateTaskRequest {
  title?: string;
  userId?: number;
  noteItems?: { content: string }[];
}

class ApiService {
  // Simple authentication with mock API
  async login(username: string, password: string): Promise<User> {
    // Get all users from mock API
    const users = await this.getUsers();
    
    // Find user with matching credentials
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Store user info in localStorage for simple session management
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    
    return user;
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // Users API
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/user`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  }

  async getUser(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  }

  // Tasks API
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/task`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  }

  async getTask(id: number): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/task/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }
    return response.json();
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    return response.json();
  }

  async updateTask(id: number, taskData: UpdateTaskRequest): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/task/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    return response.json();
  }

  async deleteTask(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/task/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  }
}

export const apiService = new ApiService();
export type { Task, User, NoteItem, CreateTaskRequest, UpdateTaskRequest }; 