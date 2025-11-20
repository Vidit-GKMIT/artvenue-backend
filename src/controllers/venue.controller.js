import { getAllVenuesFromDB } from '../services/venue.sevice.js'

export const getAllVenues = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const allVenues = await getAllVenuesFromDB(userId, role);
        return res.status(200).json({
            message: 'All venues fetched successfully',
            data: allVenues,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: error.message
        });
    }
}