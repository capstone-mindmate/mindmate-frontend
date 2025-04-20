export const breakpoints = {
  mobileSmall: 478, // 375px 에서 작업
  mobileBig: 600, // 479px 에서 작업
  tablet: 884, // 767px 에서 작업
}

export const media = {
  mobileSmall: `@media all and (max-width: ${breakpoints.mobileSmall}px)`,
  mobileBig: `@media all and (max-width: ${breakpoints.mobileBig}px)`,
  tablet: `@media all and (max-width: ${breakpoints.tablet}px)`,
}
