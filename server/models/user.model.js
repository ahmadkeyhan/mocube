module.exports = mongoose => {
  const User = mongoose.model(
    "User",
    mongoose.Schema(
      {
        username: String,
        email: String,
        password: String,
        creativetype: String,
        roles: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
          }
        ]
      }
    )
  );

  return User;
};
