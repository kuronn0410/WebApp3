import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '../firebase/auth/login';
import { signUpWithGoogle } from '../firebase/auth/signup';
import { getAuthErrorMessage } from '../firebase/auth/emailAuth';
import './Login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError('');
      
      let user;
      if (isSignUp) {
        user = await signUpWithGoogle();
        setSuccess('Googleサインアップが完了しました！');
      } else {
        user = await loginWithGoogle();
        setSuccess('Googleログインが完了しました！');
      }
      
      console.log('Google認証成功:', user);
      
      // 成功後、ホームページへリダイレクト
      setTimeout(() => {
        navigate('/home');
      }, 1500);
      
    } catch (error) {
      console.error('Google認証エラー:', error);
      setError(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-container">
      {/* 背景装飾 */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="login-card">
        {/* ヘッダー */}
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">🔐</div>
            <h1>WebApp3</h1>
          </div>
          <h2>{isSignUp ? 'アカウント作成' : 'ログイン'}</h2>
          <p className="login-subtitle">
            {isSignUp 
              ? 'Googleアカウントで新規登録' 
              : 'Googleアカウントでログイン'
            }
          </p>
        </div>

        {/* メッセージ表示 */}
        {error && (
          <div className="message error-message">
            <span className="message-icon">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="message success-message">
            <span className="message-icon">✅</span>
            {success}
          </div>
        )}

        {/* Google認証ボタン */}
        <button 
          className="google-btn"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span>処理中...</span>
            </div>
          ) : (
            <>
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Googleで{isSignUp ? 'サインアップ' : 'ログイン'}</span>
            </>
          )}
        </button>

        {/* モード切り替え */}
        <div className="switch-mode">
          <p>
            {isSignUp 
              ? 'すでにアカウントをお持ちですか？' 
              : 'アカウントをお持ちでない方は'
            }
          </p>
          <button 
            type="button"
            className="switch-btn"
            onClick={switchMode}
            disabled={loading}
          >
            {isSignUp ? 'ログイン' : 'サインアップ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;