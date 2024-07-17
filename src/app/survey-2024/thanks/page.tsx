import * as React from "react"
import Confetti from "./Confetti"

const Page = () => {
  return (
    <div className="p-4 md:p-8 min-h-[100vh] bg-slate-100 flex items-center justify-center">
      <div className="w-[100%] md:w-[80%] max-w-[800px]">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 flex flex-row items-center">
      <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>

      DataEng.vc Survey 2024
    </h2>
    <h2>Thanks for participating</h2>
      </div>
      <Confetti />
    </div>
  )
}

export default Page
