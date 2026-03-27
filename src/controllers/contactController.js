import Contact from '../models/Contact.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message, inquiryType } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return errorResponse(res, 'Please provide name, email, and message', 400);
    }

    // Create contact submission
    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'Contact Form Inquiry',
      message,
      inquiryType: inquiryType || 'general',
      source: 'website',
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    // Return success (without sensitive data)
    return successResponse(res, {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      createdAt: contact.createdAt
    }, 'Your message has been submitted successfully. We will get back to you soon.', 201);

  } catch (error) {
    console.error('Submit contact error:', error);
    return errorResponse(res, 'Server error during form submission', 500);
  }
};

// @desc    Get all contact submissions (admin)
// @route   GET /api/contact
// @access  Private
export const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, inquiryType, search, startDate, endDate } = req.query;

    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by inquiry type
    if (inquiryType) {
      query.inquiryType = inquiryType;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Search in name, email, subject
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return paginatedResponse(res, contacts, parseInt(page), parseInt(limit), total, 'Contacts retrieved successfully');

  } catch (error) {
    console.error('Get contacts error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Get single contact submission
// @route   GET /api/contact/:id
// @access  Private
export const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('respondedBy', 'name email')
      .populate('notes.addedBy', 'name email');

    if (!contact) {
      return errorResponse(res, 'Contact submission not found', 404);
    }

    // Mark as read if new
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    return successResponse(res, contact, 'Contact retrieved successfully');

  } catch (error) {
    console.error('Get contact error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id/status
// @access  Private
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'read', 'responded', 'closed'];

    if (!status || !validStatuses.includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return errorResponse(res, 'Contact submission not found', 404);
    }

    contact.status = status;

    if (status === 'responded') {
      contact.respondedBy = req.admin._id;
      contact.respondedAt = new Date();
    }

    await contact.save();

    return successResponse(res, contact, 'Status updated successfully');

  } catch (error) {
    console.error('Update status error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Add note to contact
// @route   POST /api/contact/:id/notes
// @access  Private
export const addNote = async (req, res) => {
  try {
    const { note } = req.body;

    if (!note || note.trim() === '') {
      return errorResponse(res, 'Note cannot be empty', 400);
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return errorResponse(res, 'Contact submission not found', 404);
    }

    contact.notes.push({
      note: note.trim(),
      addedBy: req.admin._id,
      addedAt: new Date()
    });

    await contact.save();

    return successResponse(res, contact.notes, 'Note added successfully', 201);

  } catch (error) {
    console.error('Add note error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Delete contact submission
// @route   DELETE /api/contact/:id
// @access  Private (super_admin)
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return errorResponse(res, 'Contact submission not found', 404);
    }

    return successResponse(res, null, 'Contact submission deleted successfully');

  } catch (error) {
    console.error('Delete contact error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Get contact statistics
// @route   GET /api/contact/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    const totalCounts = await Contact.countDocuments();
    const newCounts = await Contact.countDocuments({ status: 'new' });
    const readCounts = await Contact.countDocuments({ status: 'read' });
    const respondedCounts = await Contact.countDocuments({ status: 'responded' });
    const closedCounts = await Contact.countDocuments({ status: 'closed' });

    // Get counts by inquiry type
    const byType = await Contact.aggregate([
      {
        $group: {
          _id: '$inquiryType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent contacts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recent = await Contact.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    return successResponse(res, {
      total: totalCounts,
      byStatus: {
        new: newCounts,
        read: readCounts,
        responded: respondedCounts,
        closed: closedCounts
      },
      byType: byType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recent
    }, 'Statistics retrieved successfully');

  } catch (error) {
    console.error('Get stats error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Bulk update status
// @route   POST /api/contact/bulk-status
// @access  Private
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return errorResponse(res, 'Please provide an array of contact IDs', 400);
    }

    const validStatuses = ['new', 'read', 'responded', 'closed'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    const result = await Contact.updateMany(
      { _id: { $in: ids } },
      { status }
    );

    return successResponse(res, { modifiedCount: result.modifiedCount }, 'Status updated successfully');

  } catch (error) {
    console.error('Bulk update error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

export default {
  submitContact,
  getContacts,
  getContact,
  updateStatus,
  addNote,
  deleteContact,
  getStats,
  bulkUpdateStatus
};