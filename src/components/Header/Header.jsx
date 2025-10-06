import styles from './Header.module.css';

const Header = ({ label}) => {
  return (
    <header className={styles.header}>
            <h1>{label}</h1>
    </header>
  );
};

export default Header;