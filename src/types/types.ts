export type ModalStateType = 'closed' | 'login' | 'signup'

export interface ModalProps {
  modalState: ModalStateType,
  setModalState: (state: ModalStateType) => void
}