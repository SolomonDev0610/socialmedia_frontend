export const waiterShow = () => {
  document.getElementsByClassName("waiter_section")[0].style.display = 'block';
}

export const waiterHide = () => {
  console.log("waiterHide=============");
  document.getElementsByClassName("waiter_section")[0].style.display = 'none';
}
