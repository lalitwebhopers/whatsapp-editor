import React, { useState, useRef, useEffect } from 'react';

const WhatsAppMessageEditor = () => {
  const [rawMessage, setRawMessage] = useState('');
  const [previewText, setPreviewText] = useState(
    'Hello John, \nHow are you doing today?'
  );
  const editorRef = useRef(null);

  // Function to convert HTML content back to WhatsApp raw format
  const convertToRawMessage = htmlText => {
    // Replace bold and italic text
    let rawText = htmlText
      .replace(/<b>(.*?)<\/b>/g, (match, p1) => `*${p1}*`) // Bold -> *text*
      .replace(/<i>(.*?)<\/i>/g, (match, p1) => `_${p1}_`) // Italic -> _text_
      .replace(/<br\s*\/?>/g, '%0A'); // <br /> -> %0A

    return rawText;
  };

  // Handle keyboard shortcuts for bold, italic, and newline
  const handleKeyDown = e => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // CMD+B for bold (works with CTRL+B as well)
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      document.execCommand('bold');
    }

    // CMD+I for italic (works with CTRL+I as well)
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault();
      document.execCommand('italic');
    }

    // Enter for new line
    if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '<br><br>'); // Add new line
    }

    // Update raw message state when the content changes
    setRawMessage(convertToRawMessage(editorRef.current.innerHTML));
    setPreviewText(editorRef.current.innerHTML);
  };

  // Update preview and raw message when user edits
  const handleInput = () => {
    const htmlText = editorRef.current.innerHTML;
    setPreviewText(htmlText);
    setRawMessage(convertToRawMessage(htmlText));
  };

  return (
    <div>
      <h2>WhatsApp Message Editor</h2>
      {/* Rich text editor with keyboard shortcuts */}
      <div
        ref={editorRef}
        contentEditable
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '100px',
          marginBottom: '10px',
          whiteSpace: 'pre-wrap', // Keep line breaks
          fontFamily: 'Arial, sans-serif',
          minHeight: '150px',
        }}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: previewText }}
      />

      <h3>Raw Message (WhatsApp API Format)</h3>
      <textarea
        readOnly
        value={rawMessage}
        rows='4'
        cols='50'
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          width: '100%',
          fontFamily: 'Arial, sans-serif',
        }}
      ></textarea>
    </div>
  );
};

export default WhatsAppMessageEditor;
