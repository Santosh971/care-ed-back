import Page from '../models/Page.js';

class PageService {
  // Get page by pageId
  async getPage(pageId) {
    return await Page.findOne({ pageId }).populate('metadata.updatedBy', 'name email');
  }

  // Get all pages
  async getAllPages() {
    return await Page.find({})
      .select('pageId title metadata.lastUpdated')
      .populate('metadata.updatedBy', 'name email')
      .sort({ pageId: 1 });
  }

  // Create page
  async createPage(pageData, adminId) {
    const page = await Page.create({
      ...pageData,
      metadata: {
        lastUpdated: new Date(),
        updatedBy: adminId
      }
    });
    return page;
  }

  // Update section
  async updateSection(pageId, sectionId, updateData, adminId) {
    const page = await Page.findOne({ pageId });

    if (!page) {
      return { success: false, error: 'Page not found' };
    }

    const sectionIndex = page.sections.findIndex(s => s.sectionId === sectionId);

    if (sectionIndex === -1) {
      // Add new section
      page.sections.push({
        sectionId,
        ...updateData
      });
    } else {
      // Update existing section
      page.sections[sectionIndex] = {
        ...page.sections[sectionIndex].toObject(),
        ...updateData
      };
    }

    page.metadata = {
      lastUpdated: new Date(),
      updatedBy: adminId
    };

    await page.save();

    return {
      success: true,
      section: page.sections.find(s => s.sectionId === sectionId)
    };
  }

  // Get section
  async getSection(pageId, sectionId) {
    const page = await Page.findOne({ pageId });

    if (!page) {
      return { success: false, error: 'Page not found' };
    }

    const section = page.sections.find(s => s.sectionId === sectionId);

    if (!section) {
      return { success: false, error: 'Section not found' };
    }

    return { success: true, section };
  }

  // Toggle section active status
  async toggleSection(pageId, sectionId, adminId) {
    const page = await Page.findOne({ pageId });

    if (!page) {
      return { success: false, error: 'Page not found' };
    }

    const section = page.sections.find(s => s.sectionId === sectionId);

    if (!section) {
      return { success: false, error: 'Section not found' };
    }

    section.isActive = !section.isActive;
    page.metadata = {
      lastUpdated: new Date(),
      updatedBy: adminId
    };

    await page.save();

    return { success: true, isActive: section.isActive };
  }

  // Delete page
  async deletePage(pageId) {
    const result = await Page.findOneAndDelete({ pageId });
    return { success: !!result };
  }

  // Get active sections for a page
  async getActiveSections(pageId) {
    const page = await Page.findOne({ pageId });

    if (!page) {
      return { success: false, error: 'Page not found' };
    }

    const activeSections = page.sections.filter(s => s.isActive);
    return { success: true, sections: activeSections };
  }

  // Bulk update sections
  async bulkUpdateSections(pageId, sections, adminId) {
    const page = await Page.findOne({ pageId });

    if (!page) {
      return { success: false, error: 'Page not found' };
    }

    sections.forEach(update => {
      const sectionIndex = page.sections.findIndex(s => s.sectionId === update.sectionId);
      if (sectionIndex !== -1) {
        page.sections[sectionIndex] = {
          ...page.sections[sectionIndex].toObject(),
          ...update.data
        };
      }
    });

    page.metadata = {
      lastUpdated: new Date(),
      updatedBy: adminId
    };

    await page.save();

    return { success: true, page };
  }

  // Get pages for sitemap/cache
  async getPageList() {
    const pages = await Page.find({}).select('pageId title');
    return pages.map(p => ({
      pageId: p.pageId,
      title: p.title
    }));
  }
}

export default new PageService();