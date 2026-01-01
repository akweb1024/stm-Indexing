// Real-time notification service using Socket.IO

export const emitNotification = (tenantId: string, notification: {
    type: 'success' | 'info' | 'warning' | 'error';
    title: string;
    message: string;
    data?: any;
}) => {
    const io = (global as any).io;
    if (io) {
        io.to(`tenant:${tenantId}`).emit('notification', {
            ...notification,
            timestamp: new Date().toISOString()
        });
        console.log(`📢 Notification sent to tenant ${tenantId}:`, notification.title);
    }
};

export const emitPaperVerified = (tenantId: string, paperId: string, status: string) => {
    emitNotification(tenantId, {
        type: status === 'INDEXED' ? 'success' : 'warning',
        title: 'Paper Verification Complete',
        message: `Paper verification status: ${status}`,
        data: { paperId, status }
    });
};

export const emitReviewerInvited = (tenantId: string, reviewerEmail: string, paperTitle: string) => {
    emitNotification(tenantId, {
        type: 'info',
        title: 'Reviewer Invited',
        message: `Invitation sent to ${reviewerEmail} for "${paperTitle}"`,
        data: { reviewerEmail, paperTitle }
    });
};

export const emitDatabaseApplicationUpdated = (tenantId: string, journalName: string, database: string, status: string) => {
    emitNotification(tenantId, {
        type: 'info',
        title: 'Database Application Updated',
        message: `${journalName} application to ${database}: ${status}`,
        data: { journalName, database, status }
    });
};
