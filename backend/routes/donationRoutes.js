const express = require('express');
const { createDonation, getDonationsByRegion } = require('../controllers/donationController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const Donation = require('../models/Donation');

// Route to create a new donation
router.post('/donate', authMiddleware, createDonation);

// Get all donations with donor details
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().populate('donor', 'name'); // Populate 'donor' field with 'name'
    res.json(donations);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get donation by ID with donor details
router.get('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('donor', 'name');
    if (!donation) return res.status(404).json({ msg: 'Donation not found' });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
