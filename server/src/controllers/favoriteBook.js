const { Book, User, BookUser } = require("../../models");

exports.favBooks = async (req, res) => {
  try {
    const data = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: {
        model: Book,
        attributes: {
          exclude: [
            "description",
            "createdAt",
            "updatedAt",
            "publicationDate",
            "pages",
            "ISBN",
          ],
        },
        through: {
          attributes: [],
        },
      },
    });
    res.send({
      status: "success",
      data: {
        books: data.Books,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.addList = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await BookUser.findOne({
      where: {
        userId: req.user.id,
        bookId: id,
      },
    });

    if (book) {
      res.status(400).send({
        status: "Error",
        message: "You have added this book",
      });
    }

    await BookUser.create({
      userId: req.user.id,
      bookId: id,
    });

    res.send({
      statue: "Success",
    });
  } catch (err) {
    console.log("Your System ", err);
  }
};