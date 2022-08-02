exports.handleCustomErrors = (err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({msg : 'bad request D:<'})
    };
    if(err.status === 404) {
        res.status(404).send({msg : 'article not found'})
    }
    next(err)
};

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({msg: 'server error!'})
}