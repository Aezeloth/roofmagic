import React, {useState} from 'react'
import {useOutletContext} from "react-router";
import {ImageIcon, UploadIcon} from "lucide-react";

interface UploadProps {
    onFileReady: (base64File: string) => void;
}

const Upload = ({ onFileReady }: UploadProps) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const { isSignedIn } = useOutletContext<AuthContext>();

    const processFile = (file: File) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) return;

        const reader = new FileReader();
        reader.onerror = () => setFileName(null);
        reader.onloadend = () => {
            const base64Data = reader.result as string;
            setFileName(file.name);
            onFileReady(base64Data);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    return (
        <div className="upload"
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}>
            <div className={`dropzone ${isDragging ? 'is-dragging' : ''}`}>
                <input type="file"
                       className="drop-input"
                       accept=".jpg,.jpeg,.png,.webp"
                       onChange={handleChange} />
                <div className="drop-content">
                    <div className="drop-icon">
                        {fileName ? <ImageIcon size={20} /> : <UploadIcon size={20} />}
                    </div>
                    <p>
                        {fileName
                            ? fileName
                            : isSignedIn
                                ? "Click to Upload or Drag and Drop"
                                : "Sign in or Sign up to upload your image"
                        }
                    </p>
                    <p className="help">
                        {fileName ? "Image ready — configure options above" : "Maximum file size 50 MB."}
                    </p>
                </div>
            </div>
        </div>
    )
}
export default Upload
