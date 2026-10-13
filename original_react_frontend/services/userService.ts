import { apiClient, simDb, delay } from './api';
import { User, Address } from '../types';

export const userService = {
  async getProfile(): Promise<User> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.get<User>('/users/profile');
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }
    await delay(100);
    const users = simDb.getUsers();
    return users.find((u) => u.email === 'user@stylecart.com') || users[1] || users[0];
  },

  async updateProfile(data: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    defaultAddress?: Address;
  }): Promise<User> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await apiClient.put<User>('/users/profile', data);
        return res.data;
      } catch (err) {
        console.warn('Backend call failed, using simulation:', err);
      }
    }

    await delay(150);
    const users = simDb.getUsers();
    const user = users.find((u) => u.email === 'user@stylecart.com') || users[1];
    if (user) {
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
      if (data.defaultAddress) user.defaultAddress = data.defaultAddress;
      simDb.saveUsers(users);
      return user;
    }
    throw new Error('User not found');
  },
};
