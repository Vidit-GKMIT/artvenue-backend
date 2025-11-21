import { jest } from "@jest/globals";

// MOCK ENTIRE owner.service.js BEFORE importing controller
jest.unstable_mockModule("../../services/owner.service.js", () => ({
  findAllArtists: jest.fn(),
  createVenueInDB: jest.fn(),
  updateVenueInDB: jest.fn(),
  createEventInDB: jest.fn(),
  getAllOwnerEventsFromDB: jest.fn(),
  getAllVenuesForParticularOwnerFromDB: jest.fn()
}));

// Import controller AFTER mocks
const {
  getAllArtists,
  createVenue,
  updateVenue,
  createEvent,
  getAllOwnerEvents,
  getAllVenuesForParticularOwner
} = await import("../../controllers/owner.controller.js");

// Import mocked services
const {
  findAllArtists,
  createVenueInDB,
  updateVenueInDB,
  createEventInDB,
  getAllOwnerEventsFromDB,
  getAllVenuesForParticularOwnerFromDB
} = await import("../../services/owner.service.js");

// mock res
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Owner Controller Tests", () => {

  // ====================== GET ALL ARTISTS ======================
  test("getAllArtists → returns 200", async () => {
    findAllArtists.mockResolvedValue([{ id: 1, name: "Artist1" }]);

    const req = {};
    const res = mockRes();

    await getAllArtists(req, res);

    expect(findAllArtists).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ====================== CREATE VENUE ======================
  test("createVenue → success → returns 201", async () => {
    const req = {
      validatedData: { venueName: "My Venue" },
      user: { id: 5 }
    };
    const res = mockRes();

    createVenueInDB.mockResolvedValue({ id: 10, venueName: "My Venue" });

    await createVenue(req, res);

    expect(createVenueInDB).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("createVenue → conflict → returns 409", async () => {
    const req = {
      validatedData: { venueName: "Existing" },
      user: { id: 5 }
    };
    const res = mockRes();

    createVenueInDB.mockResolvedValue(null);

    await createVenue(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
  });

  // ====================== UPDATE VENUE ======================
  test("updateVenue → success → returns 200", async () => {
    const req = {
      validatedData: { venueName: "Updated Venue" },
      params: { venueId: "22" },
      user: { id: 5 }
    };
    const res = mockRes();

    updateVenueInDB.mockResolvedValue({ id: 22, venueName: "Updated Venue" });

    await updateVenue(req, res);

    expect(updateVenueInDB).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("updateVenue → unauthorized → returns 403", async () => {
    const req = {
      validatedData: {},
      params: { venueId: "22" },
      user: { id: 5 }
    };
    const res = mockRes();

    updateVenueInDB.mockResolvedValue(null);

    await updateVenue(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  // ====================== CREATE EVENT ======================
  test("createEvent → success → returns 201", async () => {
    const req = {
      validatedData: { eventName: "Party" },
      user: { id: 55 }
    };
    const res = mockRes();

    createEventInDB.mockResolvedValue({ id: 100, eventName: "Party" });

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("createEvent → venue not found → returns 404", async () => {
    const req = { validatedData: {}, user: { id: 55 } };
    const res = mockRes();

    createEventInDB.mockResolvedValue("Venue not found for the owner.");

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ====================== GET OWNER EVENTS ======================
  test("getAllOwnerEvents → success → returns 200", async () => {
    const req = { user: { id: 5 } };
    const res = mockRes();

    getAllOwnerEventsFromDB.mockResolvedValue([{ id: 1 }]);

    await getAllOwnerEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("getAllOwnerEvents → no events → returns 404", async () => {
    const req = { user: { id: 5 } };
    const res = mockRes();

    getAllOwnerEventsFromDB.mockResolvedValue(null);

    await getAllOwnerEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ====================== GET VENUE FOR OWNER ======================
  test("getAllVenuesForParticularOwner → success → returns 200", async () => {
    const req = { params: { ownerId: "5" } };
    const res = mockRes();

    getAllVenuesForParticularOwnerFromDB.mockResolvedValue({ id: 77 });

    await getAllVenuesForParticularOwner(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("getAllVenuesForParticularOwner → not found → returns 404", async () => {
    const req = { params: { ownerId: "5" } };
    const res = mockRes();

    getAllVenuesForParticularOwnerFromDB.mockResolvedValue(null);

    await getAllVenuesForParticularOwner(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

});
