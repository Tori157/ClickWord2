export function showAlert(message, backgroundColor) {
  const toastDiv = document.createElement('div');
  toastDiv.className = 'toast toast-top toast-center z-50';

  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-success';
  alertDiv.innerHTML = `
        <span>${message}</span>
        <button class="close-btn" style="margin-left: auto; background: transparent; border: none; color: white; font-size: 16px; cursor: pointer;">&times;</button>
      `;
  alertDiv.style.backgroundColor = backgroundColor;
  alertDiv.style.color = 'white';
  alertDiv.style.textAlign = 'center';
  alertDiv.style.display = 'flex';
  alertDiv.style.alignItems = 'center';

  toastDiv.appendChild(alertDiv);
  document.body.appendChild(toastDiv);

  const autoRemoveTimeout = setTimeout(() => {
    if (toastDiv.parentElement) {
      toastDiv.parentElement.removeChild(toastDiv);
    }
  }, 2000);

  const closeButton = alertDiv.querySelector('.close-btn');
  closeButton.addEventListener('click', () => {
    clearTimeout(autoRemoveTimeout);
    if (toastDiv.parentElement) {
      toastDiv.parentElement.removeChild(toastDiv);
    }
  });
}
