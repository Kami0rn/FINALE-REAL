import React, { useState } from 'react';
import axios from 'axios';

function Generate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const generateImages = async () => {
    const username = localStorage.getItem('username');
    const userCustomName = localStorage.getItem('user_model_name');

    if (!username || !userCustomName) {
      setError('Username or user model name not found in local storage.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://127.0.0.1:5000/generate_image/${username}/${userCustomName}`, {
        responseType: 'blob',
      });

      const zip = await response.data;
      const zipReader = new FileReader();
      zipReader.readAsArrayBuffer(zip);
      zipReader.onload = () => {
        const zipContent = zipReader.result as ArrayBuffer;
        const zipBlob = new Blob([zipContent], { type: 'application/zip' });
        const zipUrl = URL.createObjectURL(zipBlob);

        // Create a link element to download the zip file
        const link = document.createElement('a');
        link.href = zipUrl;
        link.download = 'generated_images.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL object
        URL.revokeObjectURL(zipUrl);
      };
    } catch (err) {
      setError('Error generating images.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Generate Images</h1>
      <button onClick={generateImages} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Images'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Generate;