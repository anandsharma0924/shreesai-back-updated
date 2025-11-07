const { SellEnquiry } = require('../models');
const path = require('path');
const fs = require('fs');

// Reusable file cleanup function (used only for error cases)
const cleanupFiles = (files) => {
  const allFiles = [
    ...(files?.images || []),
    ...(files?.document ? [files.document] : []),
    ...(files?.verificationDocs || []),
  ];
  allFiles.forEach((file) => {
    const filePath = path.join(__dirname, '../uploads', file.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  });
};

exports.createEnquiry = async (req, res) => {
  try {
    const {
      propertyType,
      propertySubType,
      transactionType,
      propertyName,
      location,
      price,
      description,
      bedrooms,
      bathrooms,
      area,
      furnishingStatus,
      floorNumber,
      totalFloors,
      availabilityStatus,
      availableFrom,
      parkingAvailability,
      parkingType,
      facingDirection,
      ageOfProperty,
      amenities,
      nearbyFacilities,
      plotLength,
      plotWidth,
      plotUnit,
      roadWidth,
      roadUnit,
      ownershipType,
      registryAvailable,
      reraId,
      taxPaidUpto,
      waterSupply,
      electricityAvailable,
      sewageAvailable,
      roadConnectivity,
      suitableFor,
      nearbyLandmarks,
      sellerType,
      latitude,
      longitude,
      contactName,
      contactEmail,
      contactMobile,
    } = req.body;

    // Handle file uploads
    const imageFiles = req.files?.images || [];
    const documentFile = req.files?.document?.[0];
    const verificationFiles = req.files?.verificationDocs || [];
    const imageUrls = imageFiles.map((file) => `/uploads/${file.filename}`);
    const documentUrl = documentFile ? `/uploads/${documentFile.filename}` : null;
    const verificationUrls = verificationFiles.map((file) => `/uploads/${file.filename}`);

    // Parse JSON fields safely
    let parsedAmenities = [];
    let parsedNearbyLandmarks = [];
    try {
      if (amenities) parsedAmenities = JSON.parse(amenities);
      if (nearbyLandmarks) parsedNearbyLandmarks = JSON.parse(nearbyLandmarks);
    } catch (error) {
      cleanupFiles(req.files);
      return res.status(400).json({
        success: false,
        message: 'Invalid format for amenities or nearby landmarks. Please provide valid JSON.',
      });
    }

    // Parse boolean fields
    const parsedRegistryAvailable = registryAvailable === 'true' || registryAvailable === true;
    const parsedElectricityAvailable = electricityAvailable === 'true' || electricityAvailable === true;

    const enquiryData = {
      propertyType: propertyType?.trim(),
      propertySubType: propertySubType?.trim(),
      transactionType: transactionType?.trim(),
      propertyName: propertyName?.trim(),
      location: location?.trim(),
      price: price ? parseFloat(price) : null,
      description: description?.trim(),
      area: area ? parseFloat(area) : null,
      availabilityStatus: availabilityStatus?.trim(),
      contactName: contactName?.trim(),
      contactEmail: contactEmail?.trim(),
      contactMobile: contactMobile?.trim(),
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      furnishingStatus: furnishingStatus?.trim() || null,
      floorNumber: floorNumber ? parseInt(floorNumber) : null,
      totalFloors: totalFloors ? parseInt(totalFloors) : null,
      availableFrom: availableFrom || null,
      parkingAvailability: parkingAvailability?.trim() || null,
      parkingType: parkingType?.trim() || null,
      facingDirection: facingDirection?.trim() || null,
      ageOfProperty: ageOfProperty?.trim() || null,
      amenities: Array.isArray(parsedAmenities) ? parsedAmenities : [],
      nearbyFacilities: nearbyFacilities?.trim() || null,
      plotLength: plotLength ? parseFloat(plotLength) : null,
      plotWidth: plotWidth ? parseFloat(plotWidth) : null,
      plotUnit: plotUnit?.trim() || null,
      roadWidth: roadWidth ? parseFloat(roadWidth) : null,
      roadUnit: roadUnit?.trim() || null,
      ownershipType: ownershipType?.trim() || null,
      registryAvailable: parsedRegistryAvailable,
      reraId: reraId?.trim() || null,
      taxPaidUpto: taxPaidUpto?.trim() || null,
      waterSupply: waterSupply?.trim() || null,
      electricityAvailable: parsedElectricityAvailable,
      sewageAvailable: sewageAvailable?.trim() || null,
      roadConnectivity: roadConnectivity?.trim() || null,
      suitableFor: suitableFor?.trim() || null,
      nearbyLandmarks: Array.isArray(parsedNearbyLandmarks) ? parsedNearbyLandmarks : [],
      sellerType: sellerType?.trim() || null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      propertyImages: imageUrls,
      document: documentUrl,
      verificationDocs: verificationUrls,
    };

    const enquiry = await SellEnquiry.create(enquiryData);

    res.status(201).json({
      success: true,
      message: 'Property enquiry created successfully',
      data: enquiry,
    });
  } catch (error) {
    cleanupFiles(req.files);
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Please fix the following errors:',
        errors: validationErrors,
      });
    }
    console.error('Create Enquiry Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create enquiry. Please try again.',
      error: error.message,
    });
  }
};

exports.getAllEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const enquiries = await SellEnquiry.findAll({
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    res.status(200).json({
      success: true,
      message: 'Enquiries fetched successfully',
      data: enquiries,
    });
  } catch (error) {
    console.error('Get All Enquiries Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries. Please try again.',
      error: error.message,
    });
  }
};

exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await SellEnquiry.findByPk(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Enquiry fetched successfully',
      data: enquiry,
    });
  } catch (error) {
    console.error('Get Enquiry By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiry. Please try again.',
      error: error.message,
    });
  }
};

exports.updateEnquiry = async (req, res) => {
  try {
    const enquiry = await SellEnquiry.findByPk(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    const {
      propertyType,
      propertySubType,
      transactionType,
      propertyName,
      location,
      price,
      description,
      bedrooms,
      bathrooms,
      area,
      furnishingStatus,
      floorNumber,
      totalFloors,
      availabilityStatus,
      availableFrom,
      parkingAvailability,
      parkingType,
      facingDirection,
      ageOfProperty,
      amenities,
      nearbyFacilities,
      plotLength,
      plotWidth,
      plotUnit,
      roadWidth,
      roadUnit,
      ownershipType,
      registryAvailable,
      reraId,
      taxPaidUpto,
      waterSupply,
      electricityAvailable,
      sewageAvailable,
      roadConnectivity,
      suitableFor,
      nearbyLandmarks,
      sellerType,
      latitude,
      longitude,
      contactName,
      contactEmail,
      contactMobile,
    } = req.body;

    // Handle file uploads
    const imageFiles = req.files?.images || [];
    const documentFile = req.files?.document?.[0];
    const verificationFiles = req.files?.verificationDocs || [];

    // Append new files to existing ones instead of replacing
    const imageUrls = imageFiles.length
      ? [...(enquiry.propertyImages || []), ...imageFiles.map((file) => `/uploads/${file.filename}`)]
      : undefined;
    const documentUrl = documentFile ? `/uploads/${documentFile.filename}` : undefined;
    const verificationUrls = verificationFiles.length
      ? [...(enquiry.verificationDocs || []), ...verificationFiles.map((file) => `/uploads/${file.filename}`)]
      : undefined;

    // Parse JSON fields safely
    let parsedAmenities = undefined;
    let parsedNearbyLandmarks = undefined;
    try {
      if (amenities) parsedAmenities = JSON.parse(amenities);
      if (nearbyLandmarks) parsedNearbyLandmarks = JSON.parse(nearbyLandmarks);
    } catch (error) {
      cleanupFiles(req.files);
      return res.status(400).json({
        success: false,
        message: 'Invalid format for amenities or nearby landmarks. Please provide valid JSON.',
      });
    }

    // Parse boolean fields
    const parsedRegistryAvailable = registryAvailable === 'true' || registryAvailable === true;
    const parsedElectricityAvailable = electricityAvailable === 'true' || electricityAvailable === true;

    // Prepare update data
    const updateData = Object.fromEntries(
      Object.entries({
        propertyType: propertyType?.trim(),
        propertySubType: propertySubType?.trim(),
        transactionType: transactionType?.trim(),
        propertyName: propertyName?.trim(),
        location: location?.trim(),
        price: price ? parseFloat(price) : undefined,
        description: description?.trim(),
        area: area ? parseFloat(area) : undefined,
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
        furnishingStatus: furnishingStatus?.trim(),
        floorNumber: floorNumber ? parseInt(floorNumber) : undefined,
        totalFloors: totalFloors ? parseInt(totalFloors) : undefined,
        availabilityStatus: availabilityStatus?.trim(),
        availableFrom,
        parkingAvailability: parkingAvailability?.trim(),
        parkingType: parkingType?.trim(),
        facingDirection: facingDirection?.trim(),
        ageOfProperty: ageOfProperty?.trim(),
        amenities: parsedAmenities,
        nearbyFacilities: nearbyFacilities?.trim(),
        plotLength: plotLength ? parseFloat(plotLength) : undefined,
        plotWidth: plotWidth ? parseFloat(plotWidth) : undefined,
        plotUnit: plotUnit?.trim(),
        roadWidth: roadWidth ? parseFloat(roadWidth) : undefined,
        roadUnit: roadUnit?.trim(),
        ownershipType: ownershipType?.trim(),
        registryAvailable: parsedRegistryAvailable,
        reraId: reraId?.trim(),
        taxPaidUpto: taxPaidUpto?.trim(),
        waterSupply: waterSupply?.trim(),
        electricityAvailable: parsedElectricityAvailable,
        sewageAvailable: sewageAvailable?.trim(),
        roadConnectivity: roadConnectivity?.trim(),
        suitableFor: suitableFor?.trim(),
        nearbyLandmarks: parsedNearbyLandmarks,
        sellerType: sellerType?.trim(),
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        contactName: contactName?.trim(),
        contactEmail: contactEmail?.trim(),
        contactMobile: contactMobile?.trim(),
        propertyImages: imageUrls,
        document: documentUrl !== undefined ? documentUrl : enquiry.document,
        verificationDocs: verificationUrls,
      }).filter(([_, value]) => value !== undefined)
    );

    const [updated] = await SellEnquiry.update(updateData, { where: { id: req.params.id } });

    if (updated === 0) {
      cleanupFiles(req.files); // Cleanup new files if no update occurred
      return res.status(400).json({
        success: false,
        message: 'No changes made to the enquiry',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully',
    });
  } catch (error) {
    cleanupFiles(req.files);
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Please fix the following errors:',
        errors: validationErrors,
      });
    }
    console.error('Update Enquiry Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update enquiry. Please try again.',
      error: error.message,
    });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await SellEnquiry.findByPk(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    // Cleanup files
    if (enquiry.propertyImages?.length) {
      enquiry.propertyImages.forEach((img) => {
        const filePath = path.join(__dirname, '../uploads', img.replace('/uploads/', ''));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
    if (enquiry.document) {
      const filePath = path.join(__dirname, '../Uploads', enquiry.document.replace('/uploads/', ''));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    if (enquiry.verificationDocs?.length) {
      enquiry.verificationDocs.forEach((doc) => {
        const filePath = path.join(__dirname, '../Uploads', doc.replace('/uploads/', ''));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    await SellEnquiry.destroy({ where: { id: req.params.id } });
    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully',
    });
  } catch (error) {
    console.error('Delete Enquiry Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete enquiry. Please try again.',
      error: error.message,
    });
  }
};