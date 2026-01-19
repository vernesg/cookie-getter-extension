// Burger toggle
document.querySelector(".burger").addEventListener("click", () => {
  document.querySelector(".nav-menu").classList.toggle("active");
});

// Dark mode toggle
document.getElementById("darkModeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});

// Copy function
function copy(text) {
  navigator.clipboard.writeText(text);
}

// Copy buttons
document.getElementById("copyJson").addEventListener("click", () => {
  copy(document.getElementById("cookieJson").value);
});
document.getElementById("copyString").addEventListener("click", () => {
  copy(document.getElementById("cookieString").value);
});

// === Fetch FB cookies ===
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

  // Show UID and name from cookies
  const c_user = cookies.find(c => c.name === "c_user");
  document.getElementById("uid").textContent = "UID: " + (c_user ? c_user.value : "N/A");

  // Fetch public profile info using UID if available
  if (c_user) {
    const profileUrl = `https://www.facebook.com/${c_user.value}`;
    fetch(profileUrl)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const ogImage = doc.querySelector('meta[property="og:image"]');
        const ogName = doc.querySelector('meta[property="og:title"]');
        document.getElementById("pfp").src = ogImage ? ogImage.content : "";
        document.getElementById("name").textContent = ogName ? "Name: " + ogName.content : "Name: N/A";
      })
      .catch(() => {
        document.getElementById("pfp").src = "";
        document.getElementById("name").textContent = "Name: N/A";
      });
  } else {
    document.getElementById("pfp").src = "";
    document.getElementById("name").textContent = "Name: N/A";
  }

});