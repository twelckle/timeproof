import React, { useRef, useState } from 'react';
import { CONTRACT_ADDRESS, ABI, normalizeIdea } from '../utils/blockchain';
import { ethers } from 'ethers';
import type { Eip1193Provider } from 'ethers';

const Submit = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<{
    type: 'success' | 'error' | null,
    message: string | null,
    fileNameBold?: string,
    suffix?: string
  }>({ type: null, message: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      setFileName(file.name);
      setFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
  };

  // Handles file submission: reads, hashes, and submits file hash to blockchain
  const handleSubmit = async () => {
    setIsLoading(true);
    // setSubmissionStatus({ type: null, message: '' });
    if (!file) {
      setSubmissionStatus({
        type: 'error',
        message: '❌',
        fileNameBold: '',
        suffix: 'Please select a file first'
      });
      setIsLoading(false);
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const hash = ethers.keccak256(bytes);

      if (!window.ethereum) {
        setSubmissionStatus({ type: 'error', message: 'Please install MetaMask.' });
        setIsLoading(false);
        return;
      }

      // const provider = new ethers.BrowserProvider(window.ethereum);
      const provider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.submitIdeaHash(hash);
      await tx.wait();

      setSubmissionStatus({
        type: 'success',
        message: '✅',
        fileNameBold: file.name,
        suffix: 'successfully timestamped on the blockchain'
      });
      setIsLoading(false);
    } catch (err: any) {
      console.error("Submission error:", err);
      console.log("Error reason:", err?.reason);
      console.log("Error message:", err?.message);

      if (err?.reason?.includes("Hash already submitted")) {
        setSubmissionStatus({
          type: 'error',
          message: `⚠️`,
          fileNameBold: file?.name || '',
          suffix: 'has already been submitted and timestamped'
        });
      } else if (err?.message?.includes("user rejected")) {
        setSubmissionStatus({ type: 'error', message: '❌ You cancelled the transaction.' });
      } else {
        setSubmissionStatus({ type: 'error', message: '❌ Failed to submit file.' });
      }
      setIsLoading(false);
    }
  };

  return (
    <section
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: '100vh', padding: '40px 20px' }}
    >
      <h1 style={{ color: '#043264', fontSize: '2.5rem' }}>TimeStamp Your Idea</h1>

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
          <span className="text-muted">Click or drag a file to upload (PDF, PNG, DOCX, etc.)</span>
          <input
            type="file"
            ref={fileInputRef}
            id="fileInput"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {isLoading && (
            <div style={{ marginTop: '10px' }}>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              &nbsp; Verifying...
            </div>
          )}
        </div>
      ) : (
        <div
          className={`alert d-flex justify-content-between align-items-center ${
            submissionStatus.type === 'error'
              ? 'alert-danger'
              : submissionStatus.type === 'success'
              ? 'alert-success'
              : ''
          }`}
          style={{
            height: '250px',
            width: '80%',
            margin: '20px 0',
            padding: '30px',
            backgroundColor:
              submissionStatus.type === 'error'
                ? '#ffe6e6'
                : submissionStatus.type === 'success'
                ? '#e6f9f0'
                : '#fffbe6', // yellow for default
            border:
              submissionStatus.type === 'error'
                ? '2px solid #dc3545'
                : submissionStatus.type === 'success'
                ? '2px solid #28a745'
                : '2px solid #ffc107', // yellow border
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left', marginLeft: '20px' }}>
            <span style={{ fontSize: '1.5rem' }}>
              {submissionStatus.message ? (
                <>
                  {submissionStatus.message}{" "}
                  <strong>{submissionStatus.fileNameBold}</strong>
                  {submissionStatus.suffix ? " " + submissionStatus.suffix : null}
                </>
              ) : (
                <>
                  <strong>{fileName}</strong> ready for verification
                </>
              )}
            </span>
            {isLoading && (
              <div style={{ marginTop: '10px' }}>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                &nbsp; Verifying...
              </div>
            )}
          </div>
          <button
            className="btn btn-outline-danger"
            style={{ fontSize: '1rem', padding: '10px 20px' }}
            onClick={() => {
              setFileName(null);
              setSubmissionStatus({ type: null, message: null });
            }}
          >
            Remove
          </button>
        </div>
      )}

      <button
        className="btn btn-lg"
        style={{
          backgroundColor: '#043264',
          color: 'white',
          marginTop: '20px',
          fontSize: '1.25rem',
          padding: '12px 24px',
        }}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </section>
  );
};

export default Submit;