const monthIndexes = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11
};

const parseDriveDate = (value) => {
  if (typeof value !== 'string') return null;

  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (isoDate) {
    const [, year, month, day] = isoDate;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.getFullYear() === Number(year) &&
      date.getMonth() === Number(month) - 1 &&
      date.getDate() === Number(day)
      ? date
      : null;
  }

  const legacyDate = /^(\d{1,2})\s+([A-Za-z]{3})[A-Za-z]*\s+(\d{4})$/.exec(value.trim());
  if (!legacyDate) return null;

  const [, day, month, year] = legacyDate;
  const monthIndex = monthIndexes[month.toLowerCase()];
  if (monthIndex === undefined) return null;

  const date = new Date(Number(year), monthIndex, Number(day));
  return date.getFullYear() === Number(year) &&
    date.getMonth() === monthIndex &&
    date.getDate() === Number(day)
    ? date
    : null;
};

export const formatDriveDate = (value) => {
  const date = parseDriveDate(value);
  return date
    ? date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : value || 'Not set';
};

export const driveDateToInputValue = (value) => {
  const date = parseDriveDate(value);
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDriveStatus = (drive) => {
  if (String(drive.status || '').toLowerCase() === 'completed') {
    return { label: 'Completed', bg: '#e2e8f0', color: '#475569' };
  }

  const deadline = driveDateToInputValue(drive.deadline_date);
  if (deadline && deadline < getLocalDateString()) {
    return { label: 'Completed', bg: '#e2e8f0', color: '#475569' };
  }

  return { label: 'Ongoing', bg: '#dcfce7', color: '#166534' };
};

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
