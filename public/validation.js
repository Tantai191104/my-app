function validateForm() {
  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword =
    document.getElementById("confirmNewPassword").value;
  const errorDiv = document.getElementById("confirmError");

  if (newPassword !== confirmNewPassword) {
    errorDiv.textContent = "Confirm password does not match!";
    errorDiv.style.display = "block";
    return false;
  }

  errorDiv.textContent = "";
  errorDiv.style.display = "none";
  return true;
}
document.addEventListener("DOMContentLoaded", function () {
  const hash = window.location.hash;

  if (hash === "#password") {
    const tabTriggerEl = document.querySelector(`#password-tab`);
    if (tabTriggerEl) {
      const tab = new bootstrap.Tab(tabTriggerEl);
      tab.show();
    }
  }
});
