document.addEventListener("DOMContentLoaded", () => {
  // Load saved background
  chrome.storage.local.get(["backgroundUrl"], (result) => {
    if (result.backgroundUrl) {
      document.body.style.backgroundImage = `url(${result.backgroundUrl})`;
    }
  });

  // Timer variables
  let countdown;
  let targetDate;

  // Timer functions
  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(countdown);
      document.querySelector(".timer-display").textContent = "EXPIRED";
      return;
    }

    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.querySelector(".timer-display").textContent = `${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  // Event Listeners
  document.getElementById("startTimer").addEventListener("click", () => {
    const input = document.getElementById("targetDate");
    if (!input.value) return;

    targetDate = new Date(input.value).getTime();
    clearInterval(countdown);
    countdown = setInterval(updateTimer, 1000);
    updateTimer();
  });

  document.getElementById("resetTimer").addEventListener("click", () => {
    clearInterval(countdown);
    document.querySelector(".timer-display").textContent = "00:00:00";
    document.getElementById("targetDate").value = "";
  });

  // Settings Modal
  const modal = document.getElementById("settingsModal");

  document.getElementById("openSettings").addEventListener("click", () => {
    modal.style.display = "block";
  });

  document.getElementById("closeSettings").addEventListener("click", () => {
    modal.style.display = "none";
  });

  document.getElementById("saveSettings").addEventListener("click", () => {
    const bgUrl = document.getElementById("bgUrl").value;
    if (bgUrl) {
      chrome.storage.local.set({ backgroundUrl: bgUrl });
      document.body.style.backgroundImage = `url(${bgUrl})`;
    }
    modal.style.display = "none";
  });

  // Background Upload
  document.getElementById("bgUpload").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const backgroundUrl = e.target.result;
        chrome.storage.local.set({ backgroundUrl });
        document.body.style.backgroundImage = `url(${backgroundUrl})`;
      };
      reader.readAsDataURL(file);
    }
  });
});
