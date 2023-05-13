const { newOffer } = require("./newOffer");
const { allOffers } = require("./allOffers");
const { offerById } = require("./offerById");
const { modifyOffer } = require("./modifyOffer");
const { deleteOffer } = require("./deleteOffer");
const { postVoteOffer } = require("./postVoteOffer");
const { commentOffer } = require("./commentOffer");
const { offersByVotes } = require("./offersByVotes");
const { commentsById } = require("./commentsById");
const { modifyComment } = require("./modifyComment");
const { likeCommentOffer } = require("./postLikeComment");
const { dailyOffers } = require("./dailyOffers");

module.exports = {
  newOffer,
  allOffers,
  offerById,
  modifyOffer,
  deleteOffer,
  postVoteOffer,
  offersByVotes,
  commentOffer,
  commentsById,
  modifyComment,
  likeCommentOffer,
  dailyOffers,
};
