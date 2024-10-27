const Donation = require('../models/Donation');

// Post a Donation
exports.createDonation = async (req, res) => {
  const { itemName, description, category, location } = req.body;

  // Validate input
  if (!itemName || !description || !category || !location) {
    return res.status(400).json({ msg: 'Please provide all required fields.' });
  }

  try {
    // Log the user object to debug issues with the token
    console.log('User object from request:', req.user);

    // Ensure the user object is valid
    if (!req.user || !req.user.id) {
      return res.status(403).json({ msg: 'User not authenticated. Please log in.' });
    }

    // Create a new donation
    const newDonation = new Donation({
      itemName,
      description,
      category,
      location,
      donor: req.user.id, // Ensure this comes from the authenticated user
      status: 'available', // Set default status
    });

    await newDonation.save();
    return res.status(201).json(newDonation); // Respond with the created donation and HTTP status 201
  } catch (error) {
    console.error('Error creating donation:', error);
    return res.status(500).json({ msg: 'Server error', error: error.message }); // Return error message
  }
};

// Get Donations by Region (ignoring location for now)
exports.getDonationsByRegion = async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'available' }); // Ignore location for now
    return res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
