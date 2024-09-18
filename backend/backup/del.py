import os
import random

# Specify the directory
directory = r"E:\CPE\1-2567\Project\Finale\Anime\images"

# List all files in the directory
all_files = [os.path.join(directory, f) for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]

# Calculate how many files to delete (80%)
num_files_to_delete = int(0.8 * len(all_files))

# Randomly select files to delete
files_to_delete = random.sample(all_files, num_files_to_delete)

# Delete the selected files
for file in files_to_delete:
    os.remove(file)
    print(f"Deleted {file}")

print(f"Deleted {num_files_to_delete} files out of {len(all_files)}")
