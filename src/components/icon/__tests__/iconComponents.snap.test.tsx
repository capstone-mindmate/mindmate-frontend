import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { AlarmIcon, SearchIcon } from '../iconComponents'

describe('Icon Snapshots', () => {
  it('AlarmIcon matches snapshot', () => {
    const { container } = render(<AlarmIcon />)
    expect(container).toMatchSnapshot()
  })

  it('SearchIcon with custom props matches snapshot', () => {
    const { container } = render(
      <SearchIcon width={32} height={32} color="#FF0000" />
    )
    expect(container).toMatchSnapshot()
  })
})
