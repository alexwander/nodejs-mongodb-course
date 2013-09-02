var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


MongoClient.connect('mongodb://localhost:27017/school', function(err, db) {
	if(err) throw err;


	var cursor = db.collection('students').find();
	cursor.each(function(err, doc) {
		if(err) throw err;

		if(doc == null){
			db.close();
		} else {
			var lowestGradeIndex = 0;
			var lowestGrade = 10000;
			var studentGrades = doc['scores'];
			var numberOfGrades = studentGrades.length;
			for(var i = 0; i < numberOfGrades; i++){
				if(studentGrades[i]['type'] == "homework" && studentGrades[i]['score'] < lowestGrade){
					lowestGrade = studentGrades[i]['score'];
					lowestGradeIndex = i;
				}
			}
			studentGrades.splice(lowestGradeIndex, 1);

			var query =  { '_id':  doc['_id']};
			doc['scores'] = studentGrades;

			db.collection('students').update(query, doc, function(err, saved){
				if(err) throw err;
		                console.dir("Successfully saved " + saved + " document!");
			});


		}	

	});

});
