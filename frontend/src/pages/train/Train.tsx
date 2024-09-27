import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../nav/Nav"; // Adjust the path as necessary
import Modal from "react-modal"; // Import react-modal

Modal.setAppElement("#root"); // Set the root element for accessibility

const Train: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [dLoss, setDLoss] = useState(0);
  const [gLoss, setGLoss] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [numEpochs, setNumEpochs] = useState(100); // Default to 100 epochs
  const [userCustomName, setUserCustomName] = useState(""); // Custom name input
  const [latestImageUrl, setLatestImageUrl] = useState(""); // URL of the latest image
  const [isDisabled, setIsDisabled] = useState(false); // State to manage disabled inputs
  const [isLoading, setIsLoading] = useState(false); // State to manage loading indicator
  const username = localStorage.getItem("username"); // Retrieve username from local storage

  // Fetch progress data
  useEffect(() => {
    const fetchProgress = async () => {
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
    };

    // Fetch initially
    fetchProgress();

    // Set interval to fetch every second
    const interval = setInterval(fetchProgress, 10000);

    return () => clearInterval(interval);
  }, []);

  // Fetch the latest image every second
  useEffect(() => {
    const fetchLatestImage = async () => {
      try {
        if (username && userCustomName) {
          const imageResponse = await axios.get(
            `http://localhost:5000/latest_image/${username}/${userCustomName}`,
            {
              responseType: "blob",
              headers: {
                "Cache-Control": "no-cache", // Ensure no caching
                Pragma: "no-cache",
                Expires: "0",
              },
            }
          );
          const imageUrl = URL.createObjectURL(imageResponse.data);
          setLatestImageUrl(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching latest image:", error);
      }
    };

    // Set interval to fetch the image every second
    const interval = setInterval(fetchLatestImage, 10000);

    return () => clearInterval(interval);
  }, [username, userCustomName]); // Keep the dependencies in case username or custom name changes

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleEpochChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumEpochs(parseInt(event.target.value, 10));
  };

  const handleCustomNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUserCustomName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFiles) {
      alert("Please select files to upload.");
      return;
    }

    if (!username || !userCustomName) {
      alert("Please provide both username and custom name.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images", selectedFiles[i]);
    }
    formData.append("epochs", numEpochs.toString());
    formData.append("username", username);
    formData.append("user_custom_name", userCustomName);

    try {
      setIsDisabled(true); // Disable inputs and button
      setIsLoading(true); // Show loading indicator
      await axios.post("http://127.0.0.1:5000/wgan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      localStorage.setItem("user_model_name", userCustomName); // Save custom name to local storage
      alert("Files uploaded successfully.");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files.");
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const handleStopTraining = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/stop_training");
      if (response.status === 200) {
        alert("Training stopped successfully.");
        setIsDisabled(false); // Re-enable inputs and button
        window.location.reload(); // Refresh the page
      } else {
        alert("Failed to stop training.");
      }
    } catch (error) {
      console.error("Error stopping training:", error);
      alert("Error stopping training.");
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
          <div className="flex w-full max-w-4xl">
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
                  disabled={isDisabled} // Disable input when form is submitted
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
                  disabled={isDisabled} // Disable input when form is submitted
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Custom Name:
                </label>
                <input
                  type="text"
                  value={userCustomName}
                  onChange={handleCustomNameChange}
                  placeholder="Custom Name"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  disabled={isDisabled} // Disable input when form is submitted
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
                disabled={isDisabled} // Disable button when form is submitted
              >
                Upload and Train
              </button>
              <button
                type="button"
                onClick={handleStopTraining}
                className="w-full px-6 py-2 mt-4 rounded-full text-black transition"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,153,153,1), rgba(153,255,204,1), rgba(255,204,255,1))",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                disabled={!isDisabled} // Enable button only when training is in progress
              >
                Stop Training
              </button>
            </form>
            <div className="ml-8 w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-sm">
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
              {latestImageUrl && (
                <div className="mt-4">
                  <img
                    src={latestImageUrl}
                    alt="Latest generated"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </main>
        <footer className="w-full py-4 text-center text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-gradient-x">
          <p>&copy; 2023 XenoAI. All rights reserved.</p>
        </footer>
      </div>
      <Modal
        isOpen={isLoading && epoch === 0}
        contentLabel="Loading"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
        overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg animate-pulse z-60">
          <p className="text-gray-700">Loading...</p>
        </div>
      </Modal>
    </div>
  );
};

export default Train;