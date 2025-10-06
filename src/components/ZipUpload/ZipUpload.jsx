import { useState, useRef } from 'react';
import Button from '../Button/Button';
import styles from './ZipUpload.module.css';

const ZipUpload = ({ onUpload, loading, onReset }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  // ファイル選択時の処理
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      const allowedTypes = [
        'application/zip',
        'application/x-zip-compressed',
        'application/x-zip'
      ];
      
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.zip')) {
        setMessage('ZIPファイルのみアップロード可能です');
        setSelectedFile(null);
        return;
      }

      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        setMessage('ファイルサイズは50MB以下にしてください');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setMessage('');
    }
  };

  // アップロード処理
  const handleUpload = () => {
    if (!selectedFile) {
      setMessage('ZIPファイルを選択してください');
      return;
    }
    onUpload(selectedFile, 'ZIP');
  };

  // リセット処理
  const handleReset = () => {
    setSelectedFile(null);
    setMessage('');
    if (onReset) onReset();
  };

  // ドラッグ&ドロップ処理
  const handleDragAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = { target: { files } };
      handleFileSelect(event);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.dropZone}
        onClick={handleDragAreaClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className={styles.dropIcon}>📁</div>
        <p className={styles.dropText}>
          ZIPファイルをドラッグ&ドロップ<br />
          または<strong>クリックして選択</strong>
        </p>
        <p className={styles.dropSubtext}>
          最大ファイルサイズ: 50MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        onChange={handleFileSelect}
        className={styles.hiddenInput}
      />

      {/* ファイル情報 */}
      {selectedFile && (
        <div className={styles.fileInfo}>
          <h4>選択されたZIPファイル:</h4>
          <p>📁 {selectedFile.name}</p>
          <p>サイズ: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
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

      {/* ボタン */}
      <div className={styles.buttonGroup}>
        <Button 
          label={loading ? "アップロード中..." : "アップロード"} 
          onClick={handleUpload}
          disabled={loading || !selectedFile}
        />
        <Button 
          label="リセット" 
          onClick={handleReset}
          disabled={loading}
        />
      </div>

      {/* 使用方法 */}
      
    </div>
  );
};

export default ZipUpload;