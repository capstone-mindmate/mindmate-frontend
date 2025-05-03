/** @jsxImportSource @emotion/react */
import { useEffect } from 'react'

import {
  ToggleContainer,
  ToggleText,
  ToggleSwitchContainer,
  ToggleSwitchThumb,
} from './styles/toggleStyles'

interface ToggleProps {
  text: string
  toggleState: boolean
  onToggle: () => void
}

const Toggle = ({ text, toggleState, onToggle }: ToggleProps) => {
  return (
    <ToggleContainer>
      <ToggleText>{text}</ToggleText>
      <ToggleSwitchContainer
        isActive={toggleState}
        onClick={onToggle}
        role="switch"
        aria-checked={toggleState}
      >
        <ToggleSwitchThumb isActive={toggleState} />
      </ToggleSwitchContainer>
    </ToggleContainer>
  )
}

export default Toggle
