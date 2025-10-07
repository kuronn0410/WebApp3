import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Try.module.css';
import Button from '../../components/Button/Button';
import Header from '../../components/Header/Header'; 

const Try = () => {
  const [loading, setLoading] = useState(false);
  const [planName, setPlanName] = useState(''); 
  const [selectedFolder, setSelectedFolder] = useState(null); // 選択されたフォルダ
  const [folderPath, setFolderPath] = useState(''); // フォルダの完全パス
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // フォルダ選択処理（File System Access API対応ブラウザ用）
  const handleFolderSelect = async () => {
    try {
      // File System Access APIをサポートしているかチェック
      if ('showDirectoryPicker' in window) {
        const dirHandle = await window.showDirectoryPicker();
        setSelectedFolder(dirHandle);
        
        // フォルダパスを取得して記録
        try {
          const folderPath = await getFolderPath(dirHandle);
          setFolderPath(folderPath);
          setMessage(`フォルダが選択されました: ${folderPath}`);
        } catch (pathError) {
          setFolderPath(dirHandle.name);
          setMessage(`フォルダが選択されました: ${dirHandle.name}`);
        }
      } else {
        // サポートしていない場合は従来の方法
        setMessage('このブラウザではフォルダ選択がサポートされていません。プラン名でフォルダを作成します。');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('フォルダ選択エラー:', error);
        setMessage('フォルダ選択に失敗しました');
      }
    }
  };

  // フォルダパスを取得するヘルパー関数
  const getFolderPath = async (dirHandle) => {
    try {
      // File System Access APIを使用してパスを構築
      const pathParts = [];
      let currentHandle = dirHandle;
      
      // パス情報を取得（可能な範囲で）
      pathParts.unshift(currentHandle.name);
      
      return pathParts.join('/');
    } catch (error) {
      console.log('パス取得エラー:', error);
      return dirHandle.name; // フォルダ名のみ返す
    }
  };

  const isFileSystemSupported = 'showDirectoryPicker' in window;

  return (
    <div className={styles.Container}>
      <Header label="プランページ" />
      <div className={styles.content}>
        
        {/* プラン名入力 */}
        <div className={styles.inputSection}>
          <label className={styles.label}>📁 プロジェクト名:</label>
          <input 
            type="text" 
            placeholder="プラン名を入力してください"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className={styles.input}
          />
        </div>

        {/* フォルダ選択セクション */}
        <div className={styles.folderSection}>
          <label className={styles.label}>📂 保存先フォルダ:</label>
          <div className={styles.folderSelectGroup}>
            <Button
              label={selectedFolder ? `選択済み: ${selectedFolder.name}` : "📂 フォルダを選択"}
              onClick={handleFolderSelect}
              disabled={loading || !isFileSystemSupported}
            />
            {!isFileSystemSupported && (
              <p className={styles.browserNote}>
                ※ このブラウザではフォルダ選択がサポートされていません。<br />
                Chrome、Edge等の最新ブラウザをご利用ください。
              </p>
            )}
          </div>
        </div>

        {/* 選択状態表示 */}
        {selectedFolder && (
          <div className={styles.selectionInfo}>
            <p>📂 保存先: {folderPath}/{planName}/</p>
          </div>
        )}

        {/* メッセージ表示 */}
        {message && (
          <div className={`${styles.message} ${
            message.includes('失敗') || message.includes('ください') 
              ? styles.errorMessage 
              : styles.successMessage
          }`}>
            {message}
          </div>
        )}

        {/* アクションボタン */}
        <div className={styles.actionButtons}>
          <Button 
            label="アップロードページ" 
            onClick={() => navigate('/up')} 
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Try;