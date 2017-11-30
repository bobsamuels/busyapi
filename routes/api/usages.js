module.exports = function(app){
    app.post('/api/usages', function(req, res){

        // Store the supplied usage data
        var usageId = app.usages.push(req.body);
        res.status(201).json({'id':usageId});
    });
}
