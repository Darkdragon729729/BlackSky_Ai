// Gemini API

export async function askGemini(message) {

    const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message
        })
    });

    return await response.json();

}



// Create Razorpay Order

export async function createOrder(amount) {

    const response = await fetch("/api/createOrder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount
        })
    });

    return await response.json();

}



// Verify Razorpay Payment

export async function verifyPayment(paymentData) {

    const response = await fetch("/api/verifyPayment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentData)
    });

    return await response.json();

}
