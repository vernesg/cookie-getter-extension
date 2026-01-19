document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const darkModeSwitch = document.getElementById("darkModeSwitch");

  // Burger toggle (slides sidebar in/out, covering half the page)
  document.querySelector(".burger").addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  // Dark mode toggle (switch inside navbar)
  darkModeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
  });

  // Developer button (opens Facebook page in new tab)
  document.getElementById("developer").addEventListener("click", () => {
    window.open("https://www.facebook.com/notfound500", "_blank");
  });

  // Home and Settings links (placeholders - open simple pages in new tabs)
  document.getElementById("home").addEventListener("click", () => {
    window.open("data:text/html,<html><body style='background-color: #8a2be2; color: #fff; padding: 20px;'><h1>Home</h1><p>Welcome to Facebook Cookie Viewer!</p></body></html>", "_blank");
  });
  document.getElementById("settings").addEventListener("click", () => {
    window.open("data:text/html,<html><body style='background-color: #8a2be2; color: #fff; padding: 20px;'><h1>Settings</h1><p>Settings page placeholder.</p></body></html>", "_blank");
  });

  // Exit button (closes the popup)
  document.getElementById("exitBtn").addEventListener("click", () => {
    window.close();
  });

  // Copy helper (real clipboard copy)
  function copy(text) {
    navigator.clipboard.writeText(text).then(() => {
      console.log("Copied to clipboard!"); // Minimal feedback
    }).catch(err => {
      console.error("Failed to copy: ", err);
    });
  }

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

    // Copy buttons (real clipboard copy)
    document.getElementById("copyJson").onclick = () =>
      copy(JSON.stringify(json, null, 2));

    document.getElementById("copyString").onclick = () =>
      copy(str);
  });
});