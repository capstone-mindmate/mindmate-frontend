declare module 'react-quill' {
  import React from 'react'

  export interface ReactQuillProps {
    value?: string
    defaultValue?: string
    onChange?: (content: string) => void
    onChangeSelection?: (
      range: Range,
      source: Sources,
      editor: UnprivilegedEditor
    ) => void
    onFocus?: (
      range: Range,
      source: Sources,
      editor: UnprivilegedEditor
    ) => void
    onBlur?: (
      previousRange: Range,
      source: Sources,
      editor: UnprivilegedEditor
    ) => void
    onKeyPress?: React.KeyboardEventHandler<HTMLDivElement>
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
    onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>
    className?: string
    theme?: string
    modules?: any
    formats?: string[]
    style?: React.CSSProperties
    readOnly?: boolean
    placeholder?: string
    preserveWhitespace?: boolean
    bounds?: string | HTMLElement
    scrollingContainer?: string | HTMLElement
    tabIndex?: number
    id?: string
  }

  class ReactQuill extends React.Component<ReactQuillProps> {
    focus(): void
    blur(): void
    getEditor(): any
  }

  export default ReactQuill
}
