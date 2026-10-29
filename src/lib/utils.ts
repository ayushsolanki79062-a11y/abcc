export function formatDate(dateString?: string | null): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

export function formatDateForInput(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

export function getDueStatus(dueDateString?: string | null, status?: string): {
  isOverdue: boolean;
  isUpcoming: boolean;
  label: string;
  daysDiff: number;
} {
  if (!dueDateString || status !== 'Issued') {
    return { isOverdue: false, isUpcoming: false, label: '', daysDiff: 0 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDateString);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      isOverdue: true,
      isUpcoming: false,
      label: `Overdue by ${overdueDays} day${overdueDays === 1 ? '' : 's'}`,
      daysDiff: diffDays,
    };
  } else if (diffDays === 0) {
    return {
      isOverdue: false,
      isUpcoming: true,
      label: 'Due today',
      daysDiff: 0,
    };
  } else if (diffDays <= 5) {
    return {
      isOverdue: false,
      isUpcoming: true,
      label: `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`,
      daysDiff: diffDays,
    };
  }

  return {
    isOverdue: false,
    isUpcoming: false,
    label: `Due on ${formatDate(dueDateString)}`,
    daysDiff: diffDays,
  };
}

