module.exports = mongoose => {
  const Type = mongoose.model(
    "type",
    mongoose.Schema(
      {
        title: String,
        subtitle: String,
        avatar: String,
        color: String,
        link: String
      }
    )
  );

  return Type;
};
