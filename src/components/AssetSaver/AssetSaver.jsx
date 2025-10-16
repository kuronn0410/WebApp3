import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import styles from './AssetSaver.module.css';

const AssetSaver = ({ assetPath = '/WebApp3_sab.zip', onSaved }) => {
  const [dirHandle, setDirHandle] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const isFileSystemSupported = 'showDirectoryPicker' in window;

  const pickDirectory = async () => {
    try {
      setMessage('フォルダを選択中...');
      const dir = await window.showDirectoryPicker();
      setDirHandle(dir);
      setFolderName(dir.name || '選択フォルダ');
      setMessage(`選択されました: ${dir.name}`);
    } catch (err) {
      console.error('ディレクトリ選択エラー', err);
      setMessage('フォルダの選択をキャンセルしました');
    }
  };

  const saveAsset = async (path = assetPath) => {
    setLoading(true);
    setMessage('アセットを取得中...');
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`fetch failed ${res.status}`);

      const arrayBuffer = await res.arrayBuffer();
      console.log('fetched asset size:', arrayBuffer.byteLength);

      if (!isFileSystemSupported || !dirHandle) {
        // fallback: trigger browser download
        const blob = new Blob([arrayBuffer], { type: res.headers.get('content-type') || 'application/zip' });
        const fileName = path.split('/').pop();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setMessage('ブラウザのダウンロードに保存しました');
        onSaved && onSaved({ success: true, path: fileName, method: 'download' });
        return;
      }

      // write into selected dir (write as Blob for compatibility)
      const fileName = path.split('/').pop();
      const fh = await dirHandle.getFileHandle(fileName, { create: true });
      const w = await fh.createWritable();
      const blob = new Blob([arrayBuffer], { type: res.headers.get('content-type') || 'application/zip' });
      await w.write(blob);
      await w.close();

      setMessage(`${fileName} を ${dirHandle.name || '選択フォルダ'} に保存しました`);
      onSaved && onSaved({ success: true, path: fileName, method: 'fs' });
    } catch (err) {
      console.error('保存エラー', err);
      setMessage('保存に失敗しました: ' + (err.message || err));
      onSaved && onSaved({ success: false, error: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <Button label="フォルダを選択" onClick={pickDirectory} disabled={loading} />
        <Button label="アセットを保存" onClick={() => saveAsset(assetPath)} disabled={loading} />
      </div>

      {folderName && <p className={styles.folder}>選択フォルダ: <strong>{folderName}</strong></p>}
      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
};

export default AssetSaver;
