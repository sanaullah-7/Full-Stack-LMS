import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Student Profile & Settings Service
 */
export const profileService = {
  /**
   * Retrieves profile information
   */
  getProfile: async () => {
    return await axiosClient.get(ENDPOINTS.PROFILE.GET_PROFILE);
  },

  /**
   * Updates student contact/social profile info
   * @param {Object} data
   */
  updateProfile: async (data) => {
    return await axiosClient.put(ENDPOINTS.PROFILE.UPDATE_PROFILE, data);
  },
};
