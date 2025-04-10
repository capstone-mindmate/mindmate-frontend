/** @jsxImportSource @emotion/react */
import {
  RegisterContainer,
  RegisterTitle,
  RegisterTitleContainer,
  RegisterInputContainer,
  RegisterConfirmButtonContainer,
  RegisterSubTitle,
  RegisterCategoryContainer,
} from './styles/InitialStyles'
import BrownRectButton from '../../../components/buttons/brownRectButton'
import { useState, useEffect } from 'react'
import CategoryButton from '../../../components/buttons/categoryButton'

const InitialCategorySetting = ({
  goToNextStep,
}: {
  goToNextStep: () => void
}) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  useEffect(() => {
    setIsEnabled(selectedCategories.length > 0)
  }, [selectedCategories])

  const handleNextStep = () => {
    if (isEnabled) {
      goToNextStep()
    }
  }

  const handleCategoryToggle = (category: string, isActive: boolean) => {
    if (isActive) {
      setSelectedCategories((prev) => [...prev, category])
    } else {
      setSelectedCategories((prev) => prev.filter((item) => item !== category))
    }
  }

  return (
    <RegisterContainer>
      <RegisterTitleContainer>
        <RegisterTitle>
          마인드 메이트에서
          <br />
          어떤 고민을 나누고 싶나요?
        </RegisterTitle>
        <RegisterSubTitle>
          랜덤 매칭을 위해 고민 카테고리를 선택해주세요
        </RegisterSubTitle>
      </RegisterTitleContainer>

      <RegisterInputContainer>
        <RegisterCategoryContainer>
          <CategoryButton
            buttonText="🤯 진로"
            widthType="half"
            onActiveChange={(isActive) => {
              handleCategoryToggle('진로', isActive)
            }}
          />
          <CategoryButton
            buttonText="💼 취업"
            widthType="half"
            onActiveChange={(isActive) => {
              handleCategoryToggle('취업', isActive)
            }}
          />
          <CategoryButton
            buttonText="📚 학업"
            widthType="half"
            onActiveChange={(isActive) => {
              handleCategoryToggle('학업', isActive)
            }}
          />
          <CategoryButton
            buttonText="👥 인간관계"
            widthType="half"
            onActiveChange={(isActive) => {
              handleCategoryToggle('인간관계', isActive)
            }}
          />
          <CategoryButton
            buttonText="💰 경제"
            widthType="half"
            onActiveChange={(isActive) => {
              handleCategoryToggle('경제', isActive)
            }}
          />
        </RegisterCategoryContainer>
      </RegisterInputContainer>

      <RegisterConfirmButtonContainer>
        <BrownRectButton
          isEnabled={isEnabled}
          buttonText="다음"
          onActiveChange={handleNextStep}
        />
      </RegisterConfirmButtonContainer>
    </RegisterContainer>
  )
}

export default InitialCategorySetting
