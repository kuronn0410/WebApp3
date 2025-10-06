import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '../../firebase/auth/login';
import { signUpWithGoogle } from '../../firebase/auth/signup';
import { getAuthErrorMessage } from '../../firebase/auth/emailAuth';
import styles from './Login.module.css';

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
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* ヘッダー */}
        <div className={styles.loginHeader}>
          <h1 className={styles.logo}>WebApp3</h1>
          <h2 className={styles.title}>
            {isSignUp ? 'アカウント作成' : 'ログイン'}
          </h2>
          <p className={styles.subtitle}>
            {isSignUp 
              ? 'Googleアカウントで新規登録' 
              : 'Googleアカウントでログイン'
            }
          </p>
        </div>

        {/* メッセージ表示 */}
        {error && (
          <div className={`${styles.message} ${styles.errorMessage}`}>
            {error}
          </div>
        )}

        {success && (
          <div className={`${styles.message} ${styles.successMessage}`}>
            {success}
          </div>
        )}

        {/* Google認証ボタン */}
        <button 
          onClick={handleGoogleAuth}
          disabled={loading}
          className={`${styles.googleBtn} ${loading ? styles.loading : ''}`}
        >
          {loading ? (
            <>
              <div className={styles.spinner}></div>
              処理中...
            </>
          ) : (
            <>
              <span className={styles.icon}>🔗</span>
              Googleで{isSignUp ? 'サインアップ' : 'ログイン'}
            </>
          )}
        </button>

        {/* モード切り替え */}
        <div className={styles.switchMode}>
          <p className={styles.switchText}>
            {isSignUp 
              ? 'すでにアカウントをお持ちですか？' 
              : 'アカウントをお持ちでない方は'
            }
          </p>
          <button 
            type="button"
            onClick={switchMode}
            disabled={loading}
            className={`${styles.switchBtn} ${loading ? styles.disabled : ''}`}
          >
            {isSignUp ? 'ログイン' : 'サインアップ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;