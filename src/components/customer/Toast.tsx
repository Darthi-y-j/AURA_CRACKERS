import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useToast, useToastList } from '@/contexts/ToastContext'
import { cn } from '@/lib/utils'

export function ToastContainer() {
  const toasts = useToastList()
  const { removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast, i) => (
        <div
          key={toast.id}
          className={cn(
            'animate-toast-in flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg',
            toast.type === 'success' && 'bg-green-600 text-white',
            toast.type === 'error' && 'bg-red-600 text-white',
            toast.type === 'info' && 'bg-navy-900 text-white'
          )}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {toast.type === 'success' && <CheckCircle className="h-5 w-5 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="h-5 w-5 shrink-0" />}
          {toast.type === 'info' && <Info className="h-5 w-5 shrink-0" />}
          <span className="text-sm">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 shrink-0 opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
