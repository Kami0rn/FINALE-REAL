import subprocess

# Start the Flask server in a separate process
flask_process = subprocess.Popen([r"E:/Anaconda/envs/new310/python.exe", r"e:/CPE/1-2567/Project/FINALE REAL/backend/blockchain/server.py"])

# Start the second script
main2_process = subprocess.Popen([r"E:/Anaconda/envs/new310/python.exe", r"e:/CPE/1-2567/Project/FINALE REAL/backend/main2.py"])

# Optionally, wait for both processes to complete
main2_process.wait()
flask_process.wait()

