import { User } from '../../models/User.model.js';
import { Job } from '../../models/Job.model.js';
import { Application } from '../../employer/models/application.model.js';
import { EmployerProfile } from '../../employer/models/profile.model.js';
import { CollegeProfile } from '../../college/models/profile.model.js';
import { createNotification } from '../../notifications/controllers/notification.controller.js';

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find(req.query).populate({
            path: 'postedBy',
            select: 'email',
            populate: {
                path: 'collegeProfile', 
                model: 'CollegeProfile',
                select: 'name',
                strictPopulate: false
            }
        });
        res.status(200).json(jobs);
    } catch (error) { 
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' }); 
    }
};

export const getAllUsersByRole = async (req, res) => {
// ... existing code ...
}

export const getFullCollegeDetails = async (req, res) => {
// ... existing code ...
};

export const getAllUsersForAdmin = async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Fetch all users
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users for admin:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
}; 

export const createJobByAdmin = async (req, res) => {
// ... existing code ...
} 