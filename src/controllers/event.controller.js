import { getAllEventsFromDB } from '../services/event.service.js'

export const getAllEvents = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        const allEventss = await getAllEventsFromDB(userId, role);
        console.log(allEventss)

        return res.status(200).json({
            message: 'All events fetched successfully',
            data: allEventss,
            success: true
        })  
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: error.message
        })
    }
}