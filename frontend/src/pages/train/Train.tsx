import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../nav/Nav"; // Adjust the path as necessary

const Train: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [dLoss, setDLoss] = useState(0);
  const [gLoss, setGLoss] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [numEpochs, setNumEpochs] = useState(100); // Default to 100 epochs

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get("http://localhost:5000/progress");
        const data = response.data;
        setProgress(data.progress);
        setEpoch(data.epoch);
        setDLoss(data.d_loss);
        setGLoss(data.g_loss);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    }, 1000); // Poll every second

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
      alert("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images", selectedFiles[i]);
    }
    formData.append("epochs", numEpochs.toString());

    try {
      await axios.post("http://127.0.0.1:5000/wgan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Files uploaded successfully.");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files.");
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/path/to/your/background.jpg')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <Nav />
        <main className="flex flex-col items-center justify-center flex-1 px-4 fade-in my-24">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-sm"
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Files:
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Number of Epochs:
              </label>
              <input
                type="number"
                value={numEpochs}
                onChange={handleEpochChange}
                placeholder="Number of Epochs"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-2 mt-4 rounded-full text-black transition"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,153,153,1), rgba(153,255,204,1), rgba(255,204,255,1))",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              Upload and Train
            </button>
          </form>
          <div className="mt-8 w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-sm">
            <progress
              id="progress-bar"
              value={progress}
              max="100"
              className="w-full h-4 rounded-lg overflow-hidden bg-gray-200"
            >
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
                style={{ width: `${progress}%` }}
              ></div>
            </progress>
            <p className="mt-4 text-gray-700">
              Epoch: <span id="epoch">{epoch}</span>
            </p>
            <p className="text-gray-700">
              Progress: <span id="progress">{progress.toFixed(2)}</span>%
            </p>
            <p className="text-gray-700">
              D Loss: <span id="d_loss">{dLoss}</span>
            </p>
            <p className="text-gray-700">
              G Loss: <span id="g_loss">{gLoss}</span>
            </p>
          </div>
        </main>
        <footer className="w-full py-4 text-center text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-gradient-x">
          <p>&copy; 2023 XenoAI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Train;
