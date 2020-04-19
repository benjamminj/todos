import React, { SVGProps, FunctionComponent } from 'react'

export const PlusIcon: FunctionComponent<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width="18px"
      height="18px"
      aria-hidden="true"
      {...props}
    >
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  )
}
