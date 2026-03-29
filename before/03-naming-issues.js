// PROBLEM: Poor naming makes code hard to understand

function p(d, t) {
  if (t === 'a') {
    return d.filter(x => x.s === 1).map(x => x.n);
  } else if (t === 'b') {
    return d.filter(x => x.s === 2).reduce((a, x) => a + x.v, 0);
  } else {
    return d.length;
  }
}

class u {
  constructor(d) {
    this.d = d;
    this.st = 'i';
  }
  
  async g() {
    this.st = 'l';
    try {
      const r = await fetch(this.d);
      this.st = 's';
      return r.json();
    } catch (e) {
      this.st = 'e';
      throw e;
    }
  }
}

const fn = (a, b) => {
  if (a > b) return a;
  return b;
};

function proc(arr, cb) {
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    if (cb(arr[i])) {
      res.push(arr[i]);
    }
  }
  return res;
}