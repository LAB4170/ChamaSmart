const express = require("express");
const router = express.Router();
const {
  recordContribution,
  getChamaContributions,
  getContributionById,
  deleteContribution,
} = require("../controllers/contributionController");
const { protect, isTreasurer } = require("../middleware/auth");

// All routes are protected
router.post("/:chamaId/record", protect, isTreasurer, recordContribution);
router.get("/:chamaId", protect, getChamaContributions);
router.get("/:chamaId/:id", protect, getContributionById);
router.delete("/:chamaId/:id", protect, isTreasurer, deleteContribution);

module.exports = router;
