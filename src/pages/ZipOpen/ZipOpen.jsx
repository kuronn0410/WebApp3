import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { unzip } from 'fflate';
import JSZip from 'jszip';
import styles from './ZipOpen.module.css';
import Button from '../../components/Button/Button';
import Header from '../../components/Header/Header';

const ZipOpen = () => {
  const navigate = useNavigate();
  const [dirHandle, setDirHandle] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [zipFiles, setZipFiles] = useState([]);
  const [selectedZipHandle, setSelectedZipHandle] = useState(null);
  const [selectedZipName, setSelectedZipName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // フォルダ選択して.zipをスキャン
  const pickDirectoryAndScan = async () => {
    try {
      setMessage('フォルダを選択中...');
      const dir = await window.showDirectoryPicker();
      setDirHandle(dir);
      setFolderName(dir.name || '選択フォルダ');

      const found = [];
      for await (const [name, handle] of dir.entries()) {
        if (handle.kind === 'file' && name.toLowerCase().endsWith('.zip')) {
          found.push({ name, handle });
        }
      }
      setZipFiles(found);
      setMessage(`${found.length} 個の zip を検出しました`);
    } catch (err) {
      console.error('フォルダ選択エラー:', err);
      setMessage('フォルダの選択がキャンセルされました。');
    }
  };

  // ZIP ファイルを直接選択
  const pickZipFileWithFSA = async () => {
    try {
      setMessage('ZIPファイルを選択中...');
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'ZIP files',
            accept: { 'application/zip': ['.zip'] },
          },
        ],
        multiple: false,
      });
      setSelectedZipHandle(handle);
      setSelectedZipName(handle.name || 'selected.zip');
      setMessage(`選択: ${handle.name}`);
    } catch (err) {
      console.error('ZIP 選択キャンセル/エラー', err);
      setMessage('ZIP の選択がキャンセルされました');
    }
  };

  // メイン: ZIP を確実に解凍
  const unzipFileHandle = async (fileHandle) => {
    if (!dirHandle) {
      setMessage('先にフォルダを選択してください');
      return;
    }

    setLoading(true);
    setMessage('解凍準備中...');

    try {
      const file = await fileHandle.getFile();
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);

      // ZIP ヘッダ確認
      if (uint8[0] !== 0x50 || uint8[1] !== 0x4b) {
        setMessage('このファイルは ZIP ではない可能性があります');
        setLoading(false);
        return;
      }

      const baseName = file.name.replace(/\.zip$/i, '');
      const rootHandle = await dirHandle.getDirectoryHandle(baseName, { create: true });

      // Local unzip (fflate with JSZip fallback)
      await new Promise((resolve, reject) => {
        unzip(uint8, { filenameEncoding: 'utf-8' }, async (err, entries) => {
          if (err) {
            console.warn('fflate解凍失敗、JSZipで再試行します:', err);
            try {
              const zip = await JSZip.loadAsync(uint8);
              let i = 0;
              const total = Object.keys(zip.files).length;
              for (const [name, entry] of Object.entries(zip.files)) {
                i++;
                setMessage(`(${i}/${total}) ${name} を展開中...`);
                if (entry.dir) continue;
                const data = await entry.async('uint8array');
                await writeFileToDir(rootHandle, name, data);
              }
              resolve();
            } catch (fallbackErr) {
              reject(fallbackErr);
            }
            return;
          }

          // fflate成功時
          let count = 0;
          const total = Object.keys(entries).length;
          for (const [entryName, data] of Object.entries(entries)) {
            count++;
            setMessage(`(${count}/${total}) ${entryName} を展開中...`);
            await writeFileToDir(rootHandle, entryName, data);
          }
          resolve();
        });
      });

      setMessage(`${file.name} を ${baseName} フォルダに展開しました`);
    } catch (err) {
      console.error('解凍エラー:', err);
      setMessage('解凍に失敗しました: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // ファイル書き込みヘルパー（重複ファイル名対策付き）
  const writeFileToDir = async (rootHandle, path, data) => {
    const parts = path.split('/').filter(Boolean);
    let parent = rootHandle;

    // 中間ディレクトリ作成
    for (let i = 0; i < parts.length - 1; i++) {
      parent = await parent.getDirectoryHandle(parts[i], { create: true });
    }

    const baseName = parts[parts.length - 1];
    if (!baseName) return;

    // 同名ファイルがある場合は _1, _2... に変更
    let name = baseName;
    let idx = 1;
    while (true) {
      try {
        await parent.getFileHandle(name);
        name = baseName.replace(/(\.[^.]*)?$/, `_${idx++}$1`);
      } catch {
        break;
      }
    }

    const fh = await parent.getFileHandle(name, { create: true });
    const writable = await fh.createWritable();
    await writable.write(data);
    await writable.close();
  };

  // すべて解凍
  const unzipAll = async () => {
    if (!zipFiles.length) {
      setMessage('解凍する zip がありません');
      return;
    }
    for (const z of zipFiles) {
      // awaitで直列実行（権限の問題を避ける）
      // eslint-disable-next-line no-await-in-loop
      await unzipFileHandle(z.handle);
    }
  };

  return (
    <div className={styles.Container}>
      <Header label="" />
      <div className={styles.content}>
        <h2>フォルダ内の ZIP を安全に解凍</h2>
        <div style={{ marginBottom: 12 }}>
          <Button label="フォルダを選択" onClick={pickDirectoryAndScan} disabled={loading} />
          <Button label="一覧を再スキャン" onClick={() => pickDirectoryAndScan()} disabled={loading || !dirHandle} />
          <Button label="ZIP をファイル選択" onClick={pickZipFileWithFSA} disabled={loading} />
        </div>

        {folderName && <p>選択フォルダ: {folderName}</p>}

        {selectedZipName && (
          <div style={{ marginTop: 8 }}>
            <strong>選択ZIP:</strong> {selectedZipName}{' '}
            <Button
              label="解凍"
              onClick={() => selectedZipHandle && unzipFileHandle(selectedZipHandle)}
              disabled={loading}
            />
          </div>
        )}

        {zipFiles.length > 0 ? (
          <div>
            <h3>検出された zip</h3>
            <Button label="すべて解凍" onClick={unzipAll} disabled={loading} />
            <ul>
              {zipFiles.map((z) => (
                <li key={z.name} style={{ marginTop: 8 }}>
                  {z.name}{' '}
                  <Button label="解凍" onClick={() => unzipFileHandle(z.handle)} disabled={loading} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>フォルダ内に .zip が見つかりませんでした</p>
        )}

        {message && <div style={{ marginTop: 12 }}>{message}</div>}
      </div>

      <Button label="戻る" onClick={() => navigate(-1)} />
    </div>
  );
};

export default ZipOpen;
