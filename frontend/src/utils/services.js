export const saveToLocalStorage = (key, value) => {
  try {
    const serializedValue =
      typeof value !== "string" ? JSON.stringify(value) : value;
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const getFromLocalStorage = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error getting from localStorage:", error);
    return null;
  }
};

export const logout = () => {
  try {
    localStorage.removeItem("userData");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
