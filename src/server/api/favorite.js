const { ServerError } = require("../errors");
const prisma = require("../prisma");

const router = require("express").Router();
module.exports = router;

// sends all favorited plants
router.get("/", async (req, res, next) => {
    try {
      // finds many where user exists and favorite true exists
      // validates user is logged in
      const plants = await prisma.favoritePlant.findMany({
        where: { userId: res.locals.user.id },
        include: { 
          plant: true,
          notes: true, 
        },
      });
      // validateFavorites(res.locals.user, favorite);
      res.json(plants);
    } catch (err) {
      next(err);
    }
  });
  
  // sends one favorited plant
  router.get(`/:id`, async (req, res, next) => {
    try {
      const id = +req.params.id;
      const plantId = id

      // finds many where user exists and favorite true exists
      // validates user is logged in
      const plant = await prisma.favoritePlant.findUnique({
        where: { 
          userId: res.locals.user.id,
        plantId: plantId },
        include: { 
          plant: true,
          notes: true },
      });
      // validateFavorites(res.locals.user, favorite);
      res.json(plant);
    } catch (err) {
      next(err);
    }
  });
  
  // adds a plant to favorites     still not working
  router.post("/:id", async (req, res, next) => {
    try {
      // const content = +req.body;
      const id = +req.params.id;

      const favoritePlant = await prisma.favoritePlant.create({
        data: {
          plant: id,
          user: { connect: { id: res.locals.user.id }},
          plant: { connect: { id: id }},
        },
      });
      res.json(favoritePlant);
    } catch (err) {
      next(err);
    }
  });
  
  // removes a plant from favorites
  router.delete("/plant/:id", async (req, res, next) => {
    try {
      const id = +req.params.id;
      const plantId = id
  
      // const favoritePlant = await prisma.favoritePlant.findUnique({
      //   where: { 
      //     plant: {
      //     id: plantId },
      // }
      // });
      // validateFavorites(res.locals.user, favoritePlant);
  
      await prisma.favoritePlant.delete({ where: { 
        id: plantId},
      });

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });