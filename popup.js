document.addEventListener("DOMContentLoaded", () => {
  // Burger toggle (toggles navbar menu, not a redirect)
  document.querySelector(".burger").addEventListener("click", () => {
    document.querySelector(".nav-menu").classList.toggle("active");
  });

  // Dark mode toggle (redirects to a settings page in a new tab)
  document.getElementById("darkModeBtn").addEventListener("click", () => {
    // Open a new tab with a simple settings page for toggling
    const settingsPage = `
      <html>
      <head><title>Settings - Dark Mode</title></head>
      <body style="background-color: #8a2be2; color: #fff; font-family: Arial; padding: 20px;">
        <h1>Settings</h1>
        <button onclick="document.body.classList.toggle('dark'); document.body.classList.toggle('light');">🌙 Toggle Dark/Light Mode</button>
        <p>Toggle applied to this page. Refresh the extension popup to see changes there.</p>
      </body>
      </html>
    `;
    const blob = new Blob([settingsPage], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  });

  // Developer button (redirects to Facebook page in a new tab)
  document.getElementById("developer").addEventListener("click", () => {
    window.open("https://www.facebook.com/notfound500", "_blank");
  });

  // Home and Settings links (placeholders - redirect to simple pages)
  document.getElementById("home").addEventListener("click", () => {
    window.open("data:text/html,<html><body style='background-color: #8a2be2; color: #fff; padding: 20px;'><h1>Home</h1><p>Welcome to Facebook Cookie Viewer!</p></body></html>", "_blank");
  });
  document.getElementById("settings").addEventListener("click", () => {
    window.open("data:text/html,<html><body style='background-color: #8a2be2; color: #fff; padding: 20px;'><h1>Settings</h1><p>Settings page placeholder.</p></body></html>", "_blank");
  });

  // Fetch and display cookies
  chrome.cookies.getAll({ domain: "facebook.com" }, (cookies) => {
    // Priority order (important cookies first)
    const priority = ["c_user", "xs", "fr", "datr", "sb"];

    // Sort cookies by importance, then alphabetically
    cookies.sort((a, b) => {
      const pa = priority.indexOf(a.name);
      const pb = priority.indexOf(b.name);

      if (pa !== -1 || pb !== -1) {
        return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
      }
      return a.name.localeCompare(b.name);
    });

    // Arrange JSON cleanly
    const json = cookies.map(c => ({
      key: c.name,
      value: c.value,
      domain: "facebook.com",
      path: c.path || "/",
      hostOnly: Boolean(c.hostOnly),
      expirationDate: c.expirationDate ?? null
    }));

    // Cookie string
    const str = cookies
      .map(c => `${c.name}=${c.value}`)
      .join("; ");

    // Output to textareas
    document.getElementById("cookieJson").value = JSON.stringify(json, null, 2);
    document.getElementById("cookieString").value = str;

    // UID display
    const cUser = cookies.find(c => c.name === "c_user");
    document.getElementById("uid").textContent = "UID: " + (cUser ? cUser.value : "N/A");

    // View/Copy buttons (redirect to new tabs displaying the content)
    document.getElementById("copyJson").onclick = () => {
      const jsonText = JSON.stringify(json, null, 2);
      const page = `<html><body style="background-color: #8a2be2; color: #fff; font-family: Arial; padding: 20px;"><h1>JSON Cookies</h1><textarea style="width: 100%; height: 400px;">${jsonText}</textarea><p>Select and copy the text above.</p></body></html>`;
      window.open("data:text/html," + encodeURIComponent(page), "_blank");
    };

    document.getElementById("copyString").onclick = () => {
      const page = `<html><body style="background-color: #8a2be2; color: #fff; font-family: Arial; padding: 20px;"><h1>String Cookies</h1><textarea style="width: 100%; height: 400px;">${str}</textarea><p>Select and copy the text above.</p></body></html>`;
      window.open("data:text/html," + encodeURIComponent(page), "_blank");
    };
  });
});