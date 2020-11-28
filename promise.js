try {
    if (!window.process) {
        window.process = null
    }
} catch (e) {
    // ignore
}

class Promise {
    static #STATE_PENDING = 'pending'
    static #STATE_FULFILLED = 'fulfilled'
    static #STATE_REJECTED = 'rejected'

    #state = Promise.#STATE_PENDING
    #result = null
    #consumerType = null
    #consumer = null
    #listeners = []
    #isWaiting = false

    constructor(func) {
        try {
            func(this.#resolve, this.#reject)
        } catch (e) {
            this.#reject(e)
        }
    }

    then = (onFulfilled, onRejected) => {
        let result = this.#next(Promise.#isFunction(onFulfilled) ? onFulfilled : r => r, Promise.#STATE_FULFILLED)
        if (Promise.#isFunction(onRejected)) {
            result = result.#next(onRejected, Promise.#STATE_REJECTED)
        }
        return result
    }

    catch = onRejected => this.then(null, onRejected)

    finally = func => this.#next(func, null)

    static resolve = (r) => new Promise(resolve => resolve(r))
    static reject = (e) => new Promise((_, reject) => reject(e))


    static #isFunction = o => typeof o === 'function'

    static #isThenable = (o, p) => ['object', 'function'].indexOf(typeof o) >= 0 && Promise.#isFunction(p)

    static #nextTick = func => {
        if (process && process['nextTick']) {
            process['nextTick'](func);
        } else {
            // TODO: 如果是在浏览器环境中，可以用 MutationObserver 替代 setTimeout
            setTimeout(func);
        }
    }

    #setAndBroadcast = (r, s) => {
        if (this.#state !== Promise.#STATE_PENDING || this.#isWaiting) {
            return
        }

        if (s === Promise.#STATE_FULFILLED && r instanceof Promise) {
            this.#consumerType = Promise.#STATE_FULFILLED
            this.#consumer = re => re
            this.#isWaiting = true
            r.#register(this)
        } else {
            this.#result = r
            this.#state = s
            Promise.#nextTick(_ => {
                if (this.#listeners.length) {
                    while (this.#listeners.length > 0) {
                        this.#listeners.shift().#accept(this)
                    }
                } else if (this.#state === Promise.#STATE_REJECTED) {
                    // throw this.result
                }
            })
        }
    }

    #resolve = (r) => {
        this.#setAndBroadcast(r, Promise.#STATE_FULFILLED)
    }

    #reject = (e) => {
        this.#setAndBroadcast(e, Promise.#STATE_REJECTED)
    }

    #acceptNow = (func) => {
        this.#isWaiting = false
        func()
    }

    #accept = (p) => {
        let r = p.#result
        const consumer = this.#consumer
        if (consumer) {
            if (this.#consumerType === null) {
                Promise.#nextTick(_ => {
                    this.#acceptNow(_ => {
                        consumer()
                        this.#setAndBroadcast(r, p.#state)
                    })
                })
            } else if (this.#consumerType === p.#state) {
                Promise.#nextTick(_ => {
                    this.#acceptNow(_ => {
                        try {
                            r = consumer(p.#result)
                            if (r === this) {
                                this.#reject(new TypeError('`promise` and `x` must not refer to the same object'))
                            } else {
                                if (r && !(r instanceof Promise)) {
                                    const thenProp = r.then
                                    if (Promise.#isThenable(r, thenProp)) {
                                        const rt = r
                                        r = new Promise((resolve, reject) => {
                                            thenProp.call(rt, resolve, reject)
                                        })
                                    }
                                }
                                this.#resolve(r)
                            }
                        } catch (e) {
                            this.#reject(e)
                        }
                    })
                })
            } else {
                this.#acceptNow(_ => {
                    this.#setAndBroadcast(r, p.#state)
                })
            }
        }
    }

    #register = np => {
        if (this.#state === Promise.#STATE_PENDING) {
            this.#listeners.push(np)
        } else {
            np.#accept(this)
        }
    }

    #next = (func, type) => {
        let np = new Promise(_ => {
        })
        np.#consumerType = type
        np.#consumer = func
        this.#register(np)
        return np
    }
}

module.exports = Promise
