# Start from an official Python image.
# This is the base layer — a minimal Linux system with Python 3.11 already installed.
# "slim" means it's a stripped down version with only what's needed, keeping the image small.
FROM python:3.11-slim

# Set the working directory inside the container.
# All following commands will run from this folder.
# If it doesn't exist, Docker creates it automatically.
WORKDIR /app

# Copy requirements.txt into the container first.
# We do this as a separate step before copying the rest of the code
# because Docker caches each step — if requirements.txt hasn't changed,
# Docker skips the pip install step on the next build, making it faster.
COPY requirements.txt .

# Install the Python dependencies listed in requirements.txt
RUN pip install -r requirements.txt

# Copy the rest of your project files into the container.
# The first dot is the source (your project folder on your machine).
# The second dot is the destination (the /app folder inside the container).
COPY . .

# Tell Docker that the container will listen on port 5000.
# This is documentation — it doesn't actually open the port, docker-compose does that.
EXPOSE 5000

# The command to run when the container starts.
# This is equivalent to running "python server.py" in your terminal.
CMD ["python", "server.py"]