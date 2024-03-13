// Helper function to validate form birthDate
export const validateBirthDate = (dateString: string): string | null => {
  // First, check the format using a regular expression
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const parts = dateString.match(regex);

  // If the format doesn't match, return an error message
  if (!parts) return "Data musi mieć DD/MM/RRRR format.";

  // Extract the parts of the date
  const day = parseInt(parts[1], 10);
  const month = parseInt(parts[2], 10) - 1; // Month is 0-indexed in JavaScript Date
  const year = parseInt(parts[3], 10);

  // Check the validity of the date
  if (year < 1000 || year > 3000 || month < 0 || month > 11) {
    return "Invalid date. Please enter a valid date in DD/MM/YYYY format.";
  }

  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return "Invalid date. Please enter a valid date in DD/MM/YYYY format.";
  }

  // If the date is valid, return null (no error)
  return null;
};

// validate form fields function
export const validateField = (
  name: string,
  value: string | boolean
): string | null => {
  switch (name) {
    case "fullName":
      if (typeof value !== "string" || value.trim() === "") {
        return "Imię i nazwisko jest wymagane.";
      } else if (value.trim().split(/\s+/).length < 2) {
        return "Proszę podać imię i nazwisko.";
      }
      break; // This ends the 'fullName' case

    case "birthDate":
      if (typeof value !== "string" || value.trim() === "") {
        return "Data urodzenia jest wymagana.";
      } else {
        return validateBirthDate(value);
      }
      break; // This ends the 'birthDate' case

    case "email":
      if (typeof value !== "string" || value.trim() === "") {
        return "Adres email jest wymagany.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        return "Proszę podać poprawny adres email.";
      }
      break; // This ends the 'email' case

    case "department":
      return typeof value === "string" && value.trim() !== ""
        ? null
        : "Podanie wydziału jest wymagane.";

    case "termsOfUse":
      return value === true ? null : "Zaakceptowanie regulaminu jest wymagane.";

    default:
      return null;
  }

  return null;
};
