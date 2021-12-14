// exports.seed = function (knex) {
//   // Deletes ALL existing entries
//   return knex("users")
//     .del()
//     .then(function () {
//       // Inserts seed entries
//       return knex("users").insert([
//         { username: "jason", password: "123" },
//         { username: "fanki", password: "123" },
//         { username: "kaho", password: "123" },
//       ]);
//     });
// };

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("notes")
    .del()
    .then(() => {
      return knex("users")
        .del()
        .then(function () {
          // Inserts seed entries
          return knex("users")
            .insert([
              { username: "jason", password: "123" },
              { username: "fanki", password: "123" },
              { username: "kaho", password: "123" },
            ])
            .then(() => {
              return knex("notes").insert([
                { username_id: 1, note: "I am Jason!" },
                { username_id: 2, note: "I am Fanki!" },
                { username_id: 3, note: "I am Kaho!" },
              ]);
            });
        });
    });
};
