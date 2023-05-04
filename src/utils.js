import { unref } from 'vue'

// Animation duration in ms
export const DURATION = 400

export const ops = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => a / b
}

export function evaluateOperation(num1, op, num2) {
  if (Array.isArray(num1)) {
   [num1, op, num2] = num1
  }

  const result = ops[normalizeOps(op)](num1, num2)

  return result > 0 && Math.round(result) === result ? result : false
}

export function normalizeOps(str) {
  return str
    .replace(/\//g, '÷')
    .replace(/[xX*]/g, '×')
}

export function distance(value, target) {
  return Math.abs(unref(value) - unref(target))
}

export function solve(nums, target) {
  const cache = Object.create(null)

  return recurse(unref(nums))

  // returns an array in the format [result, [num1, op, num2], ...]
  function recurse(nums) {
    const cacheKey = nums.join(',')

    if (cache[cacheKey]) {
      return cache[cacheKey]
    }

    let offset = Number.POSITIVE_INFINITY
    let best = null

    for (const num of nums) {
      const away = distance(num, target)

      if (away < offset) {
        offset = away
        best = [num]
      }
    }

    if (nums.length > 1) {
      for (let i = 0; i < nums.length - 1; ++i) {
        for (let j = i + 1; j < nums.length; ++j) {
          const n1 = nums[i]
          const n2 = nums[j]
          const remaining = [...nums]
          remaining.splice(j, 1)
          remaining.splice(i, 1)

          for (const op in ops) {
            if (n2 === 1 && (op === '×' || op === '÷')) {
              continue
            }

            const result = evaluateOperation(n1, op, n2)

            if (result) {
              const newNums = [result, ...remaining]
              newNums.sort((b, a) => a - b)

              const [reached, ...operations] = recurse(newNums)

              const away = distance(reached, target)

              if (away < offset || (away === offset && operations.length + 2 < best.length)) {
                offset = away
                best = [reached, [n1, op, n2], ...operations]
              }
            }
           }
        }
      }
    }

    cache[cacheKey] = best

    return best
  }
}
