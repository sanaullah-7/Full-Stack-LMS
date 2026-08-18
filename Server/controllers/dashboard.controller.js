import { getDashboardStatsService } from "../services/dashboard.Service.js";

export const getDashboardStatsController = async (req, res) => {
  try {
    const { date } = req.query;
    const stats = await getDashboardStatsService(date);

    res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard stats"
    });
  }
};
