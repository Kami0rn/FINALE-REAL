import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";
import Nav from "../nav/Nav"; // Adjust the path as necessary
import Modal from "react-modal"; // Import react-modal

// Register necessary chart.js components
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

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
  const [epochData, setEpochData] = useState<number[]>([]); // Array to store epoch data for graph
  const [dLossData, setDLossData] = useState<number[]>([]); // Array to store dLoss data for graph
  const [gLossData, setGLossData] = useState<number[]>([]); // Array to store gLoss data for graph

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

        // Update chart data
        setEpochData((prev) => [...prev, data.epoch]);
        setDLossData((prev) => [...prev, data.d_loss]);
        setGLossData((prev) => [...prev, data.g_loss]);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    // Fetch initially
    fetchProgress();

    // Set interval to fetch every second
    const interval = setInterval(fetchProgress, 1000);

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
    const interval = setInterval(fetchLatestImage, 1000);

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
      await axios.post("http://127.0.0.1:5000/stop_training");
      alert("Training stopped successfully.");
      setIsDisabled(false); // Re-enable inputs and button
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Error stopping training:", error);
      alert("Error stopping training.");
    }
  };

  const data = {
    labels: epochData, // X-axis values (Epochs)
    datasets: [
      {
        label: "D Loss",
        data: dLossData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
      },
      {
        label: "G Loss",
        data: gLossData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Epochs",
        },
      },
      y: {
        title: {
          display: true,
          text: "Loss",
        },
      },
    },
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
              {/* Form Inputs */}
              {/* ... */}
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
              >
                Stop Training
              </button>
            </form>
          </div>

          {/* Display Progress */}
          <div className="relative z-10">
            <h3>Training Progress</h3>
            <p>Epoch: {epoch}</p>
            <p>Progress: {progress}%</p>
            <p>D Loss: {dLoss}</p>
            <p>G Loss: {gLoss}</p>
          </div>

          {/* Display Real-time Graph */}
          <div className="relative z-10 mt-8 w-full max-w-4xl h-64">
            <Line data={data} options={options} />
          </div>

          {/* Display Latest Image */}
          {latestImageUrl && (
            <div className="relative z-10 mt-8">
              <h3>Latest Generated Image</h3>
              <img src={latestImageUrl} alt="Latest" className="w-64 h-64" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Train;
