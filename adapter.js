const Promize = require('./promise')

module.exports = {
    deferred: () => {
        const result = {}
        result.promise = new Promize((resolve, reject) => {
            result.resolve = resolve
            result.reject = reject
        })
        return result
    }
}
