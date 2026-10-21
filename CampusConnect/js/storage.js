/* Reusable, failure-safe localStorage wrapper. All keys are prefixed with "cc_". */
const Store = {
  prefix: 'cc_',
  getData(key, fallback = null) {
    try { const v = localStorage.getItem(this.prefix + key); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; } // invalid JSON or storage blocked
  },
  saveData(key, value) {
    try { localStorage.setItem(this.prefix + key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  },
  updateData(key, fn, fallback = null) { const v = fn(this.getData(key, fallback)); this.saveData(key, v); return v; },
  removeData(key) { try { localStorage.removeItem(this.prefix + key); } catch (e) { /* ignore */ } },
  clearData() { try { Object.keys(localStorage).filter(k => k.startsWith(this.prefix)).forEach(k => localStorage.removeItem(k)); } catch (e) { /* ignore */ } }
};
