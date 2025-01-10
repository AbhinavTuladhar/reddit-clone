import { useState } from 'react'

const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue)

  const toggleValue = () => {
    setValue(!value)
  }

  const setValueOn = () => setValue(true)
  const setValueOff = () => setValue(false)

  return { value, toggleValue, setValueOn, setValueOff }
}

export default useToggle
