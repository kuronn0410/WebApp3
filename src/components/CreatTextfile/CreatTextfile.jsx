import { useState } from 'react';
import Button from '../Button/Button';
import styles from './CreatTextfile.module.css';


const CreatTextfile = ({
    fileName, 
    textContent, 
    fileType = '.txt',
    onMessage,
    disabled = false,
    className = '',
    children
}) => {

    const [loading, setLoading] = useState(false);
    const handleCreateTextFile = () => {
         // ファイル名のバリデーション
        if (!fileName?.trim()) {
            onMessage?.('ファイル名を入力してください', 'error');
            return; // エラーの場合は処理を中断
        }

        // ファイル作成成功メッセージを送信
        onMessage?.(`${fileName}${fileType} を作成しました！`, 'success');
    };

    const getFileTypeInfo = (type) => {
        const types = {
            '.txt': { name: 'テキスト', mimeType: 'text/plain' },
            '.html': { name: 'HTML', mimeType: 'text/html' },
            '.css': { name: 'CSS', mimeType: 'text/css' },
            '.js': { name: 'JavaScript', mimeType: 'text/javascript' },
            '.json': { name: 'JSON', mimeType: 'application/json' }
        };
        return types[type] || types['.txt'];
    };


    const handleDownload = async () => {
        setLoading(true);
        try {
            // ファイル名が空でないかチェック
            if (!fileName?.trim()) {
                onMessage?.('ファイル名を入力してください', 'error');
                return;
            }

            // 1. テキストファイルをブラウザ内で生成
            const blob = new Blob([textContent || ''], { 
                type: getFileTypeInfo(fileType).mimeType // ファイル形式に応じたMIMEタイプを設定
            });

            // 2. ブラウザ内でアクセス可能なURLを作成
            const url = URL.createObjectURL(blob);

            // 3. ダウンロード用のリンク要素を動的に作成
            const link = document.createElement('a');
            link.href = url;                    // ファイルのURL
            link.download = fileName + fileType; // ダウンロード時のファイル名
            document.body.appendChild(link);    // ページに一時的に追加

            // 4. プログラムでクリックを実行してダウンロード開始
            link.click();

            // 5. 不要になった要素とURLをクリーンアップ
            document.body.removeChild(link);    // リンク要素を削除
            URL.revokeObjectURL(url);          // メモリ解放

            // 成功メッセージを送信
            onMessage?.(`${fileName}${fileType} をダウンロードしました！`, 'success');

        } catch (error) {
            // エラーが発生した場合の処理
            onMessage?.('ダウンロードに失敗しました', 'error');
            console.error('Download error:', error); // デバッグ用ログ出力
        } finally {
            // 成功・失敗に関係なく最後に実行される処理
            setLoading(false); // ローディング終了
        }
    };
    return (
    <div className={styles.Container}>
        {/* テキストファイル作成ボタン */}
            <Button 
                label="テキストファイル作成" 
                onClick={handleCreateTextFile}
                disabled={disabled} // 親から渡されたdisabled状態を適用
            />
            
            {/* ダウンロードボタン */}
            <Button 
                label={loading ? "ダウンロード中..." : "💾 ダウンロード"} 
                onClick={handleDownload}
                disabled={disabled || loading || !fileName?.trim()} // 複数条件でボタンを無効化
            />
    </div>
    );

};

export default CreatTextfile;