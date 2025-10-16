import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Plan.module.css';
import Button from '../../components/Button/Button';
import Header from '../../components/Header/Header'; 
import Footer from '../../components/Footer/Footer';
const Plan = () => {
  const [loading, setLoading] = useState(false);
  const [planName, setPlanName] = useState(''); 
  const [selectedFolder, setSelectedFolder] = useState(null); // 選択されたフォルダ
  const [folderPath, setFolderPath] = useState(''); // フォルダの完全パス
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
   // ローカルストレージからプラン名を読み込み
  useEffect(() => {
    const savedPlanName = localStorage.getItem('planName');
    if (savedPlanName) {
      setPlanName(savedPlanName);
    }

    const savedFolderPath = localStorage.getItem('folderPath');
    if (savedFolderPath) {
      setFolderPath(savedFolderPath);
    }
  }, []);
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

  const handlePlanNameChange = (e) => {
    //valueの値を入れる
    const newPlanName = e.target.value;
    setPlanName(newPlanName);
    localStorage.setItem('planName', newPlanName);
  };

   // フォルダパスをクリアする関数（オプション）
  const clearFolderPath = () => {
    setFolderPath('');
    setSelectedFolder(null);
    localStorage.removeItem('folderPath');
    setMessage('フォルダ選択をクリアしました');
  };

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
  // File System Access APIのサポート確認
  const isFileSystemSupported = 'showDirectoryPicker' in window;
  
  const sendplan = () => {

    navigate('/up', { 
    state: { 
      planName: planName,
      folderPath: folderPath 
    } 
  });
  }

  return (
    <div className={styles.Container}>
      <Header label="プランページ" />
        <div className={styles.cade}>
            <input 
              type="text" 
              placeholder="プラン名を入力してください"
              value={planName}                    // 状態を表示
              onChange={handlePlanNameChange}     // 入力変更時に保存
              style={{
                  padding: '10px',
                  marginRight: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc'
              }}
            />
            <div>
              <label>📁 プロジェクト名:</label>
              <div className={styles.folderSelect}>
                <Button 
                  label={selectedFolder ? `選択済み: ${selectedFolder.name}` : "📂 フォルダを選択"}
                  onClick={handleFolderSelect}
                  disabled={loading || !isFileSystemSupported}
                />

                 {folderPath && (
                  <Button 
                    label="🗑️ クリア"
                    onClick={clearFolderPath}
                    disabled={loading}
                  />
                )}

                {(selectedFolder||folderPath) && (
                <div className={styles.selectionInfo}>
                  <p>📂 保存先: {folderPath}/{planName}/</p>
                </div>
                )}
              </div>

              
            </div>
            <Button label="アップロードページ" onClick={sendplan} />
            <Button label="アップロードページ" onClick={sendplan} />
        </div>
        <Footer onBack={() => navigate(-1)}/>
    </div>
  );
};

export default Plan;
