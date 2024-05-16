import React, { useState } from 'react';
import md5 from 'js-md5';
import './UploadBox.css';

function FileUpload() {
    const [selectedFile, setSelectedFile] = useState();
    const [isActive, setIsActive] = useState(false);

    const api = import.meta.env.VITE_API_ENDPOINT;

    const onDragOver = (event) => {
        event.preventDefault();
        setIsActive(true);
    };

    const onDragLeave = () => {
        setIsActive(false);
    };

    const onDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        setSelectedFile(files[0]);
        setIsActive(false);
    };

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const uploadFile = async () => {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const fileHash = md5(reader.result);
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('name', selectedFile.name);
            formData.append('type', selectedFile.type);
            formData.append('size', selectedFile.size.toString());
            formData.append('hash', fileHash);
    
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/document/upload`, {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                // Handle error
                console.error('Upload failed');
            }
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    return (
        <div 
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            style={{border: isActive ? 'dashed' : 'solid'}}
        >
            <input type="file" onChange={onFileChange} />
            {selectedFile && <p>{selectedFile.name} - {selectedFile.type} - {selectedFile.size} bytes</p>}
            <button onClick={uploadFile} disabled={!selectedFile}>Upload</button>
        </div>
    );
}

export default FileUpload;