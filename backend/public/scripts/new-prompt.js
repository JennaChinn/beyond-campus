export function confirmMessage(promptBox, message, func) {
  promptBox.querySelector("#prompt-title").innerHTML = message;
  promptBox.querySelector("#promptTextarea").style.display="none";

  var cancel = promptBox.querySelector("#prompt-cancel");
  var accept = promptBox.querySelector("#prompt-accept");

  accept.innerHTML = "Confirm";
  cancel.style.display="inline";
  cancel.addEventListener("click",() => cancelPrompt(promptBox));
  accept.addEventListener("click",() => sendConfirm(func));

  document.querySelector(".cover").style.visibility="visible";
}

export function promptMessage(promptBox, message, func) {
  promptBox.querySelector("#prompt-title").innerHTML = message;
  promptBox.querySelector("#promptTextarea").style.display="block";

  var cancel = promptBox.querySelector("#prompt-cancel");
  var accept = promptBox.querySelector("#prompt-accept");

  accept.innerHTML = "Submit";
  cancel.style.display="inline";
  cancel.addEventListener("click",() => cancelPrompt(promptBox));
  accept.addEventListener("click",() => sendPrompt(promptBox,func));

  document.querySelector(".cover").style.visibility="visible";
}

export function alertMessage(promptBox, message, func) {
  promptBox.querySelector("#prompt-title").innerHTML = message;
  promptBox.querySelector("#promptTextarea").style.display="none";

  var cancel = promptBox.querySelector("#prompt-cancel");
  var accept = promptBox.querySelector("#prompt-accept");

  accept.innerHTML = "OK";
  cancel.style.display="none";
  accept.addEventListener("click",() => sendPrompt(promptBox,func));

  document.querySelector(".cover").style.visibility="visible";
}

const cancelPrompt = (promptBox) => {
  promptBox.querySelector("#promptTextarea").value="";
  document.querySelector(".cover").style.visibility="hidden";
}

const sendPrompt = (promptBox, func) => {
  const val = promptBox.querySelector("#promptTextarea").value;
  promptBox.querySelector("#promptTextarea").value="";
  document.querySelector(".cover").style.visibility="hidden";
  func(val);
}

const sendConfirm = (func) => {
  document.querySelector(".cover").style.visibility="hidden";
  func();
}

