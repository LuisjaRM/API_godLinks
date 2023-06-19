// Function require ↓

const { getConnection } = require("../connectionDB");
// const { generateError } = require("../../services/generateError");

// Query ↓

const getFavoritesOffersQuery = async (user_id) => {
  let connection;
  try {
    connection = await getConnection();

    const [favoriteOffers] = await connection.query(
      `
        SELECT offer_id
        FROM favorites
        WHERE user_id = ? AND favorite = 1;
`,
      [user_id]
    );

    // if (favoriteOffers < 1) {
    //   throw generateError("No existen ofertas añadidas a favoritos", 404);
    // }

    let offersWithVotes = [];
    let offersWithoutVotes = [];

    for (let i = 0; i < favoriteOffers.length; i++) {
      let offer_id = favoriteOffers[i].offer_id;

      const [offersWithVotesQuery] = await connection.query(
        `
           SELECT o.*, u.user, u.avatar, f.favorite, AVG(v.vote) AS avgVotes
           FROM offers o
           INNER JOIN votes v ON v.offer_id = o.id
           INNER JOIN users u ON o.user_id  = u.id
           INNER JOIN favorites f ON f.offer_id = o.id
           WHERE o.id = ?
           GROUP BY o.id;
         `,
        [offer_id]
      );

      const [offersWithoutVotesQuery] = await connection.query(
        `
           SELECT o.*, u.user, u.avatar, f.favorite
           FROM offers o
           INNER JOIN users u ON o.user_id = u.id
           INNER JOIN favorites f ON f.offer_id = o.id
           WHERE o.id = ?;
     `,
        [offer_id]
      );

      offersWithVotesQuery.map((offer) => offersWithVotes.push(offer));
      offersWithoutVotesQuery.map((offer) => offersWithoutVotes.push(offer));
    }

    // Save the offers with and without votes in the array offers

    const offers = [];

    offersWithVotes.map((offer) => offers.push(offer));
    offersWithoutVotes.map((offer) => offers.push(offer));

    offers
      .sort((a, b) => {
        return b.created_at - a.created_at;
      })
      .map((offer) => {
        return offer;
      });

    // Return offers
    return { offers };
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getFavoritesOffersQuery };
