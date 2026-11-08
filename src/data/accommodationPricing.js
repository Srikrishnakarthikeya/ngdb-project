export const ACCOMMODATION_RATE_PER_DAY = 200;

export const getAccommodationDays = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 0;

  const checkIn = Date.parse(`${checkInDate}T00:00:00Z`);
  const checkOut = Date.parse(`${checkOutDate}T00:00:00Z`);
  if (!Number.isFinite(checkIn) || !Number.isFinite(checkOut) || checkOut <= checkIn) return 0;

  return Math.round((checkOut - checkIn) / 86400000);
};

export const getAccommodationFee = (checkInDate, checkOutDate) =>
  getAccommodationDays(checkInDate, checkOutDate) * ACCOMMODATION_RATE_PER_DAY;