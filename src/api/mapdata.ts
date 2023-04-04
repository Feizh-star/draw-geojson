
export function getTyphoon(): Promise<any> {
  return new Promise((resolve, reject) => {
    fetch('/dataset/typhoon.json').then(res => res.json()).then(data => {
      resolve(data)
    }).catch(error => reject(error))
  })
}