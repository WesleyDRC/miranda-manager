import { createContext, useState, useEffect } from "react";
import { api } from "../services/api";
import axiosRepositoryInstance from "../repository/AxiosRepository";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");
    const storedEmail = localStorage.getItem("user_email");

    if (userToken) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(userToken)}`;
      setUser(JSON.parse(userToken));
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const SignIn = async (email, password) => {
    try {
      const response = await axiosRepositoryInstance.signIn({ email, password });

      localStorage.setItem("user_token", JSON.stringify(response.data.token));
      localStorage.setItem("user_email", email);

      api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
      setUser(response.data.token);
      setUserEmail(email);
    } catch (error) {
      if (error.response && error.response.status !== error.response.status.ok) {
        return error.response.data.message;
      }
    }
  };

  const SignUp = async (email, password, confirmPassword) => {
    try {
      await axiosRepositoryInstance.createUser({
        email,
        password,
        confirmPassword,
      });
    } catch (error) {
      if (error.response && error.response.status !== error.response.status.ok) {
        return error.response.data.message;
      }
    }
  };

  const SignOut = () => {
    setUser(null);
    setUserEmail(null);
    api.defaults.headers.Authorization = null;
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_email");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userEmail,
        SignIn,
        authenticated: !!user,
        loading,
        SignUp,
        SignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
