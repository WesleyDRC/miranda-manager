import React, { useState } from "react";
import styles from "./ModalEditRent.module.css";
import CloseIcon from "../../assets/close-icon.svg";
import { toast } from "react-toastify";
import axiosRepositoryInstance from "../../repository/AxiosRepository";

export default function ModalEditRent({ rent, closeModal, onSave }) {
  const [formData, setFormData] = useState({
    tenant: rent?.tenant || "",
    value: rent?.value || "",
    street: rent?.street || "",
    streetNumber: rent?.streetNumber || "",
    financeName: rent?.financeName || "",
    status: rent?.rentStatus || "active",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    if (!formData.tenant || !formData.value || !formData.street || !formData.streetNumber || !formData.financeName) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSaving(true);
    try {
      await axiosRepositoryInstance.updateRent(rent.id, {
        tenant: formData.tenant,
        value: formData.value,
        street: formData.street,
        streetNumber: formData.streetNumber,
        financeName: formData.financeName,
        status: formData.status,
      });

      toast.success("Aluguel atualizado com sucesso!");
      onSave(); // Trigger dashboard refresh
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar o aluguel.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.modal} aria-labelledby="modalTitle">
      <div className={`${styles.modalContent} ${styles.slideInLeft}`}>
        <header className={styles.modalHeader}>
          <h2 id="modalTitle">Editar Aluguel</h2>
          <button onClick={closeModal} type="button">
            <img className={styles.icon} src={CloseIcon} alt="Fechar Modal" />
          </button>
        </header>

        <main className={styles.modalBody}>
          <form onSubmit={handleSubmit} id="editRentForm">
            <div className={styles.formGroupDouble}>
              <div className={styles.formGroup}>
                <label>Nome do Inquilino</label>
                <input
                  type="text"
                  name="tenant"
                  value={formData.tenant}
                  onChange={handleChange}
                  placeholder="Nome do inquilino"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Nome da Finança</label>
                <input
                  type="text"
                  name="financeName"
                  value={formData.financeName}
                  onChange={handleChange}
                  placeholder="Nome da finança vinculada"
                />
              </div>
            </div>

            <div className={styles.formGroupDouble}>
              <div className={styles.formGroup}>
                <label>Valor Mensal (R$)</label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder="Valor mensal"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Situação</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Ativo (Gera novos meses)</option>
                  <option value="finished">Finalizado (Não gera novos meses)</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroupDouble}>
              <div className={styles.formGroup}>
                <label>Endereço / Rua</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Nome da rua"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Número</label>
                <input
                  type="text"
                  name="streetNumber"
                  value={formData.streetNumber}
                  onChange={handleChange}
                  placeholder="Nº"
                />
              </div>
            </div>
          </form>
        </main>

        <footer className={styles.modalFooter}>
          <button onClick={closeModal} className={`${styles.btn} ${styles.btnCancel}`}>
            Cancelar
          </button>
          <button type="submit" form="editRentForm" className={`${styles.btn} ${styles.btnEdit}`} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </footer>
      </div>
    </div>
  );
}
