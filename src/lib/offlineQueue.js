const QUEUE_KEY = 'azul-etiqueta-offline-queue'

export function getOfflineQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
  } catch {
    return []
  }
}

export function enqueueLabel(label) {
  const queue = getOfflineQueue()
  localStorage.setItem(QUEUE_KEY, JSON.stringify([...queue, label]))
}

export function removeQueuedLabel(id) {
  const queue = getOfflineQueue().filter((item) => item.offline_id !== id)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export async function syncOfflineQueue(supabase) {
  if (!supabase || !navigator.onLine) return
  for (const item of getOfflineQueue()) {
    const { offline_id, ...label } = item
    const { error } = await supabase.from('etiquetas_azuis').insert(label)
    if (!error) removeQueuedLabel(offline_id)
  }
}
