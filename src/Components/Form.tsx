import React, { useEffect, useState } from "react";
import { validateField } from "../utils/formHelpers";
import { useSuccessMessage } from "../hooks/useSuccessMessage";
interface FieldState {
  value: string;
  touched: boolean;
  validationMessage: string | null;
}
interface BooleanFieldState {
  value: boolean;
  touched: boolean;
  validationMessage: string | null;
}

interface FormData {
  fullName: FieldState;
  birthDate: FieldState;
  email: FieldState;
  department: FieldState;
  termsOfUse: BooleanFieldState;
}

export const Form = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: { value: "", touched: false, validationMessage: null },
    birthDate: { value: "", touched: false, validationMessage: null },
    email: { value: "", touched: false, validationMessage: null },
    department: { value: "", touched: false, validationMessage: null },
    termsOfUse: { value: false, touched: false, validationMessage: null },
  });
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await fetch(
        "https://ddh-front-default-rtdb.europe-west1.firebasedatabase.app/departments.json"
      );
      const data = await response.json();
      const loadedDepartments = Object.keys(data).map((key) => ({
        id: key,
        name: data[key].name,
      }));
      setDepartments(loadedDepartments);
    };

    fetchDepartments();
  }, []);
  const { SuccessMessageComponent, showMessage } = useSuccessMessage();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: {
        ...prevFormData[name as keyof FormData],
        value: newValue,
        validationMessage: validateField(name, newValue),
      },
    }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: {
        ...prevFormData[name as keyof FormData],
        touched: true,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let isFormValid = true;

    Object.keys(formData).forEach((key) => {
      const fieldKey = key as keyof FormData;
      const field = formData[fieldKey];
      const validationMessage = validateField(fieldKey, field.value);

      if (validationMessage) {
        isFormValid = false;
      }
    });

    // If form is not valid, prevent submission
    if (!isFormValid) {
      alert("Nie udało się zapisać. Popraw błędy w formularzu.");
      return;
    }

    // Form is valid, proceed with submission
    const dataToSend = Object.keys(formData).reduce((acc, key) => {
      acc[key] = formData[key as keyof FormData].value;
      return acc;
    }, {} as { [key: string]: string | boolean });

    const payload = JSON.stringify(dataToSend);

    try {
      const response = await fetch(
        "https://ddh-front-default-rtdb.europe-west1.firebasedatabase.app/users.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
        }
      );

      if (!response.ok) {
        // If the response is not ok, throw an error
        throw new Error(`Failed to submit form: ${response.status}`);
      }

      const data = await response.json();
      showMessage("Dane zostały poprawnie zapisane.");
      console.log("Form submitted successfully:", data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form className="mt-5" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="user-name" className="form-label">
          Imię i nazwisko
        </label>
        <input
          type="text"
          className={`form-control ${
            formData.fullName.touched && formData.fullName.validationMessage
              ? "is-invalid"
              : ""
          }`}
          id="user-name"
          placeholder="Imię i nazwisko"
          name="fullName"
          value={formData.fullName.value}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {formData.fullName.touched && formData.fullName.validationMessage && (
          <div className="invalid-feedback">
            {formData.fullName.validationMessage}
          </div>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="user-birth-date" className="form-label">
          Data urodzenia
        </label>
        <input
          type="text"
          className={`form-control ${
            formData.birthDate.touched && formData.birthDate.validationMessage
              ? "is-invalid"
              : ""
          }`}
          id="user-birth-date"
          placeholder="DD/MM/YYYY"
          name="birthDate"
          value={formData.birthDate.value}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {formData.birthDate.touched && formData.birthDate.validationMessage && (
          <div className="invalid-feedback">
            {formData.birthDate.validationMessage}
          </div>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="user-email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className={`form-control ${
            formData.email.touched && formData.email.validationMessage
              ? "is-invalid"
              : ""
          }`}
          id="user-email"
          placeholder="user@example.com"
          name="email"
          value={formData.email.value}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {formData.email.touched && formData.email.validationMessage && (
          <div className="invalid-feedback">
            {formData.email.validationMessage}
          </div>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="user-department" className="form-label">
          Wydział
        </label>
        <select
          className={`form-select ${
            formData.department.touched && formData.department.validationMessage
              ? "is-invalid"
              : ""
          }`}
          name="department"
          id="user-department"
          value={formData.department.value}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="" disabled selected hidden>
            Wybierz oddział
          </option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        {formData.department.touched &&
          formData.department.validationMessage && (
            <div className="invalid-feedback">
              {formData.department.validationMessage}
            </div>
          )}
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="form-terms"
          name="termsOfUse"
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <label className="form-check-label" htmlFor="form-terms">
          Akceptuję regulamin
        </label>
        {formData.termsOfUse.touched &&
          formData.termsOfUse.validationMessage && (
            <div className="invalid-feedback">
              {formData.termsOfUse.validationMessage}
            </div>
          )}
      </div>
      {SuccessMessageComponent}
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type="submit" className="btn btn-primary">
          Zapisz
        </button>
      </div>
    </form>
  );
};
