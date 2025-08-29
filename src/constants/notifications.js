export default [
  { title: 'New task', isChecked: true, id: 1, },
  { title: 'Task expired', isChecked: true, id: 2, },
  { title: 'Task done', isChecked: false, id: 3, },
  { title: 'Deadline Coming Soon', isChecked: false, id: 4, },

]

export const notificationsList = (t) => (
  {
    action_almost_expired: t('Action deadline almost reached(10 hours remaining)'),
    action_completed: t('Action completed'),
    action_created: t('Action created'),
    action_deleted: t('Action deleted'),
    action_expired: t('Action deadline has passed'),
    action_canceled: t('Action was canceled'),
    action_review_requested: t('Action was requested'),
    action_rejected: t('Action was rejected'),
    action_approved: t('Action was approved'),
    action_updated: t('Action updated')
  }
)
