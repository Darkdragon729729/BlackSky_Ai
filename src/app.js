import { askGemini, createOrder, verifyPayment } from "./api.js";

// ==========================================
// 1. CHATBOT ENGINE LOGIC (चैट पेज के लिए)
// ==========================================
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

if (sendBtn && messageInput) {
    sendBtn.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (message === "") return;

    // 1. स्क्रीन पर यूजर का मैसेज दिखाएं
    addUserMessage(message);
    messageInput.value = "";

    // 2. "Thinking..." लोडर दिखाएं
    addBotLoader();

    try {
        // 3. Netlify Functions के ज़रिए API को कॉल करें
        const data = await askGemini(message);
        
        // 4. लोडर को हटाकर AI का असली रिप्लाई दिखाएं
        removeLoaderAndReply(data.reply || data.error || "No response text.");
    } catch (err) {
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
    if (loader) {
        loader.textContent = replyText; 
        loader.removeAttribute("id");
    } else {
        const div = document.createElement("div");
        div.className = "bot";
        div.textContent = replyText;
        chatBox.appendChild(div);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}


// ==========================================
// 2. SECURE RAZORPAY LOGIC (पेमेंट पेज के लिए)
// ==========================================
const payBtn = document.getElementById("payBtn");

if (payBtn) {
    payBtn.onclick = async function () {
        const customAmountInput = document.getElementById("customAmount");
        const selectedAmount = customAmountInput ? Number(customAmountInput.value) : 0;

        if (!selectedAmount || selectedAmount < 1) {
            alert("Please select or enter a valid amount.");
            return;
        }

        try {
            // स्टेप 1: बैकएंड फंक्शन से सुरक्षित Razorpay Order ID जनरेट करें
            const orderData = await createOrder(selectedAmount);
            
            // स्टेप 2: Razorpay पेमेंट गेटवे की कॉन्फ़िगरेशन सेट करें
            const options = {
                key: "YOUR_RAZORPAY_PUBLIC_KEY_ID", // यहाँ अपना असली Razorpay Public Key डालें
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Black Sky AI",
                description: "Premium System Access Credit Top-Up",
                order_id: orderData.id,
                handler: async function (response) {
                    // स्टेप 3: पेमेंट सफल होने के बाद उसे बैकएंड पर सुरक्षित वेरीफाई करें
                    const verification = await verifyPayment(response);
                    if (verification.success) {
                        alert("Success! Wallet balance updated securely.");
                        window.location.href = "chat.html"; // यूजर को चैट पर भेजें
                    } else {
                        alert("Verification Rejected: Cryptographic validation layer failure.");
                    }
                },
                theme: {
                    color: "#3b82f6" // थीम का रंग जो आपके डार्क मोड से मैच करेगा
                }
            };
            
            // स्टेप 4: रेज़रपे का सुरक्षित चेकआउट पॉपअप खोलें
            const rzp = new Razorpay(options);
            rzp.open();

        } catch (err) {
            alert("Transaction failed to initialize.");
            console.error("Payment initialization error:", err);
        }
    };
}
