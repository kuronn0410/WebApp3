import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import styles from "./Footer.module.css";

function Footer({ onBack, backTo = "/", children, className = "" }) {
	const navigate = useNavigate();

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			navigate(backTo);
		}
	};

	return (
		<div className={`${styles.footer} ${className}`}>
			<div className={styles.buttonGroup}>
				{children}
				<Button label="戻る" onClick={handleBack} />
			</div>
		</div>
	);
};

export default Footer;
