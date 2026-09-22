import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

document.documentElement.lang = 'pt-BR'

const configureDurationInputs = () => document.querySelectorAll('.execution-panel input[type="number"]').forEach((input) => {
  input.classList.add('duration-source')
  const wrap = input.closest('.input-wrap')
  if (!wrap || wrap.querySelector('.duration-picker')) return
  const fieldLabel = input.closest('.field')?.querySelector(':scope > span')
  if (fieldLabel) fieldLabel.textContent = 'Tempo de serviço'
  const suffix = wrap.querySelector('.input-suffix')
  if (suffix) suffix.textContent = 'min'
  const picker = document.createElement('select')
  picker.className = 'duration-picker'
  picker.setAttribute('aria-label', 'Tempo de serviço')
  picker.innerHTML = '<option value="">Selecione o tempo...</option>' + Array.from({ length: 49 }, (_, index) => { const minutes = index * 30; const hours = Math.floor(minutes / 60); const remainder = minutes % 60; const label = hours ? `${hours}h${remainder ? ` ${remainder}min` : ''}` : `${remainder} min`; return `<option value="${minutes}">${label}</option>` }).join('')
  picker.value = input.value || ''
  picker.addEventListener('change', () => { input.value = picker.value; input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })) })
  wrap.appendChild(picker)
})
const durationObserver = new MutationObserver(configureDurationInputs)
durationObserver.observe(document.body, { childList: true, subtree: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
