import { getFirebaseDb } from "../utils/firebase.js";
import { onChildAdded, push, ref, serverTimestamp } from "firebase/database";
import { Filter } from "bad-words";

const adjectives = [
  "Collective",
  "Cooperative",
  "Mutual",
  "Shared",
  "Public",
  "Open",
  "OpenSource",
  "DIY",
  "HandsOn",
  "Grassroots",
  "Neighborly",
  "Kind",
  "Gentle",
  "Tender",
  "Warm",
  "Welcoming",
  "Attentive",
  "Considerate",
  "Compassionate",
  "Supportive",
  "Encouraging",
  "Patient",
  "Listening",
  "Respectful",
  "Thoughtful",
  "Mindful",
  "Caring",
  "Nurturing",
  "Steady",
  "Trusting",
  "Grateful",
  "Hopeful",
  "Humble",
  "Soft",
  "Generous",
  "Curious",
  "Brave",
  "Playful",
  "Resourceful",
  "Solid",
  "Woven",
  "Sticky",
  "Sparked",
  "Luminous",
  "Radical",
  "Commons",
  "Field",
  "Studio",
  "Maker",
  "Repair",
  "Iterative",
  "Modular",
  "Slow",
  "Quiet",
  "Noisy",
  "Bold",
  "Soft",
  "Nimble",
  "Hybrid",
  "Local",
  "Distributed",
  "Networked",
  "Community",
  "Accessible",
  "Inclusive",
];

const nouns = [
  "Builder",
  "Steward",
  "Weaver",
  "Mixer",
  "Connector",
  "Caretaker",
  "Facilitator",
  "Listener",
  "Organizer",
  "Maker",
  "Repairer",
  "Tinkerer",
  "Gardener",
  "Archivist",
  "Mapper",
  "Scribe",
  "Host",
  "Bridge",
  "Commons",
  "Circle",
  "Crew",
  "Collective",
  "Workshop",
  "Studio",
  "Kitchen",
  "Toolbox",
  "Library",
  "Notebook",
  "Ledger",
  "Relay",
  "Mosaic",
  "Chorus",
  "Assembly",
  "Table",
  "Harbor",
  "Camp",
  "Campfire",
  "Signal",
  "Loom",
  "Patch",
  "Thread",
  "Root",
  "Seed",
  "Hub",
  "Node",
  "Spark",
  "Draft",
  "Prototype",
  "Coop",
];

const nameKey = "anon-chat-name";
const filter = new Filter();

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

function setName(name) {
  localStorage.setItem(nameKey, name);
  syncNameDisplays(name);
}

function syncNameDisplays(name = getName()) {
  document.querySelectorAll("[data-anon-name]").forEach((element) => {
    element.textContent = name;
  });
}

function getChatPath(roomId) {
  return roomId ? `chat/rooms/${roomId}/messages` : "chat/messages";
}

function appendMessage(messagesEl, data) {
  const wrapper = document.createElement("div");
  wrapper.className = "anon-chat__message";
  const main = document.createElement("div");
  main.className = "anon-chat__message-main";
  const title = document.createElement("strong");
  title.textContent = data.name || "anonymous";
  const body = document.createElement("span");
  body.className = "anon-chat__message-body";
  body.textContent = `: ${data.text || ""}`;
  const meta = document.createElement("span");
  meta.className = "anon-chat__message-time";
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
}

function initChatRoot(root) {
  if (root.dataset.anonChatInitialized === "true") return;
  root.dataset.anonChatInitialized = "true";

  const messagesEl = root.querySelector("[data-anon-messages]");
  const form = root.querySelector("[data-anon-form]");
  const refreshBtn = root.querySelector("[data-anon-refresh]");
  const canWrite = root.dataset.anonCanWrite !== "false";
  const roomId = root.dataset.anonRoomId || "";

  syncNameDisplays();

  if (canWrite) {
    refreshBtn?.addEventListener("click", () => {
      setName(randomName());
    });
  }

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
    return;
  }

  const chatRef = ref(db, getChatPath(roomId));

  onChildAdded(chatRef, (snapshot) => {
    const data = snapshot.val();
    if (!data || !messagesEl) return;
    appendMessage(messagesEl, data);
  });

  if (canWrite && form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = form.querySelector("input[name='message']");
      if (!input) return;

      const rawText = input.value.trim();
      if (!rawText) return;
      if (filter.isProfane(rawText)) {
        input.value = "";
        input.placeholder = "Profanity detected. Please be kind!";
        return;
      }

      try {
        await push(chatRef, {
          name: getName(),
          text: rawText,
          createdAt: Date.now(),
          roomId: roomId || "homepage",
          serverAt: serverTimestamp(),
        });
        input.value = "";
      } catch (error) {
        console.warn("Failed to send message:", error);
      }
    });
  }
}

export function initAnonymousChat() {
  const roots = document.querySelectorAll("[data-anon-chat]");
  roots.forEach((root) => initChatRoot(root));
}
