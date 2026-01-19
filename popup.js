document.addEventListener("DOMContentLoaded", () => {
  // Burger toggle
  document.querySelector(".burger").addEventListener("click", () => {
    document.querySelector(".nav-menu").classList.toggle("active");
  });

  // Dark mode toggle
  document.getElementById("darkModeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
  });

  // Developer button
  document.getElementById("developerBtn").addEventListener("click", () => {
    alert("Developer: [Your Name or Info]\nEmail: example@example.com\nVersion: 1.0");
  });

  // Copy function and cookie fetching
  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  chrome.cookies.getAll({ domain: "facebook.com" }, function(cookies) {
    // JSON format
    const json = cookies.map(c => ({
      key: c.name,
      value: c.value,
      domain: "facebook.com",
      path: c.path,
      hostOnly: c.hostOnly,
      expirationDate: c.expirationDate || null
    }));

    // String format
    const str = cookies.map(c => `${c.name}=${c.value}`).join("; ");

    document.getElementById("cookieJson").value = JSON.stringify(json, null, 2);
    document.getElementById("cookieString").value = str;

    // Show UID from cookies
    const c_user = cookies.find(c => c.name === "c_user");
    document.getElementById("uid").textContent = "UID: " + (c_user ? c_user.value : "N/A");

    // Copy buttons
    document.getElementById("copyJson").onclick = () => copy(JSON.stringify(json));
    document.getElementById("copyString").onclick = () => copy(str);
  });
});