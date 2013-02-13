exports.handle_request = function(request, response)
{
    //Do logics here
    var result = "result \n end";
    
    //write results to response message
    response.render('index');
    

}

