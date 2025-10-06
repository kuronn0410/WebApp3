import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import ZipUpload from '../../components/ZipUpload/ZipUpload';
import TextUpload from '../../components/TextUpload/TextUpload';
import styles from './Try.module.css';
import Footer from '../../components/Footer/Footer';

const Try = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.Container}>
      <Header />
      <div className={styles.cade}>

      </div>
          <Footer onBack={() => navigate('/Home')} />
    </div>
  );
};

export default Try;