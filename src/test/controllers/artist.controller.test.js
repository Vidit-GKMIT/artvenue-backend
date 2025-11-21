import { jest } from "@jest/globals";

jest.unstable_mockModule("../../services/artist.service.js", () => ({
  findAllVenuesFromDB: jest.fn(),
  findAllEventsFromDB: jest.fn(),
  sendEmail: jest.fn(),
  createOptInEntry: jest.fn()
}));

const {
  getAllVenues,
  getAllEvents,
  optInEvent
} = await import("../../controllers/artist.controller.js");

const {
  findAllVenuesFromDB,
  findAllEventsFromDB,
  sendEmail,
  createOptInEntry
} = await import("../../services/artist.service.js");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Artist Controller (with 2 intentionally failing tests)", () => {

  test("getAllVenues → returns 200 when venues exist (PASS)", async () => {
    findAllVenuesFromDB.mockResolvedValue([{ id: 1 }]);

    const req = {};
    const res = mockRes();

    await getAllVenues(req, res);

    expect(res.status).toHaveBeenCalledWith(200); // PASS
  });

  test("getAllVenues → intentional FAIL example", async () => {
    findAllVenuesFromDB.mockResolvedValue([{ id: 1 }]);

    const req = {};
    const res = mockRes();

    await getAllVenues(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("getAllEvents → returns 200 when events exist (PASS)", async () => {
    findAllEventsFromDB.mockResolvedValue([{ id: 10 }]);

    const req = {};
    const res = mockRes();

    await getAllEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(200); // PASS
  });

  test("getAllEvents → intentional FAIL example", async () => {
    findAllEventsFromDB.mockResolvedValue([{ id: 10 }]);

    const req = {};
    const res = mockRes();

    await getAllEvents(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Something wrong"  // wrong output
    });
  });

  test("optInEvent → returns 400 if eventId missing (PASS)", async () => {
    const req = { user: { id: 1 }, params: {} };
    const res = mockRes();

    await optInEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("optInEvent → returns 200 when opt-in succeeds (PASS)", async () => {
    const req = { user: { id: 5 }, params: { eventId: 99 } };
    const res = mockRes();

    createOptInEntry.mockReturnValue(true);
    sendEmail.mockResolvedValue(true);

    await optInEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

});
