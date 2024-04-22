/**
 * String equals ignore case
 * @param value1
 * @param value2
 * @returns
 */
export function equalFold(value1: string, value2: string): boolean {
    if (typeof value1 !== 'string' || typeof value2 !== 'string') {
      return false
    }
  
    if (value1 == value2) {
      return true
    }
    if (value1.toUpperCase() == value2.toUpperCase()) {
      return true
    }
  
    return false
  }
  