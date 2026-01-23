"use client";

import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Default toast options
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

// Toast helper functions
export const showSuccess = (message: string) => toast.success(message, defaultOptions);
export const showError = (message: string) => toast.error(message, defaultOptions);
export const showInfo = (message: string) => toast.info(message, defaultOptions);
export const showWarning = (message: string) => toast.warning(message, defaultOptions);

// ToastContainer component
export const AppToast = () => <ToastContainer />;
