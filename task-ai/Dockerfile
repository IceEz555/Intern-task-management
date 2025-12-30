
# Use official Python image
FROM python:3.10-slim

# Set working directory to /app
WORKDIR /app

# Copy requirements (if any)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the source code
COPY . .

# Expose ports
EXPOSE 8000 8001

# Default command (overridden in docker-compose)
CMD ["uvicorn", "server:app",  "--reload"]
