import { Toaster } from 'react-hot-toast'

export function ToastLayout({ children }) {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      {children}
    </>
  )
}