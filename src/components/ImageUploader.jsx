import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadArticleImage, deleteArticleImage } from '../services/articles';
import './ImageUploader.css';

const ImageUploader = ({ currentImage, onImageUploaded, onImageRemoved }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage || null);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setUploading(true);

        try {
            // Create preview
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);

            // Upload to Supabase
            const publicUrl = await uploadArticleImage(file);

            // Notify parent
            if (onImageUploaded) {
                onImageUploaded(publicUrl);
            }

            // Clean up preview
            URL.revokeObjectURL(previewUrl);
            setPreview(publicUrl);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
            setPreview(currentImage);
        } finally {
            setUploading(false);
        }
    }, [currentImage, onImageUploaded]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        maxFiles: 1,
        disabled: uploading
    });

    const handleRemove = async () => {
        if (!preview) return;

        try {
            // Delete from Supabase if it's a stored image
            if (preview.includes('supabase')) {
                await deleteArticleImage(preview);
            }

            setPreview(null);

            if (onImageRemoved) {
                onImageRemoved();
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    return (
        <div className="image-uploader">
            {preview ? (
                <div className="image-preview">
                    <img src={preview} alt="Preview" />
                    <button
                        type="button"
                        className="remove-image-btn"
                        onClick={handleRemove}
                        disabled={uploading}
                    >
                        <X size={20} />
                    </button>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
                >
                    <input {...getInputProps()} />
                    <div className="dropzone-content">
                        {uploading ? (
                            <>
                                <div className="upload-spinner"></div>
                                <p>Uploading...</p>
                            </>
                        ) : (
                            <>
                                <ImageIcon size={48} />
                                <p className="dropzone-text">
                                    {isDragActive
                                        ? 'Drop the image here'
                                        : 'Drag & drop an image, or click to select'}
                                </p>
                                <p className="dropzone-hint">
                                    Supports: PNG, JPG, JPEG, GIF, WebP
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
