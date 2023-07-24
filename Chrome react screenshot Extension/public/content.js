// document.addEventListener("DOMContentLoaded", function(event) { 
//     chrome.runtime.sendMessage({ message : "hello from content"});
//   });
// In the content script:
chrome.runtime.sendMessage({msg: "capture"}, function(response) {
  console.log(response.dataUrl);
});