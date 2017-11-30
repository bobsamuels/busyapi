module.exports = function(app){
    app.post('/api/usages', function(req, res){
		//increment an identifier, used to return in the post response.
		app.client.incr('id', function(err, id) {
			//Store the post data with the incremented id.
			 app.client.hmset(id, 
			 	"patientId", req.body.patientId, 
			 	"timestamp", req.body.timestamp,
			 	"medication", req.body.medication
			 	);   			
				 res.status(201).json({'id':id});
		});		
    });
}
