// Black Sky AI API Integrations

// 1. Call Chat Function
export async function askGemini(message) {
    const response = await fetch("/.netlify/functions/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });
    return await response.json();
}

// 2. Create Razorpay Order
export async function createOrder(amount) {
    const response = await fetch("/.netlify/functions/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
    });
    return await response.json();
}

// 3. Verify Razorpay Payment
export async function verifyPayment(paymentData) {
    const response = await fetch("/.netlify/functions/verifyPayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData)
    });
    return await response.json();
}
