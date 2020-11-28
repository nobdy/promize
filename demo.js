function formatNum(n) {
    return n > 9 ? n : ('0' + n)
}

function formatMiLLiSeconds(n) {
    return n > 99 ? '' + n : (n > 9 ? ('0' + n) : ('00' + n))
}

function formatDate(date) {
    return `${date.getFullYear()}-${formatNum(date.getMonth())}-${formatNum(date.getDate())} `
        + `${formatNum(date.getHours())}:${formatNum(date.getMinutes())}:${formatNum(date.getSeconds())}`
        + `.${formatMiLLiSeconds(date.getMilliseconds())}`
}

function constructLogArguments(args) {
    return ['%c%s:', 'color: coral; font-weight: bold;', formatDate(new Date()), ...Array.from(args)]
}

function log(msg) {
    console.log(...constructLogArguments(arguments))
}

function logError(msg) {
    console.error(...constructLogArguments(arguments))
}

function getSeqDesc(seq) {
    return `[${seq + 1}]`
}

function runInSequence(arr, func) {
    arr = arr || []
    let promise = new Promise((resolve) => {
        resolve()
    })
    for (let i = 0; i < arr.length; i++) {
        const seqDesc = getSeqDesc(i + 1)
        promise = promise.then(() => new Promise((resolve, reject) => {
            func(i, arr[i], resolve, reject)
        }))
        promise = promise.catch((e) => {
            logError(`${seqDesc} caught exception：${e}`)
        })
        promise = promise.finally(() => {
            log(`${seqDesc} complete`)
        })
    }
    return promise
}

function demoRunInSequence() {
    function waitForSeconds(arr, callback) {
        const longestSeconds = 3
        log(`Begin execution`)
        runInSequence(arr, (idx, seconds, resolve, reject) => {
            const seqDesc = getSeqDesc(idx + 1)
            log('----------------')
            log(`${seqDesc} start`)
            setTimeout(() => {
                if (seconds > longestSeconds) {
                    reject(new Error(`${seqDesc} took ${seconds} seconds, greater than the maximum duration ${longestSeconds} seconds`))
                } else {
                    let r = `${seqDesc} took ${seconds} seconds`
                    log(r)
                    resolve(r)
                }
            }, seconds * 1000)
        }).then(_ => {
            log(`Congratulations, this batch of tasks was successfully completed!`)
        }).catch((e) => {
            logError(`Finally catch the exception: ${e}`)
        }).finally(() => {
            callback()
        })
    }

    log('-------- Executing test of batch tasks in sequence --------')
    log('-------- Executing the first batch of tasks --------')
    waitForSeconds([2, 1, 5, 3, 0], _ => {
        log('-------- Executing the second batch of tasks --------')
        waitForSeconds([2, 1, 3, 1, 1], _ => {
            log(`-------- All tests are completed --------`)
        })
    })
    log('End of sync code')
}
