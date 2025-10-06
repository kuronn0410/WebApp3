import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import ZipUpload from '../../components/ZipUpload/ZipUpload';
import TextUpload from '../../components/TextUpload/TextUpload';
import styles from './Try.module.css';
import Footer from '../../components/Footer/Footer';

const Try = () => {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('zip'); // 'zip' または 'text'
  const navigate = useNavigate();

  // アップロード処理
  const handleUpload = async (file, type) => {
    setLoading(true);
    setUploadProgress(0);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // 実際のアップロード処理をここに実装
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadProgress(100);
      setMessage(`${type}ファイルのアップロードが完了しました！`);
      
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      console.error('アップロードエラー:', error);
      setMessage('アップロードに失敗しました。再試行してください。');
    } finally {
      setLoading(false);
    }
  };

  // リセット処理
  const handleReset = () => {
    setMessage('');
    setUploadProgress(0);
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.Container}>
        <h2 className={styles.title}>ファイルアップロード</h2>

        {/* タブ切り替え */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === 'zip' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('zip')}
          >
            📁 ZIPファイル
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'text' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('text')}
          >
            📄 テキストファイル
          </button>
        </div>

        {/* ZIPファイルアップロード */}
        {activeTab === 'zip' && (
          <ZipUpload 
            onUpload={handleUpload}
            loading={loading}
            onReset={handleReset}
          />
        )}

        {/* テキストファイルアップロード */}
        {activeTab === 'text' && (
          <TextUpload 
            onUpload={handleUpload}
            loading={loading}
            onReset={handleReset}
          />
        )}

        {/* プログレスバー */}
        {loading && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className={styles.progressText}>
              アップロード中... {uploadProgress}%
            </p>
          </div>
        )}

        {/* メッセージ表示 */}
        {message && (
          <div className={`${styles.message} ${
            message.includes('失敗') || message.includes('できません') 
              ? styles.errorMessage 
              : styles.successMessage
          }`}>
            {message}
          </div>
        )}

        {/* 戻るボタン */}
        <div className={styles.buttonGroup}>
          <Footer onBack={() => navigate('/')} />
        </div>
      </div>
    </div>
  );
};

export default Try;