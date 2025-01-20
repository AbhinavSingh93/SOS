import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notifications = ({ message }) => {
  const notify = () => toast.success(message || "SOS Alert Sent!");

  return (
    <div>
      <button onClick={notify} className="notify-button">
        Test Notification
      </button>
      <ToastContainer />
    </div>
  );
};

export default Notifications;
