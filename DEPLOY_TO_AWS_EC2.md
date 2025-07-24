# 🚀 Hospital Management System: AWS EC2 Deployment Guide

This guide will walk you through deploying the Hospital Management System on an AWS EC2 instance using Docker images from Docker Hub and your `docker-compose.core.yml` file.

---

## Prerequisites

- AWS account with access to launch EC2 instances
- Docker images pushed to your Docker Hub repository (e.g., `alphasudo2/hospitalmanagementsystem-*`)
- `docker-compose.core.yml` file ready on your local machine
- SSH key pair for EC2 access

---

## 1. Launch an EC2 Instance

1. **Log in to AWS Console** and go to EC2 Dashboard.
2. **Launch Instance**:
   - Choose **Amazon Linux 2 AMI** (or Ubuntu 22.04 LTS).
   - Select **t3.medium** (or Free Tier eligible type, e.g., t2.micro for testing).
   - Configure storage (default is fine).
   - Add security group rules:
     - Allow SSH (port 22) from your IP.
     - Allow HTTP (80), HTTPS (443), and any custom ports your app uses (e.g., 8080, 8888, 8761, 5432, 27017, 5000, etc.).
   - Add your SSH key pair.
   - Launch the instance.

---

## 2. Connect to Your EC2 Instance

```sh
ssh -i /path/to/your-key.pem ec2-user@<EC2_PUBLIC_IP>
# or for Ubuntu:
# ssh -i /path/to/your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

---

## 3. Install Docker and Docker Compose

### For Amazon Linux 2

```sh
sudo yum update -y
sudo amazon-linux-extras install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user
# Log out and back in to apply group changes, or run:
newgrp docker
```

### For Ubuntu

```sh
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
newgrp docker
```

### Install Docker Compose

```sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

---

## 4. Copy `docker-compose.core.yml` to EC2

On your **local machine** (replace with your actual file path and EC2 details):

```sh
scp -i /path/to/your-key.pem docker-compose.core.yml ec2-user@<EC2_PUBLIC_IP>:~/
# or for Ubuntu:
# scp -i /path/to/your-key.pem docker-compose.core.yml ubuntu@<EC2_PUBLIC_IP>:~/
```

---

## 5. Log in to Docker Hub (on EC2)

```sh
docker login
# Enter your Docker Hub username and password
```

---

## 6. Pull All Required Images

Docker Compose will pull images automatically if not present, but you can pre-pull for speed:

```sh
docker-compose -f docker-compose.dockerhub.yml pull
```

---

## 7. Start the Application

```sh
docker-compose -f docker-compose.dockerhub.yml up -d
```

- This will start all services in the background.

---

## 8. Verify Deployment

- Check running containers:
  ```sh
  docker ps
  ```
- Access your app via the EC2 public IP and the relevant ports (e.g., `http://<EC2_PUBLIC_IP>:5000` for frontend).

---

## 9. (Optional) Manage and Monitor

- View logs:
  ```sh
  docker-compose -f docker-compose.core.yml logs -f
  ```
- Stop services:
  ```sh
  docker-compose -f docker-compose.core.yml down
  ```

---

## 10. Security & Maintenance

- Close unused ports in your EC2 security group.
- Regularly update your images and re-deploy as needed.
- Consider using a domain name and HTTPS for production.

---

# 🎉 Done!

Your Hospital Management System should now be running on your AWS EC2 instance, powered by Docker Compose and images from Docker Hub. 