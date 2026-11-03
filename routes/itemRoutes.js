const express = require('express');
const itemController = require('../controllers/itemController');
const bidController = require('../controllers/bidController');
const { requireAuth, requireItemOwner } = require('../middleware/auth');

const router = express.Router();

router.get('/', itemController.listItems);
router.get('/new', requireAuth, itemController.showCreateForm);
router.post('/', requireAuth, itemController.createItem);
router.get('/:id', itemController.showItem);
router.post('/:id/bids', requireAuth, bidController.placeBid);
router.post('/:id/delete', requireAuth, requireItemOwner, itemController.deleteItem);

module.exports = router;
