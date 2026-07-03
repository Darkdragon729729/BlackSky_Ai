import { askGemini } from "./api.js";

const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", function(e) {
        if(e.key === "Enter") {
            sendMessage();
        }
    });
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if(message === "") return;

    // 1. Render user message in view UI
    addUserMessage(message);
    messageInput.value = "";

    // 2. Display standard thinking placeholder state
    addBotLoader();

    try {
        // 3. Hit our newly routed serverless function wrapper
        const data = await askGemini(message);
        
        // 4. Clean out loader text and present server answer safely
        removeLoaderAndReply(data.reply || data.error || "No response text.");
    } catch(err) {
        console.error("Transmission breakdown:", err);
        removeLoaderAndReply("❌ System Error: Unable to communicate with Black Sky AI backend layers.");
    }
}

function addUserMessage(text) {
    const div = document.createElement("div");
    div.className = "user";
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addBotLoader() {
    const div = document.createElement("div");
    div.className = "bot";
    div.id = "bot-loading-indicator";
    div.textContent = "Thinking...";
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLoaderAndReply(replyText) {
    const loader = document.getElementById("bot-loading-indicator");
    if(loader) {
        loader.textContent = replyText; // Cleanly swaps "Thinking..." out for the actual message
        loader.removeAttribute("id");
    } else {
        // Fallback catch mechanism if node tree elements drop out
        const div = document.createElement("div");
        div.className = "bot";
        div.textContent = replyText;
        chatBox.appendChild(div);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}
