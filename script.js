const PIPELINE_STAGES = {
  checkout: {
    badge: "Stage 01",
    title: "Checkout Source Code",
    runner: "GitHub Runner (ubuntu-latest)",
    summary:
      "Pulls the latest commit from the main branch into a clean GitHub Actions runner workspace using actions/checkout@v4 so every downstream stage operates on the exact pushed revision.",
    command: "uses: actions/checkout@v4"
  },
  build: {
    badge: "Stage 02",
    title: "Build Docker Image",
    runner: "GitHub Runner (ubuntu-latest)",
    summary:
      "Compiles the Dockerfile on top of nginx:alpine and copies index.html, style.css, and script.js into /usr/share/nginx/html/. Fails fast if any Dockerfile syntax or asset error exists.",
    command: "docker build -t devops-showcase ."
  },
  test: {
    badge: "Stage 03",
    title: "Run Automated Tests",
    runner: "GitHub Runner (ubuntu-latest)",
    summary:
      "Makes test.sh executable and runs automated verification checks confirming required application files exist and that index.html renders the live version badge before deployment proceeds.",
    command: "chmod +x test.sh && ./test.sh"
  },
  package: {
    badge: "Stage 04",
    title: "Verify Packaged Image",
    runner: "GitHub Runner (ubuntu-latest)",
    summary:
      "Confirms that the freshly built devops-showcase Docker image is present in the local Docker image cache and ready for production rollout.",
    command: "docker images | grep devops-showcase"
  },
  deploy: {
    badge: "Stage 05",
    title: "Deploy to AWS EC2",
    runner: "AWS EC2 Ubuntu via SSH",
    summary:
      "Connects securely to the Ubuntu EC2 instance using encrypted GitHub Secrets (EC2_HOST, EC2_USER, EC2_SSH_KEY), pulls the latest code into ~/app, replaces the old showcase-app container, rebuilds, and starts the new container on port 80.",
    command:
      "cd ~/app && git pull origin main && docker stop showcase-app || true && docker rm showcase-app || true && docker build -t devops-showcase . && docker run -d -p 80:80 --name showcase-app --restart always devops-showcase"
  }
};

const stageKeys = Object.keys(PIPELINE_STAGES);
const stepButtons = Array.from(document.querySelectorAll(".pipeline-step"));
const detailBadge = document.getElementById("detail-badge");
const detailTitle = document.getElementById("detail-title");
const detailRunner = document.getElementById("detail-runner");
const detailSummary = document.getElementById("detail-summary");
const detailCommand = document.getElementById("detail-command");
const simulateBtn = document.getElementById("simulate-btn");

let walkTimer = null;

function selectStage(stageKey) {
  const stage = PIPELINE_STAGES[stageKey];
  if (!stage) return;

  stepButtons.forEach((btn) => {
    const isActive = btn.dataset.stage === stageKey;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  });

  detailBadge.textContent = stage.badge;
  detailTitle.textContent = stage.title;
  detailRunner.textContent = stage.runner;
  detailSummary.textContent = stage.summary;
  detailCommand.textContent = stage.command;
}

function stopWalkthrough() {
  if (walkTimer !== null) {
    clearInterval(walkTimer);
    walkTimer = null;
  }
  simulateBtn.classList.remove("running");
  simulateBtn.querySelector("span").textContent = "Walk Through Pipeline";
}

function startWalkthrough() {
  if (walkTimer !== null) {
    stopWalkthrough();
    return;
  }

  let index = 0;
  simulateBtn.classList.add("running");
  simulateBtn.querySelector("span").textContent = "Stop Walkthrough";
  selectStage(stageKeys[index]);

  walkTimer = setInterval(() => {
    index += 1;
    if (index >= stageKeys.length) {
      stopWalkthrough();
      return;
    }
    selectStage(stageKeys[index]);
  }, 1800);
}

stepButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    stopWalkthrough();
    selectStage(btn.dataset.stage);
  });
});

simulateBtn.addEventListener("click", startWalkthrough);
