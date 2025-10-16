import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import ZipUpload from '../../components/ZipUpload/ZipUpload';
import TextUpload from '../../components/TextUpload/TextUpload';
import styles from './Up.module.css';
import Footer from '../../components/Footer/Footer';
import AssetSaver from '../../components/AssetSaver/AssetSaver';

const Up = () => {
  // planName / folderPath removed — use defaults instead
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [uploadHistory, setUploadHistory] = useState([]);
  const navigate = useNavigate();

  // 初期化時にアップロード履歴を読み込み
  useEffect(() => {
    const savedHistory = localStorage.getItem('uploadHistory');
    if (savedHistory) {
      setUploadHistory(JSON.parse(savedHistory));
    }
  }, []);

  // File System Access APIサポート確認
  const isFileSystemSupported = 'showDirectoryPicker' in window;

  // 指定フォルダにファイルを保存
  const saveFileToFolder = async (file, type) => {
    try {
      if (!isFileSystemSupported) {
        downloadFile(file, type);
        return;
      }

      // フォルダ選択
      const dirHandle = await window.showDirectoryPicker();
  const projectFolderHandle = await dirHandle.getDirectoryHandle('MyProject', { create: true });
      
      // ファイル名決定
      let fileName = file.name || `uploaded_file_${Date.now()}`;
      if (type === 'text' && !fileName.includes('.')) {
        fileName += '.txt';
      }

      // ファイル保存
      const fileHandle = await projectFolderHandle.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      
      if (file instanceof File) {
        await writable.write(file);
      } else {
        await writable.write(file.content || file);
      }
      await writable.close();

  // アップロード履歴に追加
  addToUploadHistory(fileName, type, 'MyProject', '選択フォルダ');

  setMessage(`${fileName} を MyProject フォルダに保存しました！`);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('保存エラー:', error);
        downloadFile(file, type);
      }
    }
  };

  // public 配下のアセットを選択したフォルダに保存する
  // (アセット保存は AssetSaver コンポーネントに委譲しています)

  // ダウンロード代替
  const downloadFile = (file, type) => {
  const blob = file instanceof File ? file : new Blob([file.content || file], { type: 'text/plain' });
  const fileName = file.name || `file_${Date.now()}.txt`;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  // アップロード履歴に追加（ダウンロードの場合）
  addToUploadHistory(fileName, type, 'MyProject', 'ダウンロードフォルダ');
    
    setMessage(`${fileName} をダウンロードしました`);
  };

  // アップロード履歴に追加する関数
  const addToUploadHistory = (fileName, fileType, projectName, location) => {
    const newEntry = {
      id: Date.now(),
      fileName,
      fileType,
      projectName,
      location,
      uploadedAt: new Date().toISOString()
    };

    const updatedHistory = [newEntry, ...uploadHistory.slice(0, 9)]; // 最新10件まで保持
    setUploadHistory(updatedHistory);
    localStorage.setItem('uploadHistory', JSON.stringify(updatedHistory));
  };

  // 履歴をクリアする関数
  const clearUploadHistory = () => {
    setUploadHistory([]);
    localStorage.removeItem('uploadHistory');
    setMessage('アップロード履歴をクリアしました');
  };

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
      setUploadProgress(95);
      
      // ファイルを指定フォルダに保存
      await saveFileToFolder(file, type);
      
      setUploadProgress(100);
      
      setTimeout(() => {
        navigate('/plan');
      }, 2000);

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
    <div className={styles.Container}>
      <Header />
      <div className={styles.cade}>
        <h2 className={styles.title}>ファイルアップロード</h2>
       
          <div className={styles.saveInfo}>
            <h3>📁 保存先情報</h3>
            <div style={{ marginTop: 8 }}>
             <AssetSaver assetPath="/WebApp3_sab.zip" />
            </div>
          </div>
        
        {/* ブラウザサポート確認 */}
        {!isFileSystemSupported && (
          <div className={styles.warningMessage}>
            ⚠️ このブラウザではフォルダ保存がサポートされていません。<br />
            ファイルはダウンロードフォルダに保存されます。
          </div>
        )}

        {/* タブ切り替え */}
        <div>
          <div>
            <button>
              📁 ZIPファイル
            </button>
            <ZipUpload 
              onUpload={handleUpload}
              loading={loading}
              onReset={handleReset}
            />
          </div>
          <div>
            <button>
                📄 テキストファイル
            </button>
            <Button label="テキストを作成" onClick={() => navigate('/text-create')} />
            <TextUpload 
              onUpload={handleUpload}
              loading={loading}
              onReset={handleReset}
            />
            
          </div>
         
        </div>

        {/* ZIPファイルアップロード */}

        {/* テキストファイルアップロード */}
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

        {/* アップロード履歴一覧 */}
        {uploadHistory.length > 0 && (
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h3>📋 アップロード履歴</h3>
              <Button 
                label="🗑️ 履歴クリア"
                onClick={clearUploadHistory}
                disabled={loading}
              />
            </div>
            <div className={styles.historyList}>
              {uploadHistory.map(entry => (
                <div key={entry.id} className={styles.historyItem}>
                  <div className={styles.historyInfo}>
                    <div className={styles.fileName}>
                      📄 {entry.fileName}
                    </div>
                    <div className={styles.fileDetails}>
                      <span className={styles.projectName}>
                        📁 プロジェクト: {entry.projectName}
                      </span>
                      <span className={styles.fileType}>
                        種類: {entry.fileType === 'zip' ? 'ZIPファイル' : 'テキストファイル'}
                      </span>
                      <span className={styles.uploadLocation}>
                        📂 保存先: {entry.location}
                      </span>
                      <span className={styles.uploadTime}>
                        ⏰ {new Date(entry.uploadedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
  <Button label="zip" onClick={() => navigate('/zip-open')} />


      </div>
          <Footer onBack={() => navigate('/Home')} />
    </div>
  );
};

export default Up;