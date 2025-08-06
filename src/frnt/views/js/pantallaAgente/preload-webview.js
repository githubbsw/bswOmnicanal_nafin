// preload-webview.js
const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  window.sendMensajeAHost = (datos) => {
    ipcRenderer.sendToHost('mensaje-webview', datos);
  };
});
