import { useState, useRef } from 'react';
import Button from '../Button/Button';
import styles from './TextUpload.module.css';

const TextUpload = ({ onUpload, loading, onReset }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  // ファイル選択時の処理
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      const allowedTypes = [
        'text/plain',
        'text/html',
        'text/css',
        'text/javascript',
        'application/json',
        'text/markdown',
        'text/xml'
      ];
      
      const fileExtensions = ['.txt', '.html', '.css', '.js', '.json', '.md', '.xml', '.csv'];
      const isValidExtension = fileExtensions.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      );
      
      if (!allowedTypes.includes(file.type) && !isValidExtension) {
        setMessage('テキストファイルのみアップロード可能です (.txt, .html, .css, .js, .json, .md, .xml, .csv)');
        setSelectedFile(null);
        setTextContent('');
        return;
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setMessage('テキストファイルサイズは10MB以下にしてください');
        setSelectedFile(null);
        setTextContent('');
        return;
      }

      setSelectedFile(file);
      setMessage('');

      // ファイル内容を読み込み
      const reader = new FileReader();
      reader.onload = (e) => {
        setTextContent(e.target.result);
      };
      reader.onerror = () => {
        setMessage('ファイルの読み込みに失敗しました');
      };
      reader.readAsText(file);
    }
  };

  // アップロード処理
  const handleUpload = () => {
    if (!selectedFile) {
      setMessage('テキストファイルを選択してください');
      return;
    }
    onUpload(selectedFile, 'テキスト');
  };

  // リセット処理
  const handleReset = () => {
    setSelectedFile(null);
    setTextContent('');
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
        <div className={styles.dropIcon}>📄</div>
        <p className={styles.dropText}>
          テキストファイルをドラッグ&ドロップ<br />
          または<strong>クリックして選択</strong>
        </p>
        <p className={styles.dropSubtext}>
          対応形式: .txt, .html, .css, .js, .json, .md, .xml, .csv<br />
          最大ファイルサイズ: 10MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.html,.css,.js,.json,.md,.xml,.csv,text/*"
        onChange={handleFileSelect}
        className={styles.hiddenInput}
      />

      {/* ファイル情報 */}
      {selectedFile && (
        <div className={styles.fileInfo}>
          <h4>選択されたテキストファイル:</h4>
          <p>📄 {selectedFile.name}</p>
          <p>サイズ: {(selectedFile.size / 1024).toFixed(2)} KB</p>
          <p>タイプ: {selectedFile.type || '不明'}</p>
        </div>
      )}

      {/* テキスト内容プレビュー */}
      {textContent && (
        <div className={styles.textPreview}>
          <h4>📖 ファイル内容プレビュー:</h4>
          <div className={styles.textContent}>
            <pre>{textContent.substring(0, 1000)}</pre>
            {textContent.length > 1000 && (
              <p className={styles.truncateNote}>
                ... (最初の1000文字のみ表示)
              </p>
            )}
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
      <div className={styles.instructions}>
        <h4>📋 使用方法:</h4>
        <ol>
          <li>テキストファイル(.txt, .html, .css, .js, .json, .md, .xml, .csv)を選択</li>
          <li>ファイルサイズが10MB以下であることを確認</li>
          <li>プレビューで内容を確認</li>
          <li>「アップロード」ボタンをクリック</li>
        </ol>
      </div>
    </div>
  );
};

export default TextUpload;