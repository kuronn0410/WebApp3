import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AssetSaver from '../../components/AssetSaver/AssetSaver';
import styles from './ZipD.module.css';

const ZipD = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.Container}>
      <Header />
      <div className={styles.card}>
        <h2>WebApp3_sab.zip を選択フォルダに保存</h2>
        <p className={styles.help}>File System Access API を使って選択したフォルダに ZIP を保存します。未対応ブラウザはダウンロードにフォールバックします。</p>
        <AssetSaver assetPath="/WebApp3_sab.zip" />
      </div>
      <Footer onBack={() => navigate(-1)} />
    </div>
  );
};

export default ZipD;
