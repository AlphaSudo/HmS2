

---

## 🚀 Deploying on Oracle Cloud Free Tier ARM (Ampere A1) with Docker Compose

### 1. Prepare Your Oracle Cloud ARM Instance
- Create an Ubuntu ARM instance (Ampere A1) in Oracle Cloud.
- Open required ports (80, 5000, 8080, 8081, 8082, 8083, 8084, 8087, 8089, 8888, 8761, 5432, 27017) in the security list.

### 2. Install Docker & Docker Compose
```sh
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release git python3-pip
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo mkdir -p /etc/apt/keyrings

echo \
  "deb [arch=arm64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker $USER
# Log out and back in to enable Docker group
sudo pip3 install docker-compose
```

### 3. Clone the Project
```sh
git clone <your-repo-url> hms
cd hms
```
Or upload your project files via SFTP/WinSCP.

### 4. Build ARM-Compatible Images
- Ensure all Dockerfiles use ARM64-compatible base images (e.g., `openjdk`, `node`, `python`, `postgres`, `mongo`).
- If needed, add `--platform=linux/arm64` to your Docker build commands.

### 5. Configure Environment (Optional)
- Edit secrets or environment variables in `docker-compose.core.yml` as needed.

### 6. Start the Stack
```sh
sudo docker-compose -f docker-compose.core.yml up --build -d
```

### 7. Verify Services
- Check running containers: `sudo docker ps`
- Access the frontend at `http://<your_public_ip>:5000` (or port 80 if mapped).
- Access backend services via their respective ports.

### 8. Troubleshooting
- View logs: `sudo docker-compose -f docker-compose.core.yml logs -f`
- If a service fails to build, check the Dockerfile for ARM compatibility.

### 9. (Optional) Set Up Auto-Start
```sh
sudo crontab -e
# Add this line:
@reboot cd /home/ubuntu/hms && /usr/local/bin/docker-compose -f docker-compose.core.yml up -d
```

### 10. Security & Maintenance
- Remove unused ports from security list after testing.
- Use strong secrets in production.
- Regularly update your images and dependencies.

--- 