import { ModalStateType } from '@/types/types'
import React, { FC } from 'react'

const modalParentClassName = 'fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75'
const modalChild1ClassName = 'h-[95%] my-2 w-4/12 flex flex-cols justify-center items-center mx-auto relative bg-white rounded-xl'

interface ModalProps {
  modalState: ModalStateType,
  setModalState: (state: ModalStateType) => void
}

export const LoginWindow: React.FC<ModalProps> = ({ modalState, setModalState }) => {
  return (
    <div className={`${modalState === 'login' ? modalParentClassName : 'hidden'}`}>
      <div className={modalChild1ClassName}>
        <p> This is the login window </p>
        <button className='bg-purple-400 p-2' onClick={() => setModalState('closed')}> Close window </button>
      </div>
    </div>
  )
}

export const SignupWindow: React.FC<ModalProps> = ({ modalState, setModalState }) => {
  return (
    <div className={`${modalState === 'signup' ? modalParentClassName : 'hidden'}`}>
      <div className={modalChild1ClassName}>
        <p> This is the login window </p>
        <button className='bg-purple-400 p-2' onClick={() => setModalState('closed')}> Close window </button>
      </div>
    </div>
  )
}