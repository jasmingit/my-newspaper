const { fetchTopics } = require("../model/newpaper")

exports.getTopics = (req, res) => {
    fetchTopics().then((topicArr) => {
        res.status(200).send({topics : topicArr});        
    })
}