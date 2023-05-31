const {
  contextBridge,
  ipcRenderer
} = require('electron');

let scrollX = 0, scrollY = 0;

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll("select").forEach(function(item) {
    item.addEventListener("change", function(e) {
      const value = e.target.value;
      const key = e.target.name;
      const channel = "set-" + key;
      ipcRenderer.send(channel, value);
    })
  });

  // chk scroll
  // document.addEventListener("scroll", function(e) {
  //   var supportPageOffset = window.pageXOffset !== undefined;
  //   var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
  //   var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
  //   var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
  //   console.log(x, y)
  // })
})

// from main.js
// ipcRenderer.on("set-scrollX", function(e, err, res) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log("set-scrollX", res);
//     scrollX = res;
//     window.scrollTo(scrollX, scrollY);
//   }
// });

// // send to renderer.js window.preload
// contextBridge.exposeInMainWorld('preload', {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron,
//   ping: () => ipcRenderer.invoke('ping'),
//   // we can also expose variables, not just functions
// });

