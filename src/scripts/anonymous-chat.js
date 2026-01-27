import { getFirebaseDb } from "../utils/firebase";
import { onChildAdded, push, ref, serverTimestamp } from "firebase/database";

const root = document.querySelector("[data-anon-chat]");
if (!root) {
  console.warn("Anonymous chat root not found");
} else {
  const messagesEl = root.querySelector("[data-anon-messages]");
  const form = root.querySelector("[data-anon-form]");
  const nameEl = root.querySelector("[data-anon-name]");
  const refreshBtn = root.querySelector("[data-anon-refresh]");

  const adjectives = [
    "Sleepy",
    "Cosmic",
    "Pixel",
    "Caffeinated",
    "Velvet",
    "Zesty",
    "Hyper",
    "Lo-fi",
    "Sparkly",
    "Dusty",
  ];
  const nouns = [
    "Otter",
    "Moth",
    "Nebula",
    "Pancake",
    "Capybara",
    "Bonsai",
    "Comet",
    "Tangent",
    "Ramen",
    "Marsh",
  ];
  const nameKey = "anon-chat-name";

  function randomName() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const code = Math.floor(Math.random() * 90 + 10);
    return `${adj}-${noun}-${code}`.toLowerCase();
  }

  function getName() {
    const stored = localStorage.getItem(nameKey);
    if (stored) return stored;
    const fresh = randomName();
    localStorage.setItem(nameKey, fresh);
    return fresh;
  }

  function setNameDisplay(name) {
    if (nameEl) nameEl.textContent = name;
  }

  let displayName = getName();
  setNameDisplay(displayName);

  refreshBtn?.addEventListener("click", () => {
    displayName = randomName();
    localStorage.setItem(nameKey, displayName);
    setNameDisplay(displayName);
  });

  let db;
  try {
    db = getFirebaseDb();
  } catch (error) {
    console.warn("Firebase not configured:", error);
  }

  if (!db) {
    if (messagesEl) {
      messagesEl.innerHTML =
        '<div class="anon-chat__message">Firebase not configured.</div>';
    }
  } else {
    const chatRef = ref(db, "chat/messages");

    onChildAdded(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (!data || !messagesEl) return;
      const wrapper = document.createElement("div");
      wrapper.className = "anon-chat__message";
      const main = document.createElement("div");
      main.className = "anon-chat__message-main";
      const title = document.createElement("strong");
      title.textContent = data.name || "anonymous";
      const body = document.createElement("span");
      body.textContent = `: ${data.text || ""}`;
      const meta = document.createElement("span");
      if (data.createdAt) {
        const time = new Date(data.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        meta.textContent = time;
      }

      main.appendChild(title);
      main.appendChild(body);
      wrapper.appendChild(main);
      if (meta.textContent) wrapper.appendChild(meta);
      messagesEl.appendChild(wrapper);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = form.querySelector("input[name='message']");
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;

      try {
        await push(chatRef, {
          name: displayName,
          text,
          createdAt: Date.now(),
          serverAt: serverTimestamp(),
        });
        input.value = "";
      } catch (error) {
        console.warn("Failed to send message:", error);
      }
    });
  }
}
