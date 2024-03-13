import React, { useState, useCallback } from "react";
import { Alert } from "react-bootstrap";

interface UseSuccessMessageReturn {
  SuccessMessageComponent: JSX.Element | null;
  showMessage: (msg: string) => void;
}

export const useSuccessMessage = (): UseSuccessMessageReturn => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 3000); // Hide after 3 seconds
  }, []);

  const SuccessMessageComponent = isVisible ? (
    <Alert
      variant="success"
      style={{ position: "fixed", top: 20, right: 20, zIndex: 1050 }}
    >
      {message}
    </Alert>
  ) : null;

  return { SuccessMessageComponent, showMessage };
};

export default useSuccessMessage;
