import React from "react"
import cn from "classnames"

interface IItem {
  title: string
  state: string
}

interface ListGroupProps {
  items: IItem[]
  selectedItem: string
  onSelect(selection: string): void
}

export const ListGroup: React.FC<ListGroupProps> = ({
  items,
  selectedItem,
  onSelect,
}): JSX.Element => {
  const listGroupElements = items.map((item) => (
    <li
      onClick={() => onSelect(item.state)}
      key={item.state}
      className={cn("p-1 border-b-2 border-gray-300 cursor-pointer", {
        "text-white bg-blue-500": selectedItem === item.state,
        "hover:bg-gray-100": selectedItem !== item.state,
      })}
    >
      {item.title}
    </li>
  ))

  return (
    <div className="">
      <ul className="border-2 border-b-0 border-gray-300">
        {listGroupElements}
      </ul>
    </div>
  )
}
