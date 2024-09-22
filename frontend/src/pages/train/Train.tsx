import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Train: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [epoch, setEpoch] = useState(0);
    const [dLoss, setDLoss] = useState(0);
    const [gLoss, setGLoss] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [numEpochs, setNumEpochs] = useState(100);  // Default to 100 epochs

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get('http://localhost:5000/progress');
                const data = response.data;
                setProgress(data.progress);
                setEpoch(data.epoch);
                setDLoss(data.d_loss);
                setGLoss(data.g_loss);
            } catch (error) {
                console.error('Error fetching progress:', error);
            }
        }, 1000);  // Poll every second

        return () => clearInterval(interval);
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(event.target.files);
    };

    const handleEpochChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumEpochs(parseInt(event.target.value, 10));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedFiles) {
            alert('Please select files to upload.');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('images', selectedFiles[i]);
        }
        formData.append('epochs', numEpochs.toString());

        try {
            await axios.post('http://127.0.0.1:5000/wgan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Files uploaded successfully.');
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Error uploading files.');
        }
    };

    return (
        <div>
            <h1>WGAN Training Progress</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" multiple onChange={handleFileChange} />
                <input
                    type="number"
                    value={numEpochs}
                    onChange={handleEpochChange}
                    placeholder="Number of Epochs"
                />
                <button type="submit">Upload and Train</button>
            </form>
            <div>
                <progress id="progress-bar" value={progress} max="100"></progress>
                <p>Epoch: <span id="epoch">{epoch}</span></p>
                <p>Progress: <span id="progress">{progress.toFixed(2)}</span>%</p>
                <p>D Loss: <span id="d_loss">{dLoss}</span></p>
                <p>G Loss: <span id="g_loss">{gLoss}</span></p>
            </div>
        </div>
    );
};

export default Train;