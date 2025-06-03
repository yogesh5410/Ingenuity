import fetch from 'node-fetch'
import OTPVerification from '../models/otp.model.js'
import generatedOtp from '../utils/generatedOtp.js'
import sendEmail from '../config/sendEmail.js'
import otpEmailTemplate from '../utils/emailTemplate.js'

// Verify Codeforces handle
export async function verifyCodeforcesController(request, response) {
  try {
    const { cf_id } = request.body

    if (!cf_id) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "cf_id is required"
      })
    }

    const cfResponse = await fetch(`https://codeforces.com/api/user.info?handles=${cf_id}`)
    const cfData = await cfResponse.json()

    if (cfData.status === "OK" && cfData.result?.length > 0) {
      return response.status(200).json({
        success: true,
        error: false,
        message: "Codeforces handle verified"
      })
    } else {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Invalid Codeforces handle"
      })
    }
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error"
    })
  }
}

// Verify LeetCode username
export async function verifyLeetCodeController(request, response) {
  try {
    const { lc_id } = request.body

    if (!lc_id) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "lc_id is required"
      })
    }

    const lcResponse = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
            }
          }
        `,
        variables: { username: lc_id },
      }),
    })

    const lcData = await lcResponse.json()

    if (lcData.data?.matchedUser) {
      return response.status(200).json({
        success: true,
        error: false,
        message: "LeetCode handle verified"
      })
    } else {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Invalid LeetCode handle"
      })
    }
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error"
    })
  }
}

// Send OTP
export async function sendOTPController(request, response) {
  try {
    const { name, email } = request.body

    if (!email) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Email is required"
      })
    }

    const otp = generatedOtp()
    const otp_expire_time = new Date(Date.now() + 60 * 1000)

    await OTPVerification.deleteMany({ email })

    const newOTP = new OTPVerification({ email, otp, otp_expire_time })
    await newOTP.save()

    await sendEmail({
      sendTo: email,
      subject: "OTP Verification - Ingenuity Club",
      html: otpEmailTemplate({ name, email, otp }),
    })

    return response.status(200).json({
      success: true,
      error: false,
      message: "OTP sent successfully to your email"
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error"
    })
  }
}

// Verify OTP
export async function verifyOTPController(request, response) {
  try {
    const { email, otp } = request.body

    if (!email || !otp) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Email and OTP are required"
      })
    }

    const record = await OTPVerification.findOne({ email })

    if (!record) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "No OTP found for this email"
      })
    }

    if (record.otp !== otp) {
      return response.status(401).json({
        success: false,
        error: true,
        message: "Invalid OTP"
      })
    }

    if (new Date() > record.otp_expire_time) {
      return response.status(410).json({
        success: false,
        error: true,
        message: "OTP has expired"
      })
    }

    await OTPVerification.deleteMany({ email })

    return response.status(200).json({
      success: true,
      error: false,
      message: "OTP verified successfully"
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error"
    })
  }
}
