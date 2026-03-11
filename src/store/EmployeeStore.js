// frontend/src/store/EmployeeStore.js
import axios from "axios";

// This function fetches all onboarded employees from the backend
export const fetchEmployees = async () => {
  try {
    const res = await axios.get("http://localhost:5050/api/admin/onboarded-employees");
    if (res.data && res.data.employees) {
      return res.data.employees.map(emp => ({
        empId: emp.empId,
        name: emp.name,
        faceDescriptor: new Float32Array(emp.faceDescriptor), // convert to Float32Array for face-api
      }));
    }
    return [];
  } catch (err) {
    console.error("Error fetching employees:", err.response?.data || err.message);
    return [];
  }
};