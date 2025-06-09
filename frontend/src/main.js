import './styles.css'
import './js/stadium.js'

document.querySelectorAll('[data-dismiss-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    const selector = btn.getAttribute('data-dismiss-target')
    const alertEl  = document.querySelector(selector)
    if (alertEl) alertEl.remove()
  })
})

