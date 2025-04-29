/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface CategoryProps {
  category: string
}

const categoryStyle = {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 6px 10px;
    border-radius: 3px;
    background-color: #f5f5f5;
  `,

  category: css`
    font-size: 12px;
    font-weight: bold;
    line-height: 1.3;
    color: #727272;
    margin: 0;
  `,
}

const Category = ({ category }: CategoryProps) => {
  return (
    <div className="container" css={categoryStyle.container}>
      <p css={categoryStyle.category}>{category}</p>
    </div>
  )
}

export default Category
