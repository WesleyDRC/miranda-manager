import { useRef } from "react";
import { FiCamera } from "react-icons/fi";
import styles from "./ImageUploadCard.module.css";

export function ImageUploadCard({ imageUrl, onFileSelect, fallbackImage }) {
  const imageInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className={styles.imageContainer} onClick={() => imageInputRef.current?.click()}>
      <img
        src={imageUrl || fallbackImage || ""}
        alt="Imagem do Patrimônio"
        className={styles.image}
      />
      <div className={styles.imageOverlay}>
        <div className={styles.uploadBadge}>
          <FiCamera size={16} /> Alterar Foto
        </div>
      </div>
      <input type="file" ref={imageInputRef} style={{ display: "none" }} onChange={handleFileChange} accept="image/*" />
    </div>
  );
}
