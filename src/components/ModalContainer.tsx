import ReactModal from 'react-modal'

interface WrapperProps {
  children: React.ReactNode
  visibilityFlag: boolean
  containerClassName?: string
}

const ModalContainer: React.FC<WrapperProps> = ({ children, visibilityFlag, containerClassName = '' }) => {
  return (
    <ReactModal
      isOpen={visibilityFlag}
      overlayClassName="fixed z-[100000] top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75"
      className="relative mx-auto my-2 flex h-[95%] w-[25rem] flex-col items-center justify-center rounded-xl bg-reddit-dark text-white"
    >
      <section className={`mx-auto w-3/4 ${containerClassName}`}>{children}</section>
    </ReactModal>
  )
}

export default ModalContainer
