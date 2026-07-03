import Razorpay from "razorpay";

export async function handler(event) {
  if (event.httpMethod !== "POST") { // Enforce POST method validation[span_21](start_span)[span_21](end_span)
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }) // Send back method block[span_22](start_span)[span_22](end_span)
    };
  }

  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Razorpay environment credentials missing." })
      };
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID, // Use server variable ID[span_23](start_span)[span_23](end_span)
      key_secret: process.env.RAZORPAY_KEY_SECRET // Use server variable Secret[span_24](start_span)[span_24](end_span)
    });

    const { amount } = JSON.parse(event.body); // Read chosen money value[span_25](start_span)[span_25](end_span)

    if (!amount || amount < 1) { // Validate incoming number input[span_26](start_span)[span_26](end_span)
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid amount" }) // Reject empty requests[span_27](start_span)[span_27](end_span)
      };
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert ₹ to paise accurately[span_28](start_span)[span_28](end_span)
      currency: "INR", // Track native currency[span_29](start_span)[span_29](end_span)
      receipt: `wallet_${Date.now()}` // Generate temporary instance token[span_30](start_span)[span_30](end_span)
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" }, // Attach proper headers[span_31](start_span)[span_31](end_span)
      body: JSON.stringify(order) // Supply structured payment token[span_32](start_span)[span_32](end_span)
    };

  } catch (err) {
    console.error("Razorpay Order Creation Error:", err); // Surface tracking logs[span_33](start_span)[span_33](end_span)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create Razorpay order" }) // Return error indicator[span_34](start_span)[span_34](end_span)
    };
  }
}
