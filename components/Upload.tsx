import React, {useState} from 'react'
import {useOutletContext} from "react-router";
import {CheckCircle2, ImageIcon, UploadIcon} from "lucide-react";
import {PROGRESS_STEP, PROGRESS_INTERVAL_MS, REDIRECT_DELAY_MS} from "../lib/constants";

interface UploadProps {
    onComplete?: (base64Data: string) => void;
}

const Upload = ({ onComplete }: UploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);

    const { isSignedIn } = useOutletContext<AuthContext>();

    const processFile = (file: File) => {
        if (!isSignedIn) return;
        setFile(file);
        setProgress(0);

        const reader = new FileReader();
        reader.onerror = () => {
            setFile(null);
            setProgress(0);
        };
        reader.onloadend = () => {
            const base64Data = reader.result as string;
            
            const interval = setInterval(() => {
                setProgress((prev) => {
                    const next = prev + PROGRESS_STEP;
                    if (next >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            if (onComplete) onComplete(base64Data);
                        }, REDIRECT_DELAY_MS);
                        return 100;
                    }
                    return next;
                });
            }, PROGRESS_INTERVAL_MS);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (isSignedIn) {
            setIsDragging(true);
        }
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (!isSignedIn) return;

        const droppedFile = e.dataTransfer.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (droppedFile && allowedTypes.includes(droppedFile.type)) {
            processFile(droppedFile);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isSignedIn) return;
        const files = e.target.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    return (
        <div className="upload"
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}>
            {!file ? (
                    <div className={`dropzone ${isDragging ? 'is-dragging' : ''}`}>
                        <input type="file"
                               className="drop-input"
                               accept=".jpg,.jpeg,.png,.webp"
                               onChange={handleChange}
                               disabled={!isSignedIn}/>

                        <div className="drop-content">
                            <div className="drop-icon">
                            <UploadIcon size={20}/>
                            </div>
                        <p>
                            {isSignedIn ? (
                                "Click to Upload or Drag and Drop"
                            ) : (
                                "Signin or Sign up to upload your image"
                            )}
                        </p>
                        <p className="help">Maximum file size 50 MB.</p>
                    </div>
                    </div>
            ) : (
                <div className="upload-status">
                    <div className="status-content">
                        <div className="status-icon">
                            {progress === 100 ? (
                                <CheckCircle2 className="check"/>
                            ) : (
                                <ImageIcon className="image" />
                            )}
                        </div>
                        <h3>{file.name}</h3>
                        <div className="progress">
                            <div className="progress-bar" style={{width: `${progress}%`}} />

                            <p className="status-text">
                                {progress < 100 ? 'Analyzing roof ...' : 'Redirecting...'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Upload
