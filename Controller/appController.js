const request = require('request');
const { Res, errRes } = require('../utils/Res&errRes')
 

exports.getGithubRepos = async (req, res, next) => {
    try {
      const options = {
        uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUBCLIENTID}&client_secret=${process.env.GITHUBCLIENTSECRET}`,
        method: 'GET',
        headers: {
            'user-agent': 'node.js'
        }
      }
      request(options, (err, response, body) => {
        if (err) {
            // console.log(err)
            return errRes(res, 400, `${err.message}`)
        }
        if (res.statusCode !== 200) {
            return errRes(res, 404, `${err.message}`)
        }

        Res(res, 200, JSON.parse(body))
      })


    } catch (err) {
      // console.log(err)
      res.status(500).send(' Server error getting github repos ! ');
    }
}