const STATE_PENDING = 'pending'
const STATE_FULFILLED = 'fulfilled'
const STATE_REJECTED = 'rejected'

try {
    if (!window.process) {
        window.process = null
    }
} catch (e) {
    // ignore
}

const nextTick = func => {
    if (process && process.nextTick) {
        process.nextTick(func);
    } else {
        // TODO: 如果是在浏览器环境中，可以用 MutationObserver 替代 setTimeout
        setTimeout(func);
    }
}

function isFunction(o) {
    return typeof o === 'function'
}

function isThenable(o, p) {
    return ['object', 'function'].indexOf(typeof o) >= 0 && isFunction(p)
}

function Promise(func) {
    this.state = STATE_PENDING
    this.result = null
    this.consumerType = null
    this.consumer = null
    this.listeners = []
    this.isWaiting = false

    const setAndBroadcast = (r, s) => {
        if (this.state !== STATE_PENDING || this.isWaiting) {
            return
        }

        if (s === STATE_FULFILLED && r instanceof Promise) {
            this.consumerType = STATE_FULFILLED
            this.consumer = re => re
            this.isWaiting = true
            r.register(this)
        } else {
            this.result = r
            this.state = s
            nextTick(_ => {
                if (this.listeners.length) {
                    while (this.listeners.length > 0) {
                        this.listeners.shift().accept(this)
                    }
                } else if (this.state === STATE_REJECTED) {
                    // throw this.result
                }
            })
        }
    }

    const resolve = (r) => {
        setAndBroadcast(r, STATE_FULFILLED)
    }

    const reject = (e) => {
        setAndBroadcast(e, STATE_REJECTED)
    }

    const acceptNow = (func) => {
        this.isWaiting = false
        func()
    }

    this.accept = (p) => {
        let r = p.result
        if (this.consumer) {
            const consumer = this.consumer
            if (this.consumerType === null) {
                nextTick(_ => {
                    acceptNow(_ => {
                        consumer()
                        setAndBroadcast(r, p.state)
                    })
                })
            } else if (this.consumerType === p.state) {
                nextTick(_ => {
                    acceptNow(_ => {
                        try {
                            r = consumer(p.result)
                            if (r === this) {
                                reject(new TypeError('`promise` and `x` must not refer to the same object'))
                            } else {
                                if (r && !(r instanceof Promise)) {
                                    const thenProp = r.then
                                    if (isThenable(r, thenProp)) {
                                        const rt = r
                                        r = new Promise((resolve, reject) => {
                                            thenProp.call(rt, resolve, reject)
                                        })
                                    }
                                }
                                resolve(r)
                            }
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
            } else {
                acceptNow(_ => {
                    setAndBroadcast(r, p.state)
                })
            }
        }
    }

    try {
        func(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

Promise.prototype.register = function (np) {
    if (this.state === STATE_PENDING) {
        this.listeners.push(np)
    } else {
        np.accept(this)
    }
}

Promise.prototype.next = function (func, type) {
    let np = new Promise(_ => {
    })
    np.consumerType = type
    np.consumer = func
    this.register(np)
    return np
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    let result = this.next(isFunction(onFulfilled) ? onFulfilled : r => r, STATE_FULFILLED)
    if (isFunction(onRejected)) {
        result = result.next(onRejected, STATE_REJECTED)
    }
    return result
}

Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected)
}

Promise.prototype.finally = function (func) {
    return this.next(func, null)
}

Promise.resolve = (r) => new Promise(resolve => resolve(r))
Promise.reject = (e) => new Promise((_, reject) => reject(e))

module.exports = Promise
