process.on('message', msg => {
    const { n } = msg;
    calculatePi(n);
});

const CHUNK_SIZE = 100;

/**
 * Calculates digits of PI from 0 to N
 * 
 * TODO: Find a way to cache the args so we don't have to start 
 * at 0 every time 
 * 
 * @param {*} n Upper bound we're calculating Pi to 
 */
function calculatePi(n) {
    let piArgs = {
        q: 1n,
        r: 180n,
        t: 60n,
        i: 2n
    }
    
    for(let index = 0; index < n; index += CHUNK_SIZE) {        
        // Calculate the next piece of PI
        let { chunk, args } = calcluateNextPiChunk(piArgs);
        piArgs = args;

        let message = {
            chunk,
            startIndex: index
        };
        
        // Send back the current chunk
        process.send(message);
    }

    process.exit();
}

/**
 * Implementation of the Spigot Algorithm to calculate PI
 * one digit at a time
 * 
 * https://rosettacode.org/wiki/Pi#JavaScript
 * 
 * Note: I think it would have been better to use the BP algorithm.
 * If a user asks for the 200,000th digit up front we're going to be in trouble :( 
 * https://en.wikipedia.org/wiki/Bailey%E2%80%93Borwein%E2%80%93Plouffe_formula
 */ 
function calcluateNextPiChunk(args) {
    let chunk = '';
    let { q, r, t, i } = args;

    for(let index = 0; index < CHUNK_SIZE; index++) {
        let y = (q*(27n*i-12n)+5n*r)/(5n*t);
        let u = 3n*(3n*i+1n)*(3n*i+2n);
        r = 10n*u*(q*(5n*i-2n)+r-y*t);
        q = 10n*q*i*(2n*i-1n);
        t = t*u;
        i = i+1n;
        
        chunk = chunk.concat(y.toString());
    }

    args = { q, r, t, i };

    return { chunk, args };
}