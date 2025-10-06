import styles from './Button.module.css';

const Button = ({ label, onClick, type = "button" }) => {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      type={type}
    >
      {label}
    </button>
  );
};

export default Button;