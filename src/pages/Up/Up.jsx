import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Up.module.css';
import Button from '../../components/Button/Button';
import Header from '../../components/Header/Header'; 
const Up = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <Header label="プランページ" />
        <div className={styles.Container}>
            
            <Button label="" onClick={() => navigate('/')} />
        </div>
    </div>
  );
};

export default Up;
