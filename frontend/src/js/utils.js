export function showErrorMessage(message, err){
  const errorMessageDiv = document.getElementById('error-message')
  errorMessageDiv.classList.remove('hidden')
  errorMessageDiv.classList.add('flex')

  errorMessageDiv.textContent = message
  console.error(`{message}:`, err)
}