const Controller = require('../controller')

class HomeController extends Controller {
  indexPage(req, res, next) {
    res.status(200).send('index Page')
  }
}

module.exports = new HomeController