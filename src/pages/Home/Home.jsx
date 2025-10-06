import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import './Home.css';
import Button from '../../components/Button/Button';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // ユーザーがログインしていない場合はログインページへ
      if (!currentUser) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // リダイレクト中
  }

  return (
    <div className="home-container">
      {/* 背景装飾 */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* ナビゲーションバー */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-logo">🚀</span>
          <span className="nav-title">WebApp3</span>
        </div>
        <div className="nav-user">
          <div className="user-info">
            <img 
              src={user.photoURL || 'https://via.placeholder.com/40'} 
              alt="プロフィール"
              className="user-avatar"
            />
            <span className="user-name">{user.displayName || user.email}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            ログアウト
          </button>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="main-content">
        {/* ウェルカムセクション */}
        <section className="welcome-section">
          <div className="welcome-card">
            <h1 className="welcome-title">
              <span className="wave">👋</span>
              ようこそ、{user.displayName || 'ユーザー'}さん！
            </h1>
            <p className="welcome-message">
              ログインが完了しました。WebApp3へようこそ！
            </p>
            <div className="welcome-stats">
              <div className="stat-item">
                <span className="stat-icon">⚡</span>
                <span className="stat-label">高速</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🔒</span>
                <span className="stat-label">安全</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🎨</span>
                <span className="stat-label">美しい</span>
              </div>
            </div>
          </div>
        </section>

        {/* 機能カード */}
        <section className="features-section">
          <h2 className="section-title">利用可能な機能</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3 className="feature-title">設定</h3>
              <p className="feature-description">
                アプリケーション設定とカスタマイズ
              </p>
              <button className="feature-btn">
                設定
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
          <div className="features-grid" >
            <Button label="計画" onClick={() => navigate('/plan')} />
            <Button label="Try" onClick={() => navigate('/try')} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;