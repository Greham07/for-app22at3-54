const Donation = require('../models/Donation');

// Post a Donation
exports.createDonation = async (req, res) => {
  const { itemName, description, category, location } = req.body;

  // Validate input
  if (!itemName || !description || !category || !location) {
    return res.status(400).json({ msg: 'Please provide all required fields.' });
  }

  try {
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


// without location


exports.getDonationsByRegion = async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'available' }); // Ignore location for now
    return res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

/*

// Get Donations by Region
exports.getDonationsByRegion = async (req, res) => {
  const location = req.query.location;

  console.log('Received location:', location); // Log the received location

  // Optional: Validate location parameter
  if (!location) {
    console.log('Location is not defined.'); // Log if location is not provided
    return res.status(400).json({ msg: 'Location query parameter is required.' });
  }

  try {
    const donations = await Donation.find({ location, status: 'available' });
    console.log('Donations found:', donations); // Log the found donations
    return res.json(donations);
  } catch (error) {
    console.error('Error fetching donations by region:', error); // Log the error
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
*/