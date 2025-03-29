import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  AlarmIcon,
  ChatAlertIcon,
  ChatBoxIcon,
  ChatBubbleIcon,
  CheckIconBig,
  CheckIconSmall,
  CloseIcon,
  CoinIcon,
  ErrorIcon,
  HomeIcon,
  ImageIcon,
  ListIcon,
  SettingIcon,
  SmileIcon,
  WarningIcon,
} from '../iconComponents'

describe('AlarmIcon', () => {
  it('renders with default props', () => {
    render(<AlarmIcon />)
  })

  it('applies custom styles', () => {
    const { container } = render(
      <AlarmIcon
        width={32}
        height={32}
        color="#FF0000"
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('alarm-icon custom-class')
  })
})

describe('ChatAlertIcon', () => {
  it('renders with default props', () => {
    render(<ChatAlertIcon alertCount={1} />)
  })

  it('displays alert count correctly', () => {
    render(<ChatAlertIcon alertCount={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('applies custom styles', () => {
    const { container } = render(
      <ChatAlertIcon
        alertCount={1}
        width={32}
        height={32}
        fontSize={14}
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('chat-alert-icon custom-class')
  })
})

describe('ChatBoxIcon', () => {
  it('renders with default props', () => {
    render(<ChatBoxIcon />)
  })

  it('applies custom styles', () => {
    const { container } = render(
      <ChatBoxIcon
        width={32}
        height={32}
        color="#FF0000"
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('chat-box-icon custom-class')
  })
})

describe('ChatBubbleIcon', () => {
  it('renders with default props', () => {
    render(<ChatBubbleIcon />)
  })

  it('applies custom styles', () => {
    const { container } = render(
      <ChatBubbleIcon
        width={32}
        height={32}
        color="#FF0000"
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('chat-bubble-icon custom-class')
  })
})

describe('CheckIconBig', () => {
  it('renders with default props', () => {
    render(<CheckIconBig />)
  })

  it('applies custom styles', () => {
    const { container } = render(
      <CheckIconBig
        width={32}
        height={32}
        color="#FF0000"
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('check-icon-big custom-class')
  })
})

describe('CheckIconSmall', () => {
  it('renders with default props', () => {
    render(<CheckIconSmall />)
  })

  it('applies custom styles', () => {
    const { container } = render(
      <CheckIconSmall
        width={32}
        height={32}
        color="#FF0000"
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('check-icon-small custom-class')
  })
})

describe('CloseIcon', () => {
  it('renders with default props', () => {
    render(<CloseIcon />)
  })

  it('applies custom styles', () => {
    const { container } = render(
      <CloseIcon
        width={32}
        height={32}
        color="#FF0000"
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('close-icon custom-class')
  })
})

describe('CoinIcon', () => {
  it('renders with default props', () => {
    render(<CoinIcon />)
  })

  it('applies custom styles', () => {
    const { container } = render(
      <CoinIcon
        width={32}
        height={32}
        color="#FF0000"
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('coin-icon custom-class')
  })
})

describe('ErrorIcon', () => {
  it('renders with default props', () => {
    render(<ErrorIcon />)
  })

  it('applies custom styles', () => {
    const { container } = render(
      <ErrorIcon
        width={32}
        height={32}
        color="#FF0000"
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('error-icon custom-class')
  })
})

describe('HomeIcon', () => {
  it('renders with default props', () => {
    render(<HomeIcon />)
  })

  it('applies custom styles', () => {
    const { container } = render(
      <HomeIcon
        width={32}
        height={32}
        color="#FF0000"
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('home-icon custom-class')
  })
})

describe('ImageIcon', () => {
  it('renders with default props', () => {
    render(<ImageIcon />)
  })

  it('applies custom styles', () => {
    const { container } = render(
      <ImageIcon
        width={32}
        height={32}
        color="#FF0000"
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('image-icon custom-class')
  })
})

describe('ListIcon', () => {
  it('renders with default props', () => {
    render(<ListIcon />)
  })

  it('applies custom styles', () => {
    const { container } = render(
      <ListIcon
        width={32}
        height={32}
        color="#FF0000"
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('list-icon custom-class')
  })
})

describe('SettingIcon', () => {
  it('renders with default props', () => {
    render(<SettingIcon />)
  })

  it('applies custom styles', () => {
    const { container } = render(
      <SettingIcon
        width={32}
        height={32}
        color="#FF0000"
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('setting-icon custom-class')
  })
})

describe('SmileIcon', () => {
  it('renders with default props', () => {
    render(<SmileIcon />)
  })

  it('applies custom styles', () => {
    const { container } = render(
      <SmileIcon
        width={32}
        height={32}
        color="#FF0000"
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('smile-icon custom-class')
  })
})

describe('WarningIcon', () => {
  it('renders with default props', () => {
    render(<WarningIcon />)
  })

  it('applies custom styles', () => {
    const { container } = render(
      <WarningIcon
        width={32}
        height={32}
        color="#FF0000"
        className="custom-class"
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('warning-icon custom-class')
  })
})
