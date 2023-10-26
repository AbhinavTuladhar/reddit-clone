import ReactModal from 'react-modal'

interface WrapperProps {
  children: React.ReactNode,
  visibilityFlag: boolean,
  containerClassName?: string
}

const ModalContainer: React.FC<WrapperProps> = ({ children, visibilityFlag, containerClassName = '' }) => {
  return (
    <ReactModal
      isOpen={visibilityFlag}
      overlayClassName='fixed z-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75'
      className='h-[95%] w-[25rem] my-2 flex flex-col justify-center items-center mx-auto relative bg-reddit-dark text-white rounded-xl'
    >
      <section className={`w-3/4 mx-auto ${containerClassName}`}>
        {children}
      </section>
    </ReactModal>
  )
}

export default ModalContainer