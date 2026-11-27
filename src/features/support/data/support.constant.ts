// #/features/support/data/support.constant.ts

/** Lifecycle states a support ticket can be in. */
export const supportStatusOptions = [
    { label: 'Open', value: 'open' },
    { label: 'Pending', value: 'pending' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Closed', value: 'closed' },
]

/** Urgency levels a support ticket can be raised with. */
export const supportPriorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Normal', value: 'normal' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
]
