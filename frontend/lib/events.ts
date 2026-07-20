import Notification from '@/models/Notification';
import User from '@/models/User';
import Book from '@/models/Book';

/**
 * Event-driven Hook Handlers for Book status changes.
 * Centralizing this logic keeps our core bookService decoupled from notification database writes.
 */

export const BookEvents = {
  /**
   * Fired when an author submits a book for review.
   * Logs activity and can notify administrators in the future.
   */
  async emitBookSubmitted(bookId: string, authorId: string) {
    try {
      console.log(`[Event] Book ${bookId} submitted by author ${authorId}`);
      // Future: Add notification to admin list or system queue
    } catch (error) {
      console.error('Error in emitBookSubmitted hook:', error);
    }
  },

  /**
   * Fired when an admin picks up a book for review.
   */
  async emitBookUnderReview(bookId: string, adminId: string) {
    try {
      console.log(`[Event] Book ${bookId} is under review by admin ${adminId}`);
    } catch (error) {
      console.error('Error in emitBookUnderReview hook:', error);
    }
  },

  /**
   * Fired when an admin approves a book.
   * Automatically pushes a notification to the author's notification tray.
   */
  async emitBookApproved(bookId: string, adminId: string) {
    try {
      console.log(`[Event] Book ${bookId} approved by admin ${adminId}`);
      
      const book = await Book.findById(bookId).select('title author');
      if (!book) return;

      // Add to notifications queue (write to Notification document collection)
      await Notification.create({
        recipient: book.author,
        type: 'BOOK_APPROVED',
        title: 'Book Approved! 🎉',
        message: `Your novel "${book.title}" has been approved. You can now begin publishing chapters.`,
        isRead: false,
        actionUrl: `/dashboard/books/${book._id}/edit`,
        referenceModel: 'Book',
        referenceId: book._id,
      });
    } catch (error) {
      console.error('Error in emitBookApproved hook:', error);
    }
  },

  /**
   * Fired when an admin rejects a book.
   * Automatically pushes a notification containing the reviewNotes to the author.
   */
  async emitBookRejected(bookId: string, adminId: string, reviewNotes: string) {
    try {
      console.log(`[Event] Book ${bookId} rejected by admin ${adminId}`);

      const book = await Book.findById(bookId).select('title author');
      if (!book) return;

      // Add to notifications queue
      await Notification.create({
        recipient: book.author,
        type: 'BOOK_REJECTED',
        title: 'Review Action Required',
        message: `Your novel "${book.title}" was not approved. Reason: ${reviewNotes}`,
        isRead: false,
        actionUrl: `/dashboard/books/${book._id}/edit`,
        referenceModel: 'Book',
        referenceId: book._id,
      });
    } catch (error) {
      console.error('Error in emitBookRejected hook:', error);
    }
  }
};
