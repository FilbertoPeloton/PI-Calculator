function PiRoutes(app, piService) {
  
    // Register our routes
    app.get('/pi', get);

    function get(req, res) {
        const { n } = req.query;
    
        // Filter out bad quesery params
        if(isNaN(n) || n < 0) return res.status(400).end();

        // Calculate the Nth digit
        piService.calculateNthDigit(n)
            .then(digit => res.json(digit))
            .catch(error => {
                console.log('calculateNthDigit error:', error);
                return res.status(500).end();
            }); 
    }

}

module.exports = PiRoutes;