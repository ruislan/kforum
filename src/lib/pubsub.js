'use strict';
import { EventEmitter } from 'node:events';

class Pubsub {
    constructor() {
        this.provider = new EventEmitter({
            captureRejections: true
        });
    }
    async emit(event, data) {
        return this.provider.emit(event, data);
    }
    async on(event, callback) {
        return this.provider.on(event, callback);
    }
}


const isProdEnv = process.env.NODE_ENV === 'production';

const globalForPubsub = global;
const pubsub = globalForPubsub.pubsub ?? new Pubsub();
if (!isProdEnv) globalForPubsub.pubsub = pubsub;

export default pubsub;
