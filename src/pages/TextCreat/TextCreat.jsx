import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TextCreat.module.css';
import Button from '../../components/Button/Button';
import Header from '../../components/Header/Header'; 
import CreatTextfile from '../../components/CreatTextfile/CreatTextfile';
const TextCreat = () => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(''); // ファイル名の状態
  const [textContent, setTextContent] = useState('');
  const navigate = useNavigate();

  const handleSendText = async () => {
    setLoading(true);
    try {
      navigate('/up');
    } catch (error) {
      console.error('テキスト生成エラー:', error);
    } finally { 
      setLoading(false); 
    }
  };

  const handleTextChange = (e) => {
    setTextContent(e.target.value);
  };

  const UpDateText = async () =>{
    setLoading(true);
    try {  
      console.log('テキスト内容:', textContent);
    } catch (error) {
      console.error('エラー:', error);
    } finally {  
      setLoading(false);
    } 
  };


  return (
    <div className={styles.Container}>
      <Header label="プランページ" />
        <div className={styles.Container}>
          <p>ストーリー入力欄</p>
            <textarea 
              className={styles.textarea} 
              placeholder="ここにテキストを入力してください..." 
              value={textContent}           // 現在の入力内容を表示
              onChange={handleTextChange}   // 入力変更時の処理
              rows={10}                     // 行数指定
            />
            <Button label={"確定"} onClick={UpDateText}/>
            <CreatTextfile 
             fileName={fileName} 
             textContent={textContent}
             fileType=".txt"
             onMessage={() => {}}
             disabled={loading}
            />
            <Button 
              label={loading ? "処理中..." : "確定"} 
              onClick={UpDateText}
              disabled={loading || !textContent.trim()}
            />
            <Button 
              label="アップロードページ" 
              onClick={handleSendText} 
              disabled={loading}
            />
        </div>
    </div>
  );
};

export default TextCreat;
