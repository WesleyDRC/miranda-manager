import { useState } from "react";
import Cropper from "react-easy-crop";
import { FiX, FiCheck } from "react-icons/fi";
import styles from "./ImageCropModal.module.css";

export function ImageCropModal({ imageToCrop, onCancel, onSave }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleSave = () => {
    onSave(croppedAreaPixels);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Enquadrar Foto</h2>
          <button onClick={onCancel} className={styles.closeBtn}><FiX size={24} /></button>
        </div>
        
        <div className={styles.cropContainer}>
          <Cropper
            image={imageToCrop}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
            onZoomChange={setZoom}
          />
        </div>
        
        <div className={styles.zoomControl}>
          <span className={styles.zoomLabel}>Zoom</span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(e.target.value)}
            className={styles.zoomSlider}
          />
        </div>
        
        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelBtn}>Cancelar</button>
          <button onClick={handleSave} className={styles.saveBtn}><FiCheck /> Cortar e Salvar</button>
        </div>
      </div>
    </div>
  );
}
