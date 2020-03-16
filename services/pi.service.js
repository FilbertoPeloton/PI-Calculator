const { fork } = require('child_process');

class PiService  {

    constructor() {
        this.pi = [];
    }

    /**
     * Fires of a child process to calculate the n'th digit of PI
     * recieving and caching proress updates as they come in.
     * 
     * @param {*} n The nth digit of PI to be returns 
     */
    calculateNthDigit(n) {    
        return new Promise((resolve, reject) => {
            try {
                // Return the cached digit if we have it cached
                if(this.pi[n - 1]) return resolve(this.pi[n - 1]);

                // Offload the work to a new child process
                const forked = fork('./workers/pi.worker.js');
                forked.send({ n });

                // Update our next piece of pi 
                forked.on('message', msg => {
                    let { chunk, startIndex } = msg;
                    
                    // Update the chunk
                    for(let i = 0; i < chunk.length; i++) {
                        this.pi[startIndex] = parseInt(chunk[i]);
                        startIndex++; 
                    }
                });

                // done calculating, send back the result
                forked.on('exit', () => {
                    forked.kill();
                    resolve(this.pi[n - 1]);
                });

            } catch(error) {
                reject(error);
            }
        });
    };
};

module.exports = PiService;