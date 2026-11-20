# Cloud & DevOps Automated Deployment Showcase

**Author:** Arya Shetty — 5th Sem CSE, RV College of Engineering  
**Stack:** HTML5, CSS3, Vanilla JS · Docker (`nginx:alpine`) · GitHub Actions CI/CD · AWS EC2 (Ubuntu)

A clean, zero-dependency single-page showcase website designed to be containerized with Docker (Nginx) and automatically deployed to an AWS EC2 Ubuntu instance on every push to `main`.

---

## Project Structure

```text
.
├── index.html                  # Single-page showcase web app (contains editable Live Build badge)
├── style.css                   # Dark-mode responsive styling
├── script.js                   # Interactive 5-stage CI/CD pipeline diagram
├── Dockerfile                  # nginx:alpine container definition (exposes port 80)
├── test.sh                     # Lightweight automated verification script
└── .github/
    └── workflows/
        └── deploy.yml          # 5-stage GitHub Actions CI/CD workflow
```

---

## 1. Fresh AWS EC2 Ubuntu Setup (Exact 3 Commands)

Launch an **Ubuntu** EC2 instance with a Security Group allowing inbound **SSH (Port 22)** and **HTTP (Port 80)**, SSH into the instance, and run these exact 3 commands:

```bash
# 1. Update packages and install Docker + Git
sudo apt-get update && sudo apt-get install -y docker.io git

# 2. Enable Docker on boot and grant the ubuntu user permission to run Docker without sudo
sudo systemctl enable --now docker && sudo usermod -aG docker $USER

# 3. Clone this repository into ~/app (the directory used by GitHub Actions Stage 5)
git clone https://github.com/Depp-Boy/5thSemSkillLabsProject.git ~/app
```

> **Tip:** If you want to test `docker` immediately in the same SSH session, run `newgrp docker` (or log out and back in). GitHub Actions opens a fresh SSH session automatically, so no extra step is needed for CI/CD.

---

## 2. Configure GitHub Repository Secrets

In your GitHub repository, navigate to **Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret Name | Value |
| :--- | :--- |
| `EC2_HOST` | Public IPv4 address or Public DNS of your EC2 instance |
| `EC2_USER` | `ubuntu` (default username for Ubuntu AMIs) |
| `EC2_SSH_KEY` | Full contents of your `.pem` private key file (including `-----BEGIN ...-----` and `-----END ...-----`) |

---

## 3. Trigger a Live Automated Deployment

1. Edit the version banner in `index.html` (for example, change `Live Build: v1.0` to `Live Build: v1.1`).
2. Commit and push to `main`:
   ```bash
   git add .
   git commit -m "Release v1.1"
   git push origin main
   ```
3. Watch all 5 stages execute in the **Actions** tab:
   - **Stage 1 - Checkout** (`actions/checkout@v4`)
   - **Stage 2 - Build** (`docker build -t devops-showcase .`)
   - **Stage 3 - Test** (`chmod +x test.sh && ./test.sh`)
   - **Stage 4 - Package** (`docker images | grep devops-showcase`)
   - **Stage 5 - Deploy** (SSH into EC2, pull code, rebuild, and restart `showcase-app` on port `80`)
4. Open `http://<EC2_PUBLIC_IP>` in your browser to see the updated live build!

---

## 4. Run Locally (Optional)

```bash
# Run automated tests (Git Bash / WSL / Linux / macOS)
chmod +x test.sh && ./test.sh

# Build and run the Docker container locally
docker build -t devops-showcase .
docker run -d -p 8080:80 --name showcase-local devops-showcase
# Visit http://localhost:8080
```
