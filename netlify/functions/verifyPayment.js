import crypto from "crypto";

export async function handler(event) {

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        success: false,
        message: "Method Not Allowed"
      })
    };
  }

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = JSON.parse(event.body);

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      // TODO:
      // Save payment to your database
      // Update user's wallet balance

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Payment verified successfully"
        })
      };

    }

    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: "Invalid payment signature"
      })
    };

  } catch (error) {

    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Server Error"
      })
    };

  }

}
