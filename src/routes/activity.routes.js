const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');

// Get all activity logs
router.get('/', activityController.getAllActivityLogs);

// Get activity log by ID
router.get('/:id', activityController.getActivityLogById);

// Get activity logs by order ID
router.get('/order/:orderId', activityController.getActivityLogsByOrder);

// Get activity logs by reader ID
router.get('/reader/:readerId', activityController.getActivityLogsByReader);

// Create a new activity log
router.post('/', activityController.createActivityLog);

// Update an activity log
router.put('/:id', activityController.updateActivityLog);

// Delete an activity log
router.delete('/:id', activityController.deleteActivityLog);

module.exports = router;
