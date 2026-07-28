import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

/* Human-readable byte size. */
export const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value >= 10 || i === 0 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
};

/*
 * Drag-and-drop (or click to browse) file selection.
 * - accept: input accept string (e.g. 'image/*,.pdf')
 * - multiple: allow more than one file
 * - maxSize: max bytes per file (rejected files surface an error)
 * - onFiles(files): called with the current accepted File[] whenever it changes
 * - uploadProgress: optional { [fileName]: 0..100 } to render per-file bars
 * - disabled: block interaction
 * The dropzone is a focusable button; a visually hidden <input type="file">
 * backs the click-to-browse path so it stays keyboard accessible.
 */
const FileUpload = ({
  accept,
  multiple = false,
  maxSize,
  onFiles,
  uploadProgress,
  disabled = false,
  label,
  hint,
  className = '',
  ...props
}) => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const commit = useCallback(
    (incoming) => {
      const arr = Array.from(incoming);
      const accepted = [];
      let err = '';
      for (const f of arr) {
        if (maxSize && f.size > maxSize) {
          err = `"${f.name}" exceeds the ${formatBytes(maxSize)} limit.`;
          continue;
        }
        accepted.push(f);
      }
      setError(err);
      const next = multiple ? [...files, ...accepted] : accepted.slice(0, 1);
      setFiles(next);
      onFiles?.(next);
    },
    [files, maxSize, multiple, onFiles]
  );

  const removeAt = (index) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    setError('');
    onFiles?.(next);
  };

  const openDialog = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    if (e.dataTransfer?.files?.length) commit(e.dataTransfer.files);
  };

  return (
    <div className={className} {...props}>
      {label && <span className="block mb-2 text-sm font-medium text-ink">{label}</span>}

      <button
        type="button"
        onClick={openDialog}
        disabled={disabled}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-2 w-full px-6 py-8 rounded-card border-2 border-dashed text-center transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 ${
          disabled
            ? 'border-line bg-surface-muted cursor-not-allowed opacity-60'
            : dragOver
            ? 'border-primary bg-primary/5'
            : 'border-line-strong bg-surface-raised hover:border-primary hover:bg-surface-muted'
        }`}
      >
        <UploadCloud size={28} className={dragOver ? 'text-primary' : 'text-ink-muted'} aria-hidden="true" />
        <span className="text-sm text-ink">
          <span className="font-medium text-primary">Click to upload</span> or drag and drop
        </span>
        {hint && <span className="text-xs text-ink-muted">{hint}</span>}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) commit(e.target.files);
          e.target.value = '';
        }}
      />

      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, index) => {
            const progress = uploadProgress?.[file.name];
            return (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 px-3 py-2 rounded-control border border-line bg-surface-raised"
              >
                <FileIcon size={18} className="shrink-0 text-ink-muted" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink">{file.name}</p>
                  <p className="text-xs text-ink-muted">{formatBytes(file.size)}</p>
                  {typeof progress === 'number' && (
                    <div className="mt-1 h-1.5 w-full rounded-pill bg-surface-muted overflow-hidden">
                      <div
                        className="h-full rounded-pill bg-primary transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  aria-label={`Remove ${file.name}`}
                  className="shrink-0 p-1 rounded-control text-ink-muted hover:text-destructive hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                >
                  <X size={16} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;
