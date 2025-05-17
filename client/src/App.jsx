// client/src/App.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'bootstrap/js/dist/modal';

export default function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const modalRef = useRef(null);
  const modalInstance = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      modalInstance.current = new Modal(modalRef.current, {
        backdrop: 'static',
        keyboard: false
      });
    }
  }, []);

  const openModal = () => {
    modalInstance.current?.show();
  };

  const closeModal = () => {
    modalInstance.current?.hide();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await axios.post("http://localhost:8000/upload", formData);
      const fileId = uploadRes.data.file_id;

      const embedForm = new FormData();
      embedForm.append("file_id", fileId);

      await axios.post("http://localhost:8000/embed", embedForm);
      closeModal();
    } catch (err) {
      alert("Upload failed");
    }

    setUploading(false);
  };


  const sendMessage = async () => {
  };
  return (
    <div className="container py-5">
      {/* Top bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Ask My Textbook</h1>
        <button className="btn btn-primary" onClick={openModal}>
          Import PDF
        </button>
      </div>

      {/* Bootstrap Modal */}
      <div className="modal fade" tabIndex="-1" ref={modalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Upload PDF</h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
                disabled={uploading}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input type="file" className="form-control" accept="application/pdf" onChange={handleFileChange} />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-success"
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? "Uploading..." : "Upload & Process"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Layout Placeholder */}
      <div className="card shadow-sm mt-4">
        
        <div className="card-body" style={{ height: "400px", overflowY: "scroll" }}>
          <div className="d-flex mb-3">
            <div className="bg-primary text-white p-2 rounded" style={{ maxWidth: "75%" }}>
              Quisque consequat arcu eget odio cursus, ut tempor arcu vestibulum.
            </div>
          </div>

          <div className="d-flex justify-content-end mb-3">
            <div className="bg-light p-2 rounded" style={{ maxWidth: "75%" }}>
              Mauris volutpat magna nibh, et condimentum est rutrum a.
            </div>
           
          </div>
        </div>
        <div className="card-footer bg-light">
          <div className="input-group">
            <textarea className="form-control" placeholder="What's on your mind..." rows="1"></textarea>
            <button className="btn btn-outline-primary" type="button" onClick={() => {sendMessage()}}>
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
