import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

const rawSupabase = supabaseUrl && supabaseKey
  ? createBrowserClient(supabaseUrl, supabaseKey)
  : null

const removeLegacyExecutor = (value) => {
  const clean = { ...value }
  delete clean.executado_por_id
  return clean
}

export const supabase = rawSupabase
  ? new Proxy(rawSupabase, {
      get(target, property) {
        if (property !== 'from') return target[property]
        return (table) => {
          const query = target.from(table)
          if (table !== 'etiquetas_azuis') return query
          return new Proxy(query, {
            get(builder, builderProperty) {
              if (builderProperty !== 'insert') return builder[builderProperty]
              return (values, ...args) => builder.insert(
                Array.isArray(values) ? values.map(removeLegacyExecutor) : removeLegacyExecutor(values),
                ...args,
              )
            },
          })
        }
      },
    })
  : null

export const isSupabaseConfigured = Boolean(supabase)
