const express = require('express')
const { 
    newShelflifeInput,
    getAllShelflifeInputs,
    updateShelflifeInput,
    deleteShelflifeInput
 } = require('../controllers/shelflifeController')

const router = express.Router()


router.post('/:user_id', newShelflifeInput)

router.get('/:user_id', getAllShelflifeInputs)

router.put('/:user_id/:id', updateShelflifeInput)

router.delete('/:user_id/:id', deleteShelflifeInput)

module.exports = router