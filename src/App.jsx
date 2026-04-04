import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  Plus, 
  LogOut,
  ChevronRight,
  Calendar,
  Clock,
  Target,
  User as UserIcon,
  Shield,
  Trash2,
  Mail,
  Camera,
  BookOpen,
  Book
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import WorkoutForm from './components/WorkoutForm';
import NutritionForm from './components/NutritionForm';
import ProgressForm from './components/ProgressForm';
import Papa from 'papaparse';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
        : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const Card = ({ children, title, subtitle, action }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
    {(title || action) && (
      <div className="flex items-center justify-between mb-6">
        <div>
          {title && <h3 className="text-lg font-bold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
);

const StatCard = ({ label, value, unit, trend, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-slate-900">{value}</span>
      <span className="text-slate-400 text-sm font-medium">{unit}</span>
    </div>
  </div>
);

// --- Main App ---

const ProfileView = ({ user, onUpdate }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, email, profilePicture })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      onUpdate(data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Manage Profile" subtitle="Update your personal information">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <img 
                src={profilePicture} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-brand-100 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">Click to change (simulated)</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Profile Picture URL</label>
              <input 
                type="text"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-brand-500 outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {message.text && (
            <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </Card>
    </div>
  );
};

const AdminView = () => {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Blog Form State
  const [newBlog, setNewBlog] = useState({ title: '', content: '', image: '' });
  // New Exercise Form State
  const [newExercise, setNewExercise] = useState({ name: '', category: '', targetMuscle: '', instructions: '', difficulty: 'Beginner' });

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      const [usersRes, statsRes, blogsRes, exercisesRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/stats', { headers }),
        fetch('/api/blogs', { headers }),
        fetch('/api/exercises', { headers })
      ]);
      setUsers(await usersRes.json());
      setStats(await statsRes.json());
      setBlogs(await blogsRes.json());
      setExercises(await exercisesRes.json());
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    fetchData();
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    await fetch(`/api/admin/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    fetchData();
  };

  const deleteExercise = async (id) => {
    if (!window.confirm('Delete this exercise?')) return;
    await fetch(`/api/admin/exercises/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    fetchData();
  };

  const addBlog = async (e) => {
    e.preventDefault();
    await fetch('/api/admin/blogs', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(newBlog)
    });
    setNewBlog({ title: '', content: '', image: '' });
    fetchData();
  };

  const addExercise = async (e) => {
    e.preventDefault();
    await fetch('/api/admin/exercises', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(newExercise)
    });
    setNewExercise({ name: '', category: '', targetMuscle: '', instructions: '', difficulty: 'Beginner' });
    fetchData();
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Loading admin data...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <StatCard label="Users" value={stats?.totalUsers || 0} unit="members" icon={UserIcon} color="bg-blue-500" />
        <StatCard label="Workouts" value={stats?.totalWorkouts || 0} unit="logged" icon={Dumbbell} color="bg-brand-500" />
        <StatCard label="Nutrition" value={stats?.totalNutritionLogs || 0} unit="entries" icon={Utensils} color="bg-orange-500" />
        <StatCard label="Progress" value={stats?.totalProgressLogs || 0} unit="updates" icon={TrendingUp} color="bg-purple-500" />
        <StatCard label="Blogs" value={stats?.totalBlogs || 0} unit="posts" icon={BookOpen} color="bg-pink-500" />
        <StatCard label="Exercises" value={stats?.totalExercises || 0} unit="guide" icon={Book} color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Add New Blog Post">
          <form onSubmit={addBlog} className="space-y-4">
            <input 
              required
              placeholder="Blog Title"
              value={newBlog.title}
              onChange={e => setNewBlog({...newBlog, title: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
            />
            <input 
              required
              placeholder="Image URL"
              value={newBlog.image}
              onChange={e => setNewBlog({...newBlog, image: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
            />
            <textarea 
              required
              placeholder="Blog Content"
              value={newBlog.content}
              onChange={e => setNewBlog({...newBlog, content: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none min-h-[100px]"
            />
            <button type="submit" className="w-full bg-brand-500 text-white py-2 rounded-xl font-bold">Post Blog</button>
          </form>
        </Card>

        <Card title="Add New Exercise">
          <form onSubmit={addExercise} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input 
                required
                placeholder="Exercise Name"
                value={newExercise.name}
                onChange={e => setNewExercise({...newExercise, name: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
              />
              <input 
                required
                placeholder="Category"
                value={newExercise.category}
                onChange={e => setNewExercise({...newExercise, category: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input 
                required
                placeholder="Target Muscle"
                value={newExercise.targetMuscle}
                onChange={e => setNewExercise({...newExercise, targetMuscle: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
              />
              <select 
                value={newExercise.difficulty}
                onChange={e => setNewExercise({...newExercise, difficulty: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <textarea 
              required
              placeholder="Instructions"
              value={newExercise.instructions}
              onChange={e => setNewExercise({...newExercise, instructions: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none min-h-[80px]"
            />
            <button type="submit" className="w-full bg-indigo-500 text-white py-2 rounded-xl font-bold">Add Exercise</button>
          </form>
        </Card>
      </div>

      <Card title="User Management">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-bold text-slate-700">User</th>
                <th className="pb-4 font-bold text-slate-700">Email</th>
                <th className="pb-4 font-bold text-slate-700">Role</th>
                <th className="pb-4 font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img src={u.profilePicture} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                      <span className="font-medium text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-500">{u.email}</td>
                  <td className="py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => deleteUser(u.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Manage Blogs">
          <div className="space-y-4">
            {blogs.map(b => (
              <div key={b.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="font-medium text-slate-900 truncate mr-4">{b.title}</span>
                <button onClick={() => deleteBlog(b.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Manage Exercises">
          <div className="space-y-4">
            {exercises.map(ex => (
              <div key={ex.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="font-medium text-slate-900 truncate mr-4">{ex.name}</span>
                <button onClick={() => deleteExercise(ex.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Main App ---

const AuthScreen = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const body = isLogin ? { email, password } : { name, email, password };
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      
      if (isLogin) onLogin(data);
      else onSignup(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-brand-500 p-3 rounded-2xl mb-4">
            <Activity className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">FitTrack Pro</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isLogin ? 'Welcome back! Please login.' : 'Create an account to start tracking.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Full Name</label>
              <input 
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-brand-500 outline-none"
                placeholder="John Doe"
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Email Address</label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-brand-500 outline-none"
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Password</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-brand-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-slate-500 hover:text-brand-500 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [progress, setProgress] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [exerciseGuide, setExerciseGuide] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [showNutritionForm, setShowNutritionForm] = useState(false);
  const [showProgressForm, setShowProgressForm] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const [userRes, workoutRes, nutritionRes, progressRes, blogRes, exerciseRes] = await Promise.all([
          fetch('/api/user', { headers }),
          fetch('/api/workouts', { headers }),
          fetch('/api/nutrition', { headers }),
          fetch('/api/progress', { headers }),
          fetch('/api/blogs', { headers }),
          fetch('/api/exercises', { headers })
        ]);
        
        if (userRes.status === 401 || userRes.status === 403) {
          handleLogout();
          return;
        }

        setUser(await userRes.json());
        setWorkouts(await workoutRes.json());
        setNutrition(await nutritionRes.json());
        setProgress(await progressRes.json());
        setBlogs(await blogRes.json());
        setExerciseGuide(await exerciseRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleLogin = (data) => {
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setWorkouts([]);
    setNutrition([]);
    setProgress([]);
    setActiveTab('dashboard');
  };

  const addWorkout = async (workout) => {
    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(workout)
    });
    const newWorkout = await res.json();
    setWorkouts([newWorkout, ...workouts]);
  };

  const addNutrition = async (entry) => {
    const res = await fetch('/api/nutrition', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(entry)
    });
    const newEntry = await res.json();
    setNutrition([newEntry, ...nutrition]);
  };

  const addProgress = async (entry) => {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(entry)
    });
    const newEntry = await res.json();
    setProgress([...progress, newEntry]);
  };

  const deleteWorkout = async (id) => {
    await fetch(`/api/workouts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const deleteNutrition = async (id) => {
    await fetch(`/api/nutrition/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setNutrition(nutrition.filter(n => n.id !== id));
  };

  const deleteProgress = async (id) => {
    await fetch(`/api/progress/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setProgress(progress.filter(p => p.id !== id));
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayNutrition = nutrition.filter(n => format(new Date(n.date), 'yyyy-MM-dd') === today);
  const todayCalories = todayNutrition.reduce((sum, n) => sum + (n.calories || 0), 0);
  const todayProtein = todayNutrition.reduce((sum, n) => sum + (n.protein || 0), 0);
  const todayCarbs = todayNutrition.reduce((sum, n) => sum + (n.carbs || 0), 0);
  const todayFats = todayNutrition.reduce((sum, n) => sum + (n.fats || 0), 0);
  
  const calorieGoal = 2200;
  const proteinGoal = 150;
  const waterGoal = 3.0;
  const todayWater = 2.1; // Simulated for now

  const exportData = () => {
    const csv = Papa.unparse(progress);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'fitness_progress.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full"
      />
    </div>
  );

  if (!token) {
    return <AuthScreen onLogin={handleLogin} onSignup={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-brand-500 p-2 rounded-xl">
            <Activity className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">FitTrack Pro</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={Dumbbell} 
            label="Workouts" 
            active={activeTab === 'workouts'} 
            onClick={() => setActiveTab('workouts')} 
          />
          <SidebarItem 
            icon={Utensils} 
            label="Nutrition" 
            active={activeTab === 'nutrition'} 
            onClick={() => setActiveTab('nutrition')} 
          />
          <SidebarItem 
            icon={TrendingUp} 
            label="Progress" 
            active={activeTab === 'progress'} 
            onClick={() => setActiveTab('progress')} 
          />
          <SidebarItem 
            icon={BookOpen} 
            label="Blog" 
            active={activeTab === 'blog'} 
            onClick={() => setActiveTab('blog')} 
          />
          <SidebarItem 
            icon={Book} 
            label="Exercise Guide" 
            active={activeTab === 'exercise-guide'} 
            onClick={() => setActiveTab('exercise-guide')} 
          />
          <div className="pt-4 pb-2">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Account</p>
            <SidebarItem 
              icon={UserIcon} 
              label="Profile" 
              active={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')} 
            />
            {user?.role === 'admin' && (
              <SidebarItem 
                icon={Shield} 
                label="Admin Panel" 
                active={activeTab === 'admin'} 
                onClick={() => setActiveTab('admin')} 
              />
            )}
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 mb-6">
            <img 
              src={user?.profilePicture} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-brand-100"
              referrerPolicy="no-referrer"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {activeTab === 'dashboard' && `Welcome back, ${user?.name.split(' ')[0]}!`}
              {activeTab === 'workouts' && 'Workout Routines'}
              {activeTab === 'nutrition' && 'Nutrition Log'}
              {activeTab === 'progress' && 'Fitness Progress'}
              {activeTab === 'blog' && 'Fitness Blog'}
              {activeTab === 'exercise-guide' && 'Exercise Guide'}
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'admin' && 'Admin Dashboard'}
            </h2>
            <p className="text-slate-500 mt-1">
              {activeTab === 'dashboard' && "Here's what's happening with your fitness today."}
              {activeTab === 'workouts' && "Manage your exercises and track your sets."}
              {activeTab === 'nutrition' && "Keep track of your daily intake and macros."}
              {activeTab === 'progress' && "Visualize your journey and achievements."}
              {activeTab === 'blog' && "Read and share fitness tips and stories."}
              {activeTab === 'exercise-guide' && "Learn how to perform exercises correctly."}
              {activeTab === 'profile' && "Manage your account settings and preferences."}
              {activeTab === 'admin' && "Overview of system users and activity."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={exportData}
              className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <TrendingUp size={18} />
              <span className="text-sm font-bold">Export CSV</span>
            </button>
            <button 
              onClick={() => {
                if (activeTab === 'workouts') setShowWorkoutForm(true);
                else if (activeTab === 'nutrition') setShowNutritionForm(true);
                else if (activeTab === 'progress') setShowProgressForm(true);
                else setShowWorkoutForm(true);
              }}
              className="bg-brand-500 hover:bg-brand-600 text-white p-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
        </header>

        {showWorkoutForm && (
          <WorkoutForm 
            onClose={() => setShowWorkoutForm(false)} 
            onSubmit={addWorkout} 
          />
        )}

        {showNutritionForm && (
          <NutritionForm 
            onClose={() => setShowNutritionForm(false)} 
            onSubmit={addNutrition} 
          />
        )}

        {showProgressForm && (
          <ProgressForm 
            onClose={() => setShowProgressForm(false)} 
            onSubmit={addProgress} 
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                  label="Daily Calories" 
                  value={todayCalories} 
                  unit="kcal" 
                  trend={todayCalories > 1500 ? "+12%" : ""} 
                  icon={Utensils} 
                  color="bg-orange-500" 
                />
                <StatCard 
                  label="Workouts" 
                  value={workouts.filter(w => format(new Date(w.date), 'yyyy-MM-dd') === today).length} 
                  unit="today" 
                  trend={workouts.length > 0 ? "+2" : ""} 
                  icon={Dumbbell} 
                  color="bg-blue-500" 
                />
                <StatCard 
                  label="Weight" 
                  value={progress.length > 0 ? progress[progress.length-1].weight : '--'} 
                  unit="kg" 
                  trend={progress.length > 1 ? (progress[progress.length-1].weight - progress[progress.length-2].weight).toFixed(1) : ""} 
                  icon={TrendingUp} 
                  color="bg-brand-500" 
                />
                <StatCard 
                  label="Active Time" 
                  value={workouts.filter(w => format(new Date(w.date), 'yyyy-MM-dd') === today).length * 45} 
                  unit="mins" 
                  trend="" 
                  icon={Clock} 
                  color="bg-purple-500" 
                />
              </div>
            )}

            {activeTab === 'profile' ? (
              <ProfileView user={user} onUpdate={setUser} />
            ) : activeTab === 'admin' ? (
              <AdminView />
            ) : activeTab === 'blog' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogs.map(blog => (
                  <Card key={blog.id} title={blog.title} subtitle={`By ${blog.author} • ${format(new Date(blog.date), 'MMM dd, yyyy')}`}>
                    <div className="space-y-4">
                      <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover rounded-xl" referrerPolicy="no-referrer" />
                      <p className="text-slate-600 line-clamp-3">{blog.content}</p>
                      <button className="text-brand-500 font-bold hover:underline">Read More</button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : activeTab === 'exercise-guide' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {exerciseGuide.map(ex => (
                  <Card key={ex.id} title={ex.name} subtitle={ex.category}>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-full uppercase">{ex.difficulty}</span>
                        <span className="text-[10px] font-bold px-2 py-1 bg-brand-50 text-brand-600 rounded-full uppercase">{ex.targetMuscle}</span>
                      </div>
                      <p className="text-sm text-slate-600">{ex.instructions}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {activeTab === 'dashboard' && (
                  <>
                    <Card title="Weight Progress" subtitle="Last 30 days">
                      <div className="h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={progress.length > 0 ? progress : [{date: '2024-01-01', weight: 70}, {date: '2024-01-02', weight: 71}]}>
                            <defs>
                              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                              dataKey="date" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: '#94a3b8', fontSize: 12}}
                              tickFormatter={(str) => format(new Date(str), 'MMM dd')}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: '#94a3b8', fontSize: 12}}
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card title="Recent Workouts" action={<button className="text-brand-500 text-sm font-bold hover:underline">View All</button>}>
                      <div className="space-y-4">
                        {workouts.length === 0 ? (
                          <div className="text-center py-10">
                            <Dumbbell className="mx-auto text-slate-200 mb-2" size={40} />
                            <p className="text-slate-400">No workouts recorded yet.</p>
                          </div>
                        ) : (
                          workouts.slice(0, 3).map((workout) => (
                            <div key={workout.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50 transition-all group">
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${workout.type === 'strength' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                                  <Dumbbell size={20} />
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900">{workout.name}</h4>
                                  <p className="text-xs text-slate-500">{format(new Date(workout.date), 'MMM dd, yyyy')}</p>
                                </div>
                              </div>
                              <ChevronRight className="text-slate-300 group-hover:text-slate-500 transition-colors" size={20} />
                            </div>
                          ))
                        )}
                      </div>
                    </Card>
                  </>
                )}

                {activeTab === 'workouts' && (
                  <Card title="Workout Routines">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        onClick={() => setShowWorkoutForm(true)}
                        className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center hover:border-brand-500 hover:bg-brand-50 transition-all cursor-pointer group"
                      >
                        <div className="bg-slate-100 p-4 rounded-full mb-4 group-hover:bg-brand-100 transition-colors">
                          <Plus className="text-slate-400 group-hover:text-brand-500" size={32} />
                        </div>
                        <h4 className="font-bold text-slate-900">Create New Routine</h4>
                        <p className="text-sm text-slate-500">Add exercises, sets, and reps</p>
                      </div>
                      {workouts.map(w => (
                         <div key={w.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                            <button 
                              onClick={() => deleteWorkout(w.id)}
                              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                            <div className="flex justify-between items-start mb-4">
                               <h4 className="font-bold text-slate-900">{w.name}</h4>
                               <span className="text-xs font-bold px-2 py-1 bg-white rounded-full text-slate-500 border border-slate-200 uppercase tracking-wider">{w.type}</span>
                            </div>
                            <div className="space-y-2">
                               {w.exercises.map((ex, i) => (
                                  <div key={i} className="flex justify-between text-sm">
                                     <span className="text-slate-600">{ex.name}</span>
                                     <span className="font-medium text-slate-900">{ex.sets}x{ex.reps} • {ex.weight}kg</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                      ))}
                    </div>
                  </Card>
                )}

                {activeTab === 'nutrition' && (
                  <Card title="Nutrition Logs">
                    <div className="space-y-4">
                      <div 
                        onClick={() => setShowNutritionForm(true)}
                        className="p-4 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 hover:border-brand-500 hover:bg-brand-50 transition-all cursor-pointer text-slate-500 hover:text-brand-500 font-bold"
                      >
                        <Plus size={20} /> Log New Meal
                      </div>
                      {nutrition.map(n => (
                        <div key={n.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{n.mealType}</span>
                              <h4 className="font-bold text-slate-900">{n.foodItems}</h4>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{format(new Date(n.date), 'MMM dd, yyyy HH:mm')}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-bold text-slate-900">{n.calories} kcal</p>
                              <p className="text-[10px] text-slate-400">P: {n.protein}g • C: {n.carbs}g • F: {n.fats}g</p>
                            </div>
                            <button 
                              onClick={() => deleteNutrition(n.id)}
                              className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {activeTab === 'progress' && (
                  <Card title="Progress History">
                    <div className="space-y-4">
                      <div 
                        onClick={() => setShowProgressForm(true)}
                        className="p-4 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 hover:border-brand-500 hover:bg-brand-50 transition-all cursor-pointer text-slate-500 hover:text-brand-500 font-bold"
                      >
                        <Plus size={20} /> Record New Progress
                      </div>
                      {progress.slice().reverse().map(p => (
                        <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group">
                          <div>
                            <h4 className="font-bold text-slate-900">{p.weight} kg</h4>
                            <p className="text-xs text-slate-500">{format(new Date(p.date), 'MMM dd, yyyy')}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            {p.bodyFat && (
                              <div className="text-right">
                                <p className="font-bold text-slate-900">{p.bodyFat}%</p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Body Fat</p>
                              </div>
                            )}
                            <button 
                              onClick={() => deleteProgress(p.id)}
                              className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              <div className="space-y-8">
                <Card title="Daily Goals">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700">Calories</span>
                        <span className="text-slate-500">{todayCalories.toLocaleString()} / {calorieGoal.toLocaleString()} kcal</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min((todayCalories / calorieGoal) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700">Protein</span>
                        <span className="text-slate-500">{todayProtein} / {proteinGoal}g</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((todayProtein / proteinGoal) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700">Water</span>
                        <span className="text-slate-500">{todayWater} / {waterGoal} L</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${Math.min((todayWater / waterGoal) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="Upcoming Goals">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-brand-50 border border-brand-100">
                      <div className="bg-brand-500 p-2 rounded-lg mt-1">
                        <Target className="text-white" size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Reach 75kg</h4>
                        <p className="text-xs text-slate-500 mt-1">Target date: May 15, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="bg-slate-200 p-2 rounded-lg mt-1">
                        <Target className="text-slate-500" size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">100kg Bench Press</h4>
                        <p className="text-xs text-slate-500 mt-1">Target date: Jun 01, 2024</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      </main>
    </div>
  );
}
