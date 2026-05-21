import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import complaintService from "../../services/complaintService";
import { customerService } from "../../services/customerService"; // Corrected import

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [customers, setCustomers] = useState([]); // For customer dropdown in edit mode
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // State for attachments
  const [newAttachmentFile, setNewAttachmentFile] = useState(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [attachmentError, setAttachmentError] = useState(null);

  // State for history
  const [newHistoryEntry, setNewHistoryEntry] = useState({
    staffId: "",
    actionType: "",
    details: "",
  });
  const [addingHistory, setAddingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  const fetchComplaintDetails = async () => {
    try {
      const data = await complaintService.getComplaintById(id);
      setComplaint(data);
      setEditFormData({
        type: data.type || "",
        title: data.title || "",
        description: data.description || "",
        status: data.status || "",
        resolution: data.resolution || "",
        assignedToStaffID: data.assignedToStaffID || "",
        priority: data.priority || "",
        relatedOrderID: data.relatedOrderID || "",
        relatedVehicleID: data.relatedVehicleID || "",
      });
    } catch (err) {
      setError("Failed to fetch complaint details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getCustomers(); // Corrected function call
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers:", err);
      // Optionally set an error for customer loading
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    fetchComplaintDetails();
    fetchCustomers();
  }, [id]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...editFormData,
        assignedToStaffID: editFormData.assignedToStaffID ? parseInt(editFormData.assignedToStaffID) : null,
        relatedOrderID: editFormData.relatedOrderID ? parseInt(editFormData.relatedOrderID) : null,
        relatedVehicleID: editFormData.relatedVehicleID ? parseInt(editFormData.relatedVehicleID) : null,
      };
      await complaintService.updateComplaint(id, payload);
      setIsEditing(false);
      fetchComplaintDetails(); // Re-fetch to show updated data
    } catch (err) {
      setError(err.message || "Failed to update complaint.");
      console.error(err);
    }
  };

  const handleDeleteComplaint = async () => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        await complaintService.deleteComplaint(id);
        navigate("/complaints"); // Redirect to list after deletion
      } catch (err) {
        setError(err.message || "Failed to delete complaint.");
        console.error(err);
      }
    }
  };

  // --- Attachment Handlers ---
  const handleAttachmentFileChange = (e) => {
    setNewAttachmentFile(e.target.files[0]);
  };

  const handleAddAttachment = async (e) => {
    e.preventDefault();
    if (!newAttachmentFile) {
      setAttachmentError("Please select a file to upload.");
      return;
    }
    setUploadingAttachment(true);
    setAttachmentError(null);

    try {
      // Assuming current user's staff ID is available, e.g., from context or local storage
      const uploadedByStaffId = 1; // TODO: Replace with actual staff ID
      await complaintService.addAttachment(id, newAttachmentFile, uploadedByStaffId);
      setNewAttachmentFile(null);
      e.target.reset(); // Clear file input
      fetchComplaintDetails(); // Re-fetch to show new attachment
    } catch (err) {
      setAttachmentError(err.message || "Failed to upload attachment.");
      console.error(err);
    } finally {
      setUploadingAttachment(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (window.confirm("Are you sure you want to delete this attachment?")) {
      try {
        await complaintService.deleteAttachment(attachmentId);
        fetchComplaintDetails(); // Re-fetch to show updated list
      } catch (err) {
        setAttachmentError(err.message || "Failed to delete attachment.");
        console.error(err);
      }
    }
  };

  // --- History Handlers ---
  const handleHistoryChange = (e) => {
    const { name, value } = e.target;
    setNewHistoryEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddHistoryEntry = async (e) => {
    e.preventDefault();
    if (!newHistoryEntry.staffId || !newHistoryEntry.actionType) {
      setHistoryError("Staff ID and Action Type are required.");
      return;
    }
    setAddingHistory(true);
    setHistoryError(null);

    try {
      await complaintService.addHistoryEntry(id, {
        staffId: parseInt(newHistoryEntry.staffId),
        actionType: newHistoryEntry.actionType,
        details: newHistoryEntry.details,
      });
      setNewHistoryEntry({ staffId: "", actionType: "", details: "" });
      fetchComplaintDetails(); // Re-fetch to show new history entry
    } catch (err) {
      setHistoryError(err.message || "Failed to add history entry.");
      console.error(err);
    } finally {
      setAddingHistory(false);
    }
  };

  if (loading || loadingCustomers) {
    return <div className="text-center py-4">Loading complaint details...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!complaint) {
    return <div className="text-center py-4">Complaint not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Complaint Details #{complaint.id}</h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          {isEditing ? "Cancel Edit" : "Edit Complaint"}
        </button>
        <button
          onClick={handleDeleteComplaint}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete Complaint
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdateComplaint} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-semibold mb-4">Edit Complaint</h3>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

          {/* Customer ID - maybe make this read-only or a dropdown if changing customer is allowed */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Customer Name:</label>
            <input
              type="text"
              value={complaint.customerName || "N/A"}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={editFormData.type}
              onChange={handleEditChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Khiếu nại">Khiếu nại</option>
              <option value="Phản hồi">Phản hồi</option>
              <option value="Gợi ý">Gợi ý</option>
              <option value="Yêu cầu hỗ trợ">Yêu cầu hỗ trợ</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={editFormData.title}
              onChange={handleEditChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={editFormData.description}
              onChange={handleEditChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={editFormData.status}
              onChange={handleEditChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Mới">Mới</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã giải quyết">Đã giải quyết</option>
              <option value="Đã đóng">Đã đóng</option>
              <option value="Đã chuyển tiếp">Đã chuyển tiếp</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resolution">Resolution</label>
            <textarea
              id="resolution"
              name="resolution"
              value={editFormData.resolution || ""}
              onChange={handleEditChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignedToStaffID">Assigned To Staff ID</label>
            <input
              type="number"
              id="assignedToStaffID"
              name="assignedToStaffID"
              value={editFormData.assignedToStaffID || ""}
              onChange={handleEditChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={editFormData.priority || "Trung bình"}
              onChange={handleEditChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Thấp">Thấp</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Cao">Cao</option>
              <option value="Khẩn cấp">Khẩn cấp</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="relatedOrderID">Related Order ID</label>
            <input
              type="number"
              id="relatedOrderID"
              name="relatedOrderID"
              value={editFormData.relatedOrderID || ""}
              onChange={handleEditChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="relatedVehicleID">Related Vehicle ID</label>
            <input
              type="number"
              id="relatedVehicleID"
              name="relatedVehicleID"
              value={editFormData.relatedVehicleID || ""}
              onChange={handleEditChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <p className="mb-2">
            <span className="font-bold">Customer:</span> {complaint.customerName}
          </p>
          <p className="mb-2">
            <span className="font-bold">Type:</span> {complaint.type}
          </p>
          <p className="mb-2">
            <span className="font-bold">Title:</span> {complaint.title}
          </p>
          <p className="mb-2">
            <span className="font-bold">Description:</span> {complaint.description}
          </p>
          <p className="mb-2">
            <span className="font-bold">Status:</span> {complaint.status}
          </p>
          <p className="mb-2">
            <span className="font-bold">Priority:</span> {complaint.priority || "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-bold">Assigned To Staff ID:</span> {complaint.assignedToStaffID || "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-bold">Related Order ID:</span> {complaint.relatedOrderID || "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-bold">Related Vehicle ID:</span> {complaint.relatedVehicleID || "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-bold">Created At:</span> {new Date(complaint.createdAt).toLocaleString()}
          </p>
          <p className="mb-2">
            <span className="font-bold">Last Updated At:</span> {new Date(complaint.updatedAt).toLocaleString()}
          </p>
          {complaint.resolvedAt && (
            <p className="mb-2">
              <span className="font-bold">Resolved At:</span> {new Date(complaint.resolvedAt).toLocaleString()}
            </p>
          )}
          {complaint.resolution && (
            <p className="mb-2">
              <span className="font-bold">Resolution:</span> {complaint.resolution}
            </p>
          )}
        </div>
      )}

      {/* Attachments Section */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-semibold mb-4">Attachments</h3>
        {attachmentError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{attachmentError}</div>}
        {complaint.attachments && complaint.attachments.length > 0 ? (
          <ul>
            {complaint.attachments.map((attachment) => (
              <li key={attachment.id} className="flex justify-between items-center mb-2">
                <a
                  href={attachment.filePath} // In a real app, this would be a download URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {attachment.fileName}
                </a>
                <button
                  onClick={() => handleDeleteAttachment(attachment.id)}
                  className="bg-red-400 hover:bg-red-600 text-white text-xs py-1 px-2 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No attachments found.</p>
        )}

        <form onSubmit={handleAddAttachment} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attachmentFile">Upload New Attachment</label>
            <input
              type="file"
              id="attachmentFile"
              onChange={handleAttachmentFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={uploadingAttachment}
          >
            {uploadingAttachment ? "Uploading..." : "Add Attachment"}
          </button>
        </form>
      </div>

      {/* History Section */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-semibold mb-4">History</h3>
        {historyError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{historyError}</div>}
        {complaint.history && complaint.history.length > 0 ? (
          <ul>
            {complaint.history
              .sort((a, b) => new Date(b.actionDate) - new Date(a.actionDate)) // Sort by date descending
              .map((entry) => (
                <li key={entry.id} className="mb-2 p-2 border-b last:border-b-0">
                  <p>
                    <span className="font-bold">{new Date(entry.actionDate).toLocaleString()}</span> -{" "}
                    <span className="font-bold">Staff ID {entry.staffId}:</span> {entry.actionType}
                  </p>
                  {entry.details && <p className="text-gray-600 text-sm ml-4">{entry.details}</p>}
                </li>
              ))}
          </ul>
        ) : (
          <p>No history entries found.</p>
        )}

        <form onSubmit={handleAddHistoryEntry} className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Add New History Entry</h4>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="historyStaffId">Staff ID</label>
            <input
              type="number"
              id="historyStaffId"
              name="staffId"
              value={newHistoryEntry.staffId}
              onChange={handleHistoryChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="actionType">Action Type</label>
            <input
              type="text"
              id="actionType"
              name="actionType"
              value={newHistoryEntry.actionType}
              onChange={handleHistoryChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="historyDetails">Details (Optional)</label>
            <textarea
              id="historyDetails"
              name="details"
              value={newHistoryEntry.details}
              onChange={handleHistoryChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={addingHistory}
          >
            {addingHistory ? "Adding..." : "Add History Entry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintDetail;
