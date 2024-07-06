import styles from "./Container.module.css"

export function Container({ customClass, children }) {
	return (
		<div className={`${styles.container} ${styles[customClass]}`}> 
				{children} 
		</div>
)
}