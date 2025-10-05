// emailAuth.js
import { auth, db } from "../firebaseConfig";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// メール・パスワードでサインアップ
export async function signUpWithEmail(email, password, displayName = '') {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ユーザーのプロフィールを更新
    if (displayName) {
      await updateProfile(user, {
        displayName: displayName
      });
    }

    // Firestoreにユーザー情報を保存
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: displayName || user.email,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date(),
    });

    console.log("メールサインアップ成功:", user);
    return user;
  } catch (error) {
    console.error("メールサインアップエラー:", error.code, error.message);
    throw error;
  }
}

// メール・パスワードでログイン
export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("メールログイン成功:", user);
    return user;
  } catch (error) {
    console.error("メールログインエラー:", error.code, error.message);
    throw error;
  }
}

// エラーメッセージを日本語に変換
export function getAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'ユーザーが見つかりません。';
    case 'auth/wrong-password':
      return 'パスワードが間違っています。';
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています。';
    case 'auth/weak-password':
      return 'パスワードが短すぎます。6文字以上で入力してください。';
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません。';
    case 'auth/invalid-credential':
      return '認証情報が無効です。メールアドレスとパスワードを確認してください。';
    case 'auth/too-many-requests':
      return 'リクエストが多すぎます。しばらく時間をおいてから再試行してください。';
    default:
      return '認証エラーが発生しました。もう一度お試しください。';
  }
}