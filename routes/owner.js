const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const rateLimit = require('express-rate-limit');

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all routes
router.use(limiter);

// Dashboard
router.get('/dashboard', protect, authorize('owner'), async (req, res) => {
    try {
        // Get dashboard data
        const stats = {
            totalBookings: 0,
            revenue: 0,
            averageRating: 0,
            totalCustomers: 0,
            bookingChange: 0,
            revenueChange: 0,
            ratingChange: 0,
            customerChange: 0
        };

        const recentBookings = [];
        const recentReviews = [];
        const revenueData = {
            labels: [],
            data: []
        };

        res.render('owner/dashboard', {
            stats,
            recentBookings,
            recentReviews,
            revenueData
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading dashboard'
        });
    }
});

// Venue Management
router.get('/venues', protect, authorize('owner'), async (req, res) => {
    try {
        const venues = [];
        const totalPages = 1;
        const currentPage = 1;
        const hasPrevPage = false;
        const hasNextPage = false;

        res.render('owner/venues', {
            venues,
            totalPages,
            currentPage,
            hasPrevPage,
            hasNextPage
        });
    } catch (error) {
        console.error('Venues error:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading venues'
        });
    }
});

// Create venue
router.post('/venues', protect, authorize('owner'), upload.array('images', 10), async (req, res) => {
    try {
        // Handle venue creation
        const venueData = {
            ...req.body,
            owner: req.user._id,
            images: req.files ? req.files.map(file => `/uploads/venues/${file.filename}`) : []
        };

        // Create venue logic here

        res.status(201).json({
            success: true,
            message: 'Venue created successfully'
        });
    } catch (error) {
        console.error('Create venue error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating venue'
        });
    }
});

// Get venue form
router.get('/venues/new', protect, authorize('owner'), (req, res) => {
    res.render('owner/venue-form', { venue: null });
});

// Edit venue
router.get('/venues/:id/edit', protect, authorize('owner'), async (req, res) => {
    try {
        const venue = null; // Get venue by ID logic here
        res.render('owner/venue-form', { venue });
    } catch (error) {
        console.error('Edit venue error:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading venue'
        });
    }
});

// Update venue
router.put('/venues/:id', protect, authorize('owner'), upload.array('images', 10), async (req, res) => {
    try {
        // Handle venue update
        const venueData = {
            ...req.body,
            images: req.files ? req.files.map(file => `/uploads/venues/${file.filename}`) : []
        };

        // Update venue logic here

        res.json({
            success: true,
            message: 'Venue updated successfully'
        });
    } catch (error) {
        console.error('Update venue error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating venue'
        });
    }
});

// Delete venue
router.delete('/venues/:id', protect, authorize('owner'), async (req, res) => {
    try {
        // Delete venue logic here
        res.json({
            success: true,
            message: 'Venue deleted successfully'
        });
    } catch (error) {
        console.error('Delete venue error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting venue'
        });
    }
});

// Toggle venue status
router.put('/venues/:id/status', protect, authorize('owner'), async (req, res) => {
    try {
        const { status } = req.body;
        // Toggle venue status logic here
        res.json({
            success: true,
            message: 'Venue status updated successfully'
        });
    } catch (error) {
        console.error('Toggle status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating venue status'
        });
    }
});

// Booking Management
router.get('/bookings', protect, authorize('owner'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const bookings = await getOwnerBookings(req.user._id, page, limit);
        
        res.render('owner/bookings', {
            bookings: bookings.docs,
            currentPage: page,
            totalPages: bookings.totalPages,
            hasNextPage: bookings.hasNextPage,
            hasPrevPage: bookings.hasPrevPage
        });
    } catch (error) {
        console.error('Bookings Error:', error);
        res.status(500).render('error', { 
            message: 'Error loading bookings',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Analytics
router.get('/analytics', protect, authorize('owner'), async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const stats = await getOwnerStats(req.user._id, days);
        const venues = await getOwnerVenuesWithStats(req.user._id);
        
        res.render('owner/analytics', {
            stats,
            venues,
            days
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).render('error', { 
            message: 'Error loading analytics',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Reviews Management
router.get('/reviews', protect, authorize('owner'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const reviews = await getOwnerReviews(req.user._id, page, limit);
        
        res.render('owner/reviews', {
            reviews: reviews.docs,
            currentPage: page,
            totalPages: reviews.totalPages,
            hasNextPage: reviews.hasNextPage,
            hasPrevPage: reviews.hasPrevPage
        });
    } catch (error) {
        console.error('Reviews Error:', error);
        res.status(500).render('error', { 
            message: 'Error loading reviews',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Settings
router.get('/settings', protect, authorize('owner'), (req, res) => {
    res.render('owner/settings');
});

router.post('/settings', protect, authorize('owner'), async (req, res) => {
    try {
        await updateOwnerSettings(req.user._id, req.body);
        res.redirect('/owner/settings');
    } catch (error) {
        console.error('Settings Error:', error);
        res.status(500).render('error', { 
            message: 'Error updating settings',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Notifications
router.get('/notifications', protect, authorize('owner'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const notifications = await getOwnerNotifications(req.user._id, page, limit);
        
        res.render('owner/notifications', {
            notifications: notifications.docs,
            currentPage: page,
            totalPages: notifications.totalPages,
            hasNextPage: notifications.hasNextPage,
            hasPrevPage: notifications.hasPrevPage
        });
    } catch (error) {
        console.error('Notifications Error:', error);
        res.status(500).render('error', { 
            message: 'Error loading notifications',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// API Routes
router.get('/api/owner/revenue', protect, authorize('owner'), async (req, res) => {
    try {
        const revenue = await getRevenueData(req.user._id, req.query.period);
        res.json(revenue);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching revenue data' });
    }
});

router.get('/api/owner/analytics', protect, authorize('owner'), async (req, res) => {
    try {
        const analytics = await getAnalyticsData(req.user._id, req.query.days);
        res.json({ success: true, ...analytics });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching analytics data' });
    }
});

router.get('/api/owner/bookings/:id', protect, authorize('owner'), async (req, res) => {
    try {
        const booking = await getBookingDetails(req.params.id);
        res.json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching booking details' });
    }
});

router.put('/api/owner/bookings/:id/status', protect, authorize('owner'), async (req, res) => {
    try {
        await updateBookingStatus(req.params.id, req.body.status);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating booking status' });
    }
});

router.post('/api/owner/reviews/:id/respond', protect, authorize('owner'), async (req, res) => {
    try {
        await addReviewResponse(req.params.id, req.body.response);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding review response' });
    }
});

// Export Routes
router.get('/api/owner/bookings/export', protect, authorize('owner'), async (req, res) => {
    try {
        const format = req.query.format || 'csv';
        const data = await getBookingsForExport(req.user._id, req.query);
        res.attachment(`bookings.${format}`);
        res.send(data);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error exporting bookings' });
    }
});

router.get('/api/owner/analytics/export', protect, authorize('owner'), async (req, res) => {
    try {
        const data = await getAnalyticsForExport(req.user._id, req.query.days);
        res.attachment('analytics.pdf');
        res.send(data);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error exporting analytics' });
    }
});

module.exports = router; 