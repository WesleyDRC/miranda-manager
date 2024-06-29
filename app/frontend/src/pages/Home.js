import styles from "./Home.module.css";

import logo from "../assets/logo.png";

import { useState } from "react";

export function Home() {
  const [activaTab, setActivaTab] = useState("signIn");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo Miranda Manager"/>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.introduction}>
          <h1>
            Miranda <span> Manager </span>
          </h1>
          <p> Faça parte e veja como anda seus gastos e ganhos atualmente! </p>
        </section>

        <section className={styles.auth}>
          <nav className={styles.nav}>
            <ul className={styles.list}>
              <li
                className={`${styles.item} ${activaTab === "signIn" ? styles.active : ""}`}
                onClick={() => setActivaTab("signIn")}
              >
                Entrar
              </li>
              <li
                className={`${styles.item} ${activaTab === "signUp" ? styles.active : ""}`}
                onClick={() => setActivaTab("signUp")}
              >
                Cadastrar
              </li>
            </ul>
          </nav>

          {activaTab === "signIn" && (
            <form className={styles.formAuth}>
							<div className={styles.formGroup}>
								<input type="email" id="email" name="email" className={styles.formControl} required placeholder=" "/>
								<label for="email" className={styles.formLabel}>Email</label>
							</div>

              <div className={`${styles.formGroup} ${styles.passwordWrapper}`}>
                <input type={passwordVisible ? 'text' : 'password'} id="password" className={styles.formControl} required placeholder=" " />
                <label htmlFor="password" className={styles.formLabel}>Senha</label>
                <span className={styles.togglePassword} onClick={togglePasswordVisibility}>
                  {passwordVisible ? '🙈' : '👁️'}
                </span>
              </div>
              <button type="submit" className={styles.btn}> Entrar </button>
            </form>
          )}

          {activaTab === "signUp" && (
            <form className={styles.formAuth}>
            <div className={styles.formGroup}>
              <input type="email" id="email" name="email" className={styles.formControl} required placeholder=" "/>
              <label for="email" className={styles.formLabel}>Email</label>
            </div>

            <div className={`${styles.formGroup} ${styles.passwordWrapper}`}>
              <input type={passwordVisible ? 'text' : 'password'} id="password" className={styles.formControl} required placeholder=" " />
              <label htmlFor="password" className={styles.formLabel}>Senha</label>
              <span className={styles.togglePassword} onClick={togglePasswordVisibility}>
                {passwordVisible ? '🙈' : '👁️'}
              </span>
            </div>

            <div className={`${styles.formGroup} ${styles.passwordWrapper}`}>
              <input type={passwordVisible ? 'text' : 'password'} id="confirmPassword" className={styles.formControl} required placeholder=" " />
              <label htmlFor="confirmPassword" className={styles.formLabel}>Confirmar senha</label>
              <span className={styles.togglePassword} onClick={togglePasswordVisibility}>
                {passwordVisible ? '🙈' : '👁️'}
              </span>
            </div>
            <button type="submit" className={styles.btn}> Entrar </button>
          </form>
          )}
        </section>
      </main>
    </>
  );
}
