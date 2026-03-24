import React from 'react'

const SpinnerLoader = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="inline w-6 h-6 animate-spin"
        viewBox="0 0 100 101"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle (faded) */}
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
          fill="currentColor"
          className="opacity-20"
        />

        {/* Spinning arc */}
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873"
          fill="currentColor"
          className="opacity-100"
        />
      </svg>

      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default SpinnerLoader