const { ServerError } = require("../../errors");
const prisma = require("../../prisma");
const jwt = require("./jwt");
const bcrypt = require("bcrypt");
const router = require("express").Router();
module.exports = router;

/** Creates new account and returns token */
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if username and password provided
    if (!username || !password) {
      throw new ServerError(400, "Username and password required.");
    }

    // Check if account already exists
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (user) {
      throw new ServerError(
        400,
        `Account with username ${username} already exists.`
      );
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: { username, password },
    });

    const token = jwt.sign({ id: newUser.id });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

/** Returns token for account if credentials valid */
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if username and password provided
    if (!username || !password) {
      throw new ServerError(400, "Username and password required.");
    }

    // Check if account exists
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new ServerError(
        400,
        `Account with username ${username} does not exist.`
      );
    }

    // Check if password is correct
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new ServerError(401, "Invalid password.");
    }

    const token = jwt.sign({ id: user.id });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});


// THIS IS A BUG! WILL CONTINUOUSLY RUN AND CRASH THE SYSTEM
router.get("/:id", async (req, res, next) => {
  try {
    const id = +res.locals.user.id;

    const user = await prisma.user.findUnique({
      where: { id: id }
    })

    if (user) {
      return res.json(user)
    }

    res.status(401).send('Invalid login session or session expired.')

  } catch (err) {
    next(err);
  }
});
