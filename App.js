import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// مكون المقالة
const PostCard = ({ post }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 hover:shadow-xl transition border border-gray-100 dark:border-gray-700">
    <Link to={`/post/${post.slug}`}>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white hover:text-blue-600 transition">
        {post.title}
      </h2>
    </Link>
    <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
      {post.excerpt || '...'}
    </p>
    <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400 gap-2">
      <span>✍️ {post.author || 'كاتب'}</span>
      <span>•</span>
      <span>⏱️ {post.read_time || 3} دقائق</span>
      <span>•</span>
      <span>📅 {new Date(post.created_at || Date.now()).toLocaleDateString('ar-EG')}</span>
    </div>
  </div>
);

// محرر المقالات
const Editor = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('draft');
    if (saved) {
      try {
        const { title: t, content: c } = JSON.parse(saved);
        if (t) setTitle(t);
        if (c) setContent(c);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (content || title) {
        localStorage.setItem('draft', JSON.stringify({ title, content }));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [title, content]);

  return (
    <div className={`${isFocusMode ? 'max-w-3xl mx-auto' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="📝 عنوان المقال..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-bold bg-transparent border-0 outline-none w-full dark:text-white placeholder-gray-400"
        />
        <button
          onClick={() => setIsFocusMode(!isFocusMode)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {isFocusMode ? '🚪 خروج' : '🎯 تركيز'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="اكتب مقالك هنا... يدعم Markdown"
            className="w-full h-[500px] p-4 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
          <button
            onClick={() => onSave({ title, content })}
            className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
          >
            ✍️ نشر المقال
          </button>
        </div>

        <div className="hidden lg:block">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700 h-[500px] overflow-auto">
            <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">👁️ معاينة:</h3>
            <div className="prose dark:prose-invert max-w-none">
              <h1>{title || 'العنوان هنا'}</h1>
              <ReactMarkdown>{content || '*اكتب لتظهر المعاينة*'}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// الصفحة الرئيسية
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // محاكاة API (استبدلها بـ API الحقيقي)
    setPosts([
      {
        id: 1,
        title: 'كيف تكتب رواية في 30 يوماً',
        excerpt: 'دليل عملي لكتابة روايتك الأولى خلال شهر واحد فقط...',
        author: 'أحمد الكاتب',
        read_time: 5,
        slug: 'how-to-write-novel',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'أسرار الكتابة الإبداعية',
        excerpt: 'تقنيات مبتكرة لتطوير أسلوبك الكتابي...',
        author: 'سارة الناقد',
        read_time: 4,
        slug: 'creative-writing-secrets',
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            📚 منصة الكتاب
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/write"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              ✍️ اكتب
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-xl"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            📖 أحدث المقالات
          </h2>
          <span className="text-sm text-gray-500">{posts.length} مقال</span>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <p className="text-4xl mb-4">📝</p>
            <p>لا توجد مقالات بعد</p>
            <Link to="/write" className="text-blue-600 hover:underline">
              اكتب أول مقال
            </Link>
          </div>
        ) : (
          posts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </main>
    </div>
  );
};

// التطبيق الرئيسي
const App = () => {
  const handleSave = async (data) => {
    if (!data.title.trim() || !data.content.trim()) {
      alert('⚠️ الرجاء إدخال عنوان ومحتوى');
      return;
    }

    try {
      // اتصل بالـ API الحقيقي
      // await axios.post('/api/posts', data);
      alert('✅ تم نشر مقالك بنجاح!');
      localStorage.removeItem('draft');
      window.location.href = '/';
    } catch (error) {
      alert('❌ حدث خطأ، حاول مرة أخرى');
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/write" element={<Editor onSave={handleSave} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
