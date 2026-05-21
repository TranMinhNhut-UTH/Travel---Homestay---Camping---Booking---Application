import React, { useEffect, useState } from "react";
import complaintService from "../../services/complaintService";
import { Link } from "react-router-dom"; // Assuming you use react-router-dom for navigation

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await complaintService.getAllComplaints();
        setComplaints(data);
      } catch (err) {
        setError("Failed to fetch complaints.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading complaints...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (complaints.length === 0) {
    return <div className="text-center py-4">No complaints found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Complaint List</h2>
      <Link
        to="/complaints/new"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block"
      >
        Create New Complaint
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Priority</th>
              <th className="py-2 px-4 border-b">Created At</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{complaint.id}</td>
                <td className="py-2 px-4 border-b">{complaint.customerName}</td>
                <td className="py-2 px-4 border-b">{complaint.type}</td>
                <td className="py-2 px-4 border-b">{complaint.title}</td>
                <td className="py-2 px-4 border-b">{complaint.status}</td>
                <td className="py-2 px-4 border-b">{complaint.priority || "N/A"}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`/complaints/${complaint.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    View
                  </Link>
                  {/* Add Edit/Delete buttons later if needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintList;
