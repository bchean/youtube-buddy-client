var express = require('express');
var app = express();

app.use(express.static('public'));
app.listen(5001, function() {
    console.log('Test app started on port ' + 5001);
});
