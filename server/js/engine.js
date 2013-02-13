module.exports = 
{


handle_request: function(request, response)
{
    //Do logics here
    var result = "result \n";
    
    //write results to response message
    response.write(result);
    
    //End response message
    response.end("end");
}


}//end module
