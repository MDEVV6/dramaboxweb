import React, { useState } from 'react';
import { Code, Copy, Check, Image, Video, Link as LinkIcon } from 'lucide-react';
import './HTMLGenerator.css';

const HTMLGenerator = () => {
    const [mediaType, setMediaType] = useState('image');
    const [mediaUrl, setMediaUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [sizeMode, setSizeMode] = useState('full'); // 'full' or 'custom'
    const [width, setWidth] = useState('300');
    const [height, setHeight] = useState('250');
    const [altText, setAltText] = useState('Advertisement');
    const [target, setTarget] = useState('_blank');
    const [generatedCode, setGeneratedCode] = useState('');
    const [copied, setCopied] = useState(false);

    // Preset sizes for common ad formats
    const presetSizes = [
        { label: 'Banner (728x90)', width: '728', height: '90' },
        { label: 'Leaderboard (728x90)', width: '728', height: '90' },
        { label: 'Medium Rectangle (300x250)', width: '300', height: '250' },
        { label: 'Large Rectangle (336x280)', width: '336', height: '280' },
        { label: 'Skyscraper (160x600)', width: '160', height: '600' },
        { label: 'Wide Skyscraper (160x600)', width: '160', height: '600' },
        { label: 'Square (250x250)', width: '250', height: '250' },
        { label: 'Small Square (200x200)', width: '200', height: '200' },
    ];

    const generateHTML = () => {
        let code = '';

        // Determine size styling
        const sizeStyle = sizeMode === 'full'
            ? 'width: 100%; height: auto; max-width: 100%;'
            : `width: ${width}px; height: ${height}px; max-width: 100%;`;

        if (mediaType === 'image') {
            code = `<a href="${linkUrl || '#'}" target="${target}" rel="noopener noreferrer" style="display: block; text-decoration: none;">
  <img 
    src="${mediaUrl}" 
    alt="${altText}" 
    style="${sizeStyle} display: block; object-fit: cover;"
  />
</a>`;
        } else if (mediaType === 'video') {
            code = `<video 
  ${sizeMode === 'full' ? 'width="100%"' : `width="${width}" height="${height}"`}
  controls 
  autoplay 
  muted 
  loop
  style="${sizeStyle} display: block; object-fit: cover;"
>
  <source src="${mediaUrl}" type="video/mp4">
  Your browser does not support the video tag.
</video>
${linkUrl ? `\n<!-- Optional: Wrap with link -->\n<a href="${linkUrl}" target="${target}" rel="noopener noreferrer" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: var(--accent-gold); color: var(--primary-900); text-decoration: none; border-radius: 5px;">Visit Link</a>` : ''}`;
        } else if (mediaType === 'iframe') {
            code = `<iframe 
  src="${mediaUrl}" 
  ${sizeMode === 'full' ? 'width="100%"' : `width="${width}" height="${height}"`}
  frameborder="0" 
  allowfullscreen
  style="${sizeStyle} display: block; border: none;"
></iframe>`;
        }

        setGeneratedCode(code);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const insertToEditor = () => {
        // This will be called from parent component
        if (window.insertAdCode) {
            window.insertAdCode(generatedCode);
        }
    };

    return (
        <div className="html-generator">
            <div className="generator-header">
                <Code size={24} />
                <div>
                    <h3>HTML Generator</h3>
                    <p>Generate HTML code from image/video URL</p>
                </div>
            </div>

            <div className="generator-body">
                {/* Media Type Selector */}
                <div className="form-group">
                    <label>Media Type</label>
                    <div className="media-type-selector">
                        <button
                            className={`type-btn ${mediaType === 'image' ? 'active' : ''}`}
                            onClick={() => setMediaType('image')}
                        >
                            <Image size={18} />
                            Image
                        </button>
                        <button
                            className={`type-btn ${mediaType === 'video' ? 'active' : ''}`}
                            onClick={() => setMediaType('video')}
                        >
                            <Video size={18} />
                            Video
                        </button>
                        <button
                            className={`type-btn ${mediaType === 'iframe' ? 'active' : ''}`}
                            onClick={() => setMediaType('iframe')}
                        >
                            <Code size={18} />
                            iFrame
                        </button>
                    </div>
                </div>

                {/* Media URL */}
                <div className="form-group">
                    <label>
                        {mediaType === 'image' ? 'Image URL' : mediaType === 'video' ? 'Video URL' : 'iFrame URL'}
                    </label>
                    <input
                        type="url"
                        placeholder={`https://example.com/${mediaType}.${mediaType === 'video' ? 'mp4' : 'jpg'}`}
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        className="form-input"
                    />
                </div>

                {/* Link URL (for image/video) */}
                {mediaType !== 'iframe' && (
                    <div className="form-group">
                        <label>
                            <LinkIcon size={16} />
                            Link URL (Optional)
                        </label>
                        <input
                            type="url"
                            placeholder="https://example.com/landing-page"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="form-input"
                        />
                    </div>
                )}

                {/* Size Mode Selector */}
                <div className="form-group">
                    <label>Size Mode</label>
                    <div className="size-mode-selector">
                        <button
                            className={`type-btn ${sizeMode === 'full' ? 'active' : ''}`}
                            onClick={() => setSizeMode('full')}
                        >
                            Full Width (100%)
                        </button>
                        <button
                            className={`type-btn ${sizeMode === 'custom' ? 'active' : ''}`}
                            onClick={() => setSizeMode('custom')}
                        >
                            Custom Size
                        </button>
                    </div>
                    <p className="form-hint">
                        {sizeMode === 'full'
                            ? '📐 Ad will fill 100% of the slot width (responsive)'
                            : '📏 Set custom width and height in pixels'}
                    </p>
                </div>

                {/* Preset Sizes (only for custom mode) */}
                {sizeMode === 'custom' && (
                    <div className="form-group">
                        <label>Preset Sizes (Optional)</label>
                        <select
                            className="form-select"
                            onChange={(e) => {
                                const selected = presetSizes[e.target.value];
                                if (selected) {
                                    setWidth(selected.width);
                                    setHeight(selected.height);
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="">-- Select Preset Size --</option>
                            {presetSizes.map((preset, idx) => (
                                <option key={idx} value={idx}>
                                    {preset.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Dimensions (only for custom mode) */}
                {sizeMode === 'custom' && (
                    <div className="form-row">
                        <div className="form-group">
                            <label>Width (px)</label>
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Height (px)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="form-input"
                            />
                        </div>
                    </div>
                )}

                {/* Alt Text (for images) */}
                {mediaType === 'image' && (
                    <div className="form-group">
                        <label>Alt Text</label>
                        <input
                            type="text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            className="form-input"
                            placeholder="Advertisement"
                        />
                    </div>
                )}

                {/* Target (for links) */}
                {mediaType !== 'iframe' && linkUrl && (
                    <div className="form-group">
                        <label>Link Target</label>
                        <select
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            className="form-select"
                        >
                            <option value="_blank">New Tab (_blank)</option>
                            <option value="_self">Same Tab (_self)</option>
                            <option value="_parent">Parent Frame (_parent)</option>
                        </select>
                    </div>
                )}

                {/* Generate Button */}
                <button
                    className="btn btn-primary generate-btn"
                    onClick={generateHTML}
                    disabled={!mediaUrl}
                >
                    <Code size={18} />
                    Generate HTML
                </button>

                {/* Generated Code */}
                {generatedCode && (
                    <div className="generated-code-section">
                        <div className="code-header">
                            <label>Generated HTML Code</label>
                            <div className="code-actions">
                                <button
                                    className="btn-icon"
                                    onClick={copyToClipboard}
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>
                        <pre className="code-preview">
                            <code>{generatedCode}</code>
                        </pre>
                        <p className="code-hint">
                            💡 Copy this code and paste it into the Ad Code editor above
                        </p>
                    </div>
                )}

                {/* Preview */}
                {generatedCode && mediaType === 'image' && mediaUrl && (
                    <div className="preview-section">
                        <label>Preview</label>
                        <div
                            className="preview-container"
                            dangerouslySetInnerHTML={{ __html: generatedCode }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HTMLGenerator;
