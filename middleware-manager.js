class ZmqMiddlewareMananger {
    constructor(socket) {
        this.socket = socket;
        this.inboundMiddlewares = [];
        this.outboundMiddlewares = [];
        this.inComingMessages().catch(err => console.log('An error occurred while processing request'));
    }


    async inComingMessages() {
        for await(const [message] of this.socket) {
            try {
                await this.executeMiddlewares(this.inboundMiddlewares, message)
            } catch (error) {
                console.log('Error occurred while executing middleware', error);
            }
            
        }
    }

    use(middleware) {
        if(typeof middleware !== 'object') {
            throw new TypeError('Expected an object, got %s', typeof middleware);
        }

        if(Array.isArray(middleware)) {
            throw new TypeError('Expected an object literal, got an array');
        }

        if(middleware.inbound) {
            this.inboundMiddlewares.push(middleware.inbound);
        }

        if(middleware.outbound) {
            this.outboundMiddlewares.unshift(middleware.outbound);
        }
    }

    async executeMiddlewares(middlewares, initialMessage) {
        let message = initialMessage;
        for await (const middleware of middlewares) {
           message = await middleware.call(this, message);
        }

        return message;
    }

    async send(message) {
        const finalMessage = await this.executeMiddlewares(this.outboundMiddlewares, message);
        return this.socket.send(finalMessage);
    }
}

export default ZmqMiddlewareMananger;