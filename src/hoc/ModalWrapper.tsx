import React from 'react'

interface WrapperProps {
  children: React.ReactNode,
  visibilityFlag: boolean,
  containerClassName?: string
}

const ModalWrapper: React.FC<WrapperProps> = ({ children, visibilityFlag, containerClassName = '' }) => {
  return (
    <>
      {visibilityFlag && (
        <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75'>
          <section className='z-10 h-[95%] my-2 w-[25rem] flex flex-col justify-center items-center mx-auto relative bg-reddit-dark text-white rounded-xl'>
            <section className={`w-3/4 mx-auto ${containerClassName}`}>
              {children}
            </section>
          </section>
        </div>
      )}
    </>
  )
}

export default ModalWrapper