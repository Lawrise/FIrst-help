// // src/routes/elizaRoutes.js
// const express = require('express');
// const router = express.Router();
// const elizaController = require('../controllers/elizaController');
// const authMiddleware = require('../middlewares/authMiddleware');

// // GET : Récupère des documents par UUID (si non trouvé, renvoie la liste des UUID disponibles)
// // Le paramètre :uuid est optionnel ici avec la syntaxe ":uuid?".
// router.get('/:uuid?', authMiddleware, elizaController.getDocuments);

// // POST : Crée un document pour un UUID donné
// router.post('/:uuid', authMiddleware, elizaController.createDocument);

// // DELETE : Supprime les documents associés à un UUID donné
// router.delete('/:uuid', authMiddleware, elizaController.deleteDocuments);

// router.get('/getAll/documents', elizaController.getCalls);

// module.exports = router;

const express = require('express');
const router = express.Router();
const elizaController = require('../controllers/elizaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/calls', authMiddleware, elizaController.getCalls);
router.post('/calls', authMiddleware, elizaController.createDocument);

module.exports = router;