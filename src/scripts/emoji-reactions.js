import { getFirebaseDb } from "../utils/firebase.js";
import { onValue, ref, runTransaction } from "firebase/database";

export function initEmojiReactions() {
  const roots = Array.from(document.querySelectorAll("[data-emoji-reactions]"));

  if (!roots.length) {
    console.warn("Emoji reactions root not found");
  }

  roots.forEach((root) => {
    const pageKey = root.dataset.pageKey || "global";
    const storageKey = `emoji-reactions:${pageKey}`;

    const buttons = Array.from(root.querySelectorAll("[data-emoji-id]"));

    function readLocalState() {
      try {
        return JSON.parse(localStorage.getItem(storageKey) || "{}");
      } catch {
        return {};
      }
    }

    function writeLocalState(state) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        // Ignore storage errors (private mode, quota, etc.)
      }
    }

    const localState = readLocalState();

    function applyLocalState() {
      buttons.forEach((button) => {
        const emojiId = button.dataset.emojiId || "";
        const hasReacted = Boolean(localState[emojiId]);
        button.classList.toggle("is-clicked", hasReacted);
      });
    }

    applyLocalState();

    let db;
    try {
      db = getFirebaseDb();
    } catch (error) {
      console.warn("Firebase not configured:", error);
    }

    if (!db) return;

    const baseRef = ref(db, `reactions/${pageKey}`);

    onValue(baseRef, (snapshot) => {
      const data = snapshot.val() || {};
      buttons.forEach((button) => {
        const emojiId = button.dataset.emojiId || "";
        const count = data?.[emojiId] ?? 0;
        const countEl = button.querySelector("[data-count]");
        if (countEl) countEl.textContent = String(count);
      });
    });

    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        const emojiId = button.dataset.emojiId || "";
        if (!emojiId) return;

        const emojiRef = ref(db, `reactions/${pageKey}/${emojiId}`);
        try {
          const isActive = Boolean(localState[emojiId]);
          await runTransaction(emojiRef, (current) => {
            const value = Number(current || 0);
            if (isActive) return Math.max(0, value - 1);
            return value + 1;
          });
          localState[emojiId] = !isActive;
          writeLocalState(localState);
          applyLocalState();
        } catch (error) {
          console.warn("Failed to save reaction:", error);
        }
      });
    });
  });
}
