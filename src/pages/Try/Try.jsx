import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { unzipSync } from 'fflate';
import styles from './Try.module.css';
import Button from '../../components/Button/Button';
import Header from '../../components/Header/Header'; 

const Try = () => {
  const navigate = useNavigate();


  
  return (
    <div className={styles.Container}>
      <Header label="" />
      <div className={styles.content}>
      <Button label="ZipD" onClick={() => {navigate("/zip-d")}} />
        
      </div>
      <Button label="戻る" onClick={() => navigate(-1)} />  
    </div>
  );
};

export default Try;