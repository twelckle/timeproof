import React, { useRef, useState } from 'react';
import { keccak256, toUtf8Bytes } from 'ethers';
import { BrowserProvider, Contract } from 'ethers';
import { CONTRACT_ADDRESS, ABI, normalizeIdea } from '../utils/blockchain';

const Verify = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [showDownloadButton, setShowDownloadButton] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error" | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
      setVerificationStatus("pending");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
      setVerificationStatus("pending");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
  };

  // File verification logic for blockchain
  const verifyFileOnBlockchain = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const fileHash = keccak256(bytes);

      const provider = new BrowserProvider((window as any).ethereum);
      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const [submitter, timestamp] = await contract.getIdeaByHash(fileHash);

      if (timestamp > 0 && submitter !== "0x0000000000000000000000000000000000000000") {
        setVerificationMessage(
          `✅  <strong>${file.name}</strong> exists on the blockchain<br>Submitted on: ${new Date(Number(timestamp.toString()) * 1000).toLocaleString()}`
        );
        setShowDownloadButton(true);
        setVerificationStatus("success");
      } else {
        setVerificationMessage(
          `❌  <strong>${file.name}</strong> not found on the blockchain`
        );
        setShowDownloadButton(false);
        setVerificationStatus("error");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationMessage("❌ Error verifying file");
      setShowDownloadButton(false);
      setVerificationStatus("error");
    }
  };

  const downloadCertificate = async () => {
    if (!selectedFile) return;
  
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const ideaHash = keccak256(bytes);
  
      const provider = new BrowserProvider((window as any).ethereum);
      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);
      const [submitter, timestamp] = await contract.getIdeaByHash(ideaHash);
  
      import('jspdf').then(async ({ jsPDF }) => {
        const doc = new jsPDF();
  
        // Load image as base64
        const img = new Image();
        img.src = '/full_logo.png';
  
        img.onload = () => {
          doc.addImage(img, 'PNG', 15, 20, 57,25); // (img, type, x, y, width, height)
          doc.setFontSize(16);

          const startY = 65;
          const pageWidth = doc.internal.pageSize.getWidth();

          doc.text("Certificate of Idea - Timestamp", pageWidth / 2, startY, { align: 'center' });
          doc.setFontSize(12);
          doc.text(`File Name: ${selectedFile.name}`, 20, startY+20);
          doc.text(`SHA3 Hash: ${ideaHash}`, 20, startY+30);
          doc.text(`Submitted by: ${submitter}`, 20, startY+40);
  
          const timestampStr = new Date(Number(timestamp.toString()) * 1000)
            .toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          doc.text(`Timestamp: ${timestampStr}`, 20, startY+50);
          doc.text(`Time zone: ${timeZone}`, 20, startY+60);
  
          doc.save(`Certificate of ${selectedFile.name}.pdf`);
        };
      });
    } catch (err) {
      console.error("Download failed:", err);
      alert("❌ Could not generate certificate.");
    }
  };

  return (
    <section
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: '100vh', padding: '40px 20px' }}
    >
      <h1 style={{ color: '#043264', fontSize: '2.5rem' }}>Verify Your Idea</h1>

      {!fileName ? (
        <div
          id="dropZone"
          className="border border-primary rounded d-flex flex-column justify-content-center align-items-center"
          style={{
            borderStyle: 'dashed',
            height: '250px',
            width: '80%',
            margin: '20px 0',
            backgroundColor: '#f0f8ff',
            cursor: 'pointer',
            textAlign: 'center',
            padding: '30px',
          }}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <span className="text-muted">Click or drag a file to verify (PDF, PNG, DOCX, etc.)</span>
          <input
            type="file"
            ref={fileInputRef}
            id="fileInput"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div
          className={`alert d-flex justify-content-between align-items-center ${
            verificationStatus === "success"
              ? "alert-success"
              : verificationStatus === "error"
              ? "alert-danger"
              : "alert-warning"
          }`}
          style={{
            height: '250px',
            width: '80%',
            margin: '20px 0',
            padding: '30px',
            backgroundColor:
              verificationStatus === "success"
                ? "#e6f9f0"
                : verificationStatus === "error"
                ? "#f8d7da"
                : "#fff3cd",
            border: `2px solid ${
              verificationStatus === "success"
                ? "#28a745"
                : verificationStatus === "error"
                ? "#dc3545"
                : "#ffc107"
            }`,
            borderRadius: '8px',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%' }}>
              <span
                style={{ fontSize: '1.5rem', marginLeft: '20px', whiteSpace: 'pre-line', textAlign: 'left', alignSelf: 'flex-start' }}
                dangerouslySetInnerHTML={{ __html: verificationMessage ? verificationMessage : `<strong>${fileName}</strong> ready for verification` }}
              ></span>
            </div>
          </div>
          <button
            className="btn btn-outline-danger"
            style={{ fontSize: '1rem', padding: '10px 20px' }}
            onClick={() => {
              setFileName(null);
              setSelectedFile(null);
              setVerificationMessage(null);
              setShowDownloadButton(false);
              setVerificationStatus(null);
            }}
          >
            Remove
          </button>
        </div>
      )}

      {/* Buttons flex container */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <button
          className="btn btn-lg"
          style={{
            backgroundColor: '#043264',
            color: 'white',
            fontSize: '1.25rem',
            padding: '12px 24px',
          }}
          onClick={() => {
            if (!selectedFile) {
              alert("Please select a file first.");
              return;
            }
            verifyFileOnBlockchain(selectedFile);
          }}
        >
          Verify
        </button>
        {showDownloadButton && (
          <button
            className="btn btn-outline-success"
            style={{ fontSize: '1rem', padding: '12px 24px' }}
            onClick={() => downloadCertificate()}
          >
            Download Certificate
          </button>
        )}
      </div>
    </section>
  );
};

export default Verify;
