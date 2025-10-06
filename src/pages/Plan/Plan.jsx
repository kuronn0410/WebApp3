import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Plan.module.css';
import Button from '../../components/Button/Button';
import Header from '../../components/Header/Header'; 
const Plan = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <Header label="プランページ" />
        <div className={styles.Container}>
            <input 
            type="text" 
            placeholder="プラン名を入力してください"
            style={{
                padding: '10px',
                marginRight: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc'
            }}
            />
            <Button label="アップロードページ" onClick={() => navigate('/up')} />
        </div>
    </div>
  );
};

export default Plan;
