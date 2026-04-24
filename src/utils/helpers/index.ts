import * as fs from 'fs';
import * as path from 'path';

export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const getExpirationTime = () => {
  return new Date(Date.now() + 5 * 60 * 1000); // Current time + 5 minutes
};

export const deleteOldFile = (folder: string, file?: string): void => {
  try {
    if (!file) return;

    const filePath = path.join(__dirname, '..', 'public', folder, file);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Deleted:', filePath);
    } else {
      console.log('No file:', filePath);
    }
  } catch (error) {
    console.log('Error while deleting file --------->', error);
  }
};

export const calculateDistance = (
  lat1: any,
  lon1: any,
  lat2: any,
  lon2: any,
) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
export const getDistanceFee = (distance: number) => {
  if (distance <= 8) return 0;
  if (distance <= 15) return 3;
  if (distance <= 25) return 5;
  if (distance <= 40) return 10;
  return 15;
};
