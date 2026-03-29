// No file documentation
// Poor naming, no error handling, no types, high complexity

class us {
  constructor(d) {
    this.d = d;
  }
  
  async g(id) {
    const u = await this.d.f(id);
    if (u) {
      if (u.active) {
        if (u.verified) {
          if (u.role === 'admin' || u.role === 'user' || u.role === 'mod') {
            if (u.lastLogin > Date.now() - 86400000) {
              return { n: u.n, e: u.e, r: u.r };
            } else {
              return { n: u.n, e: u.e, r: u.r, expired: true };
            }
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  
  pp(data) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].type === 'a') {
        for (let j = 0; j < data[i].items.length; j++) {
          if (data[i].items[j].active) {
            result.push(data[i].items[j]);
          }
        }
      } else if (data[i].type === 'b') {
        if (data[i].valid) {
          result.push(data[i]);
        }
      } else {
        for (let k = 0; k < data[i].children.length; k++) {
          result = result.concat(this.pp([data[i].children[k]]));
        }
      }
    }
    return result;
  }
}

function em(x) {
  return x.includes('@') && x.includes('.');
}

const v = (d, f) => {
  const od = new Date(d);
  return od.toLocaleDateString(f);
};