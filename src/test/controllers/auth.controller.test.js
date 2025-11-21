// import { jest } from "@jest/globals";

// // MOCK SERVICES (ESM compatible)
// jest.unstable_mockModule("../../services/sendOtp.service.js", () => ({
//   sendOTPTorecipient: jest.fn()
// }));

// jest.unstable_mockModule("../../services/auth.service.js", () => ({
//   loginUser: jest.fn()
// }));

// // IMPORT CONTROLLERS AFTER MOCKING
// const {
//   ownerRegister,
//   artistRegister,
//   login,
//   logout
// } = await import("../../controllers/auth.controller.js");

// // IMPORT SERVICES AFTER MOCKING
// const { sendOTPTorecipient } = await import("../../services/sendOTP.service.js");
// const { loginUser } = await import("../../services/auth.service.js");

// // mock res
// const mockRes = () => {
//   const res = {};
//   res.status = jest.fn().mockReturnValue(res);
//   res.json = jest.fn().mockReturnValue(res);
//   return res;
// };

// describe("Auth Controller Tests", () => {

//   // -------- OWNER REGISTER ----------
//   test("ownerRegister → returns 200 when OTP is sent", async () => {
//     const req = { validatedData: { email: "test@gmail.com" } };
//     const res = mockRes();

//     sendOTPTorecipient.mockReturnValue(true);

//     await ownerRegister(req, res);

//     expect(sendOTPTorecipient).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       success: true,
//       message: "OTP sent to email successfully"
//     });
//   });

//   // -------- ARTIST REGISTER ----------
//   test("artistRegister → returns 200 when OTP is sent", async () => {
//     const req = { validatedData: { email: "artist@a.com" } };
//     const res = mockRes();

//     sendOTPTorecipient.mockReturnValue(true);

//     await artistRegister(req, res);

//     expect(sendOTPTorecipient).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       success: true,
//       message: "OTP sent to email successfully"
//     });
//   });

//   // ---------- LOGIN SUCCESS ----------
//   test("login → returns 200 when login successful", async () => {
//     const req = { validatedData: { email: "a@test.com", password: "123" } };
//     const res = mockRes();

//     loginUser.mockResolvedValue({
//       token: "abc123",
//       user: { id: 1, name: "user" }
//     });

//     await login(req, res);

//     expect(loginUser).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       success: true,
//       message: "Login successful",
//       token: "abc123",
//       data: { id: 1, name: "user" }
//     });
//   });

//   // ---------- LOGIN FAILED ----------
//   test("login → returns 401 for invalid credentials", async () => {
//     const req = { validatedData: { email: "wrong", password: "wrong" } };
//     const res = mockRes();

//     loginUser.mockResolvedValue(null);

//     await login(req, res);

//     expect(res.status).toHaveBeenCalledWith(401);
//     expect(res.json).toHaveBeenCalledWith({
//       success: false,
//       message: "Invalid username or password"
//     });
//   });

//   // --------- LOGOUT ----------
//   test("logout → returns 200", () => {
//     const req = {};
//     const res = mockRes();

//     logout(req, res);

//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       message: "Logged Out successfully",
//       success: true
//     });
//   });

// });


import { jest } from "@jest/globals";

// 💥 MOCK THE ENTIRE SERVICE MODULES BEFORE IMPORTING THE CONTROLLER
jest.unstable_mockModule("../../services/sendOTP.service.js", () => ({
  sendOTPTorecipient: jest.fn()
}));

jest.unstable_mockModule("../../services/auth.service.js", () => ({
  loginUser: jest.fn()
}));

// ⭐ IMPORT CONTROLLERS AFTER MOCKING
const {
  ownerRegister,
  artistRegister,
  login,
  logout
} = await import("../../controllers/auth.controller.js");

// ⭐ IMPORT MOCKED SERVICES
const { sendOTPTorecipient } = await import("../../services/sendOTP.service.js");
const { loginUser } = await import("../../services/auth.service.js");

// Utility: Mock Express response object
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Controller Unit Tests", () => {

  // ===================== OWNER REGISTER =====================
  test("ownerRegister → should return 200 when OTP is sent", async () => {
    const req = { validatedData: { email: "owner@mail.com" } };
    const res = mockRes();

    sendOTPTorecipient.mockReturnValue(true);

    await ownerRegister(req, res);

    expect(sendOTPTorecipient).toHaveBeenCalledWith(
      { email: "owner@mail.com" },
      5
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "OTP sent to email successfully"
    });
  });

  // ===================== ARTIST REGISTER =====================
  test("artistRegister → should return 200 when OTP is sent", async () => {
    const req = { validatedData: { email: "artist@mail.com" } };
    const res = mockRes();

    sendOTPTorecipient.mockReturnValue(true);

    await artistRegister(req, res);

    expect(sendOTPTorecipient).toHaveBeenCalledWith(
      { email: "artist@mail.com" },
      5
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ========================= LOGIN ===========================
  test("login → should return 200 on successful login", async () => {
    const req = {
      validatedData: { email: "user@mail.com", password: "12345" }
    };
    const res = mockRes();

    loginUser.mockResolvedValue({
      token: "abc123",
      user: { id: 1, name: "User" }
    });

    await login(req, res);

    expect(loginUser).toHaveBeenCalledWith({
      email: "user@mail.com",
      password: "12345"
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Login successful",
      token: "abc123",
      data: { id: 1, name: "User" }
    });
  });

  test("login → should return 401 when credentials are invalid", async () => {
    const req = { validatedData: { email: "wrong", password: "wrong" } };
    const res = mockRes();

    loginUser.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid username or password"
    });
  });

  // ======================== LOGOUT ===========================
  test("logout → should return 200", () => {
    const req = {};
    const res = mockRes();

    logout(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Logged Out successfully",
      success: true
    });
  });
});
