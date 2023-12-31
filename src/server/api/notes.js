const { ServerError } = require("../errors");
const prisma = require("../prisma");

const router = require("express").Router();
module.exports = router;

/** User must be logged in to access notes. */
router.use((req, res, next) => {
  if (!res.locals.user) {
    return next(new ServerError(401, "You must be logged in."));
  }
  next();
});

/** Sends all notes */
router.get("/", async (req, res, next) => {
  try {
      // validates user is logged in
      // finds many notes
    const notes = await prisma.note.findMany({
      where: { userId : res.locals.user.id },
    });
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

/** Creates new note and sends it */
router.post("/create", async (req, res, next) => {
  try {
    const content = req.body;
    if (!content) {
      throw new ServerError(400, "Note required.");
    }

    const name = content.name;
    const note = content.note;
    const favoritePlant = +content.favoritePlant;

    const newNote = await prisma.note.create({
      data: {
        note,
        name,
        user: { connect: { id: res.locals.user.id } },
        favoritePlant: { connect: { id : favoritePlant }}
      },
    });
    res.json(newNote);
  } catch (err) {
    next(err);
  }
});

// validates if notes exist and assigned to user
const validateNotes = ( user, note ) => {
  if (!note) {
      throw new ServerError(404, "Notes not found.");
  } 
  
  if (note.userId !== user.id) {
      throw new ServerError(403, "No notes for this user.")
  }
};

/** Sends single note by id */
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const note = await prisma.note.findUnique({ where: { id : id } });
    validateNotes(res.locals.user, note);

    res.json(note);
  } catch (err) {
    next(err);
  }
});

/** Updates single note by id */
router.put("/:id", async (req, res, next) => {
  try {
    //identify params
    const id = +req.params.id;
    const noteContent = req.body;
    console.log(noteContent);

    //error handling if it does not exist
      if (!noteContent) {
        return next({
            status: 404, 
            message: `Note required to update.`,
        });
    }

    const content = noteContent;
    const note = content.note;
    const favoritePlantId = +content.favoritePlant;
    const noteName = content.noteName;

    // update note
    const updatedNote = await prisma.note.update({
      where: { userId : res.locals.user.id, id : id },
      data: { 
        note: note, 
        name: noteName, 
        favoritePlantId},
    });
    res.json(updatedNote);
  } catch (err) {
    next(err);
  }
});

/** Deletes single note by id */
router.delete("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const note = await prisma.note.findUnique({ where: { id : id } });
    validateNotes(res.locals.user, note);

    await prisma.note.delete({ where: { id : id } });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  };
});
