import React from "react"
import cn from "classnames"
import Pagination from "@material-ui/lab/Pagination"

interface PaginatorProps {
  count: number
  active: number
  className: string
  onChange(event: {}, idx: number): void
}

export const Paginator: React.FC<PaginatorProps> = ({
  active,
  count,
  className,
  onChange,
}) => {
  if (count <= 1) return null
  return (
    <div className={cn(className)}>
      <Pagination
        page={active}
        count={count}
        variant="outlined"
        shape="rounded"
        onChange={onChange}
      />
    </div>
  )
}
