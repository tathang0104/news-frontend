import React, {FC, useEffect, useRef, useState} from 'react'
import DropdownIcon from "assets/svg/ThreeDot.svg"

interface IDropdownItem {
  id: string | number
  name: string
  onClick: () => void
}

export interface IDropdownProps {
  list: IDropdownItem[]
  dropdownIcon?: string
  className?: string
}

const Dropdown: FC<IDropdownProps> = ({
  list = [],
  dropdownIcon,
  className = '',
}) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownIconRef = useRef<HTMLDivElement>(null)

  const renderDropdownRow = (
    id: string | number,
    name: string,
    isEmpty: boolean = false,
    onSelected?: () => void,
  ) => {
    return (
      <div
        onClick={() => {
          if (!isEmpty) {
            setOpen(false)
          }
          onSelected && onSelected()

        }}
        className={`bg-white p-[12px] cursor-pointer select-none text-[16px] leading-[18.75px] text-[--gray-text] whitespace-nowrap ${isEmpty ? '' : 'hover:bg-[--gray-bg-tag]'}`}
        key={id}
      >
        {name}
      </div>
    )
  }

  const handleClickOutSideDropdown = (e: any) => {
    if (dropdownRef.current && dropdownIconRef.current) {
      const dropdownBox = dropdownRef.current.getBoundingClientRect()
      const dropdownIcon = dropdownIconRef.current.getBoundingClientRect()
      if (
        e.x < dropdownBox.x ||
        e.x >
          (dropdownIcon.width < dropdownBox.width
            ? dropdownBox.x + dropdownBox.width
            : dropdownIcon.x + dropdownIcon.width) ||
        e.y < dropdownIcon.y ||
        e.y > dropdownBox.y + dropdownBox.height
      ) {
        setOpen(false)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutSideDropdown)

    return () =>
      window.removeEventListener('mousedown', handleClickOutSideDropdown)
  }, [dropdownRef, dropdownIconRef])

  return (
    <div
      className={`flex flex-col items-stretch ${className}`}
    >
      <div className="relative ">
        <div
          className="cursor-pointer flex items-center"
          onClick={() => {
            setOpen(!open)
          }}
          ref={dropdownIconRef}
        >
          <div className="flex justify-between items-center space-x-3 w-full">
            <img
              src={dropdownIcon || DropdownIcon}
              className="h-[24px] w-[24px] object-contain"
              alt=""
              onClick={() => {
                setOpen(!open)
              }}
            />
          </div>
        </div>
        <div
          ref={dropdownRef}
          className={`w-fit bg-white rounded-[4px] border-[1px] border-[--gray-line] ${
            open
              ? `transform h-[${
                  list.length > 0 ? 'fit-content' : '44px'
                }] duration-300 flex`
              : 'transform duration-300 h-0 hidden'
          } 
        flex-col items-stretch max-h-[242px] overflow-x-hidden absolute z-30 left-0 top-[110%] shadow-[_-12px_17px_24px_0px_#4B4B7140]`}
        >
          {list.map((item) => (
            <div key={item.id}>{renderDropdownRow(item.id, item.name, false, item.onClick)}</div>
          ))}
          {list.length < 1 && renderDropdownRow('-1', 'Items not found', true)}
        </div>
      </div>
    </div>
  )
}

export default Dropdown