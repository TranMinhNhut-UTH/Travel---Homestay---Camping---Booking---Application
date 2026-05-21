import React, { useState, useEffect } from "react";
import complaintService from "../../services/complaintService";
import { customerService } from "../../services/customerService";
import { useNavigate } from "react-router-dom";
import { COMPLAINT_TYPE_OPTIONS } from "../../constants/complaintTypes"; // Import COMPLAINT_TYPE_OPTIONS

const CreateComplaintForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerId: "",
    type: COMPLAINT_TYPE_OPTIONS[0] || "", // Set default to the first option or empty
    title: "",
    description: "",
    assignedToStaffID: "",
    priority: "Trung bình",
    relatedOrderID: "",
    relatedVehicleID: "",
  });
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await customerService.getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers for selection.");
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...formData,
        customerId: parseInt(formData.customerId),
        assignedToStaffID: formData.assignedToStaffID ? parseInt(formData.assignedToStaffID) : null,
        relatedOrderID: formData.relatedOrderID ? parseInt(formData.relatedOrderID) : null,
        relatedVehicleID: formData.relatedVehicleID ? parseInt(formData.relatedVehicleID) : null,
      };

      await complaintService.createComplaint(payload);
      setSuccess("Complaint created successfully!");
      navigate("/complaints"); // Redirect to complaints list
    } catch (err) {
      console.error("Error creating complaint:", err);
      setError(err.message || "Failed to create complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCustomers) {
    return <div className="text-center py-4">Loading customer data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Complaint</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerId">
            Customer
          </label>
          <select
            id="customerId"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            {COMPLAINT_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignedToStaffID">
            Assigned To Staff ID (Optional)
          </label>
          <input
            type="number"
            id="assignedToStaffID"
            name="assignedToStaffID"
            value={formData.assignedToStaffID}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Staff ID"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Thấp">Thấp</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Cao">Cao</option>
            <option value="Khẩn cấp">Khẩn cấp</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="relatedOrderID">
            Related Order ID (Optional)
          </label>
          <input
            type="number"
            id="relatedOrderID"
            name="relatedOrderID"
            value={formData.relatedOrderID}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Related Order ID"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="relatedVehicleID">
            Related Vehicle ID (Optional)
          </label>
          <input
            type="number"
            id="relatedVehicleID"
            name="relatedVehicleID"
            value={formData.relatedVehicleID}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Related Vehicle ID"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Complaint"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/complaints")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateComplaintForm;
