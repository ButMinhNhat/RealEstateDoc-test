import { useEffect, useState } from "react";

import { FormDataDto, ItemDto, ItemPaginationDto, OpenModal, UserDto } from "@/common/entity";

type TableWithPaginationProps = {
  user: UserDto | null
  openSideModal: boolean
  paginationData: ItemPaginationDto
  setFormData: React.Dispatch<React.SetStateAction<FormDataDto>>
  setOpenModal: React.Dispatch<React.SetStateAction<OpenModal>>
  handleDeleteItem: (itemId: string) => Promise<void>
  handleChangePagination: (newData: Partial<ItemPaginationDto>) => void
}

export default function TableWithPagination(props: TableWithPaginationProps) {
  const { 
    user, 
    paginationData, 
    openSideModal, 
    setFormData, 
    setOpenModal, 
    handleDeleteItem, 
    handleChangePagination 
  } = props
 
  const { data, page, limit, total, sort, search } = paginationData
  const totalPages = Math.ceil(total / limit)

  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    const debounce = setTimeout(() => handleChangePagination({ search: searchInput }), 500)
    return () => clearTimeout(debounce)
  }, [searchInput, setSearchInput])

  return (
    <div className="w-full shadow-md rounded-md">
      {/* Tools */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/3 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border rounded w-3/4"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            className="p-1 flex items-center gap-2 text-black font-bold bg-gray-200 rounded-lg hover:bg-gray-300 transition cursor-pointer"
            onClick={() => handleChangePagination({ sort: sort === "ASC" ? "DESC" : "ASC" })}
          >
            Sort {sort === "ASC" ? "🔼" : "🔽"}
          </button>
        </div>

        <button 
          className="px-4 py-2 bg-green-500 text-white rounded hover:cursor-pointer hover:bg-green-600"
          onClick={() => setOpenModal(prev => user ? 
            { ...prev, sideModal: !openSideModal } : 
            { ...prev, authModal: true })
          }
        >+ Add</button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300 shadow-lg">
        <thead>
          <tr className="bg-gray-700 text-white">
            {["Name", "Category", "Type", "Price", "Description", "User", "Actions"].map(
              (col) => (
                <th key={col} className="p-2 border">{col}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item: ItemDto, index: number) => (
            <tr key={index} className="text-center">
              <td className="p-2 border h-full">
                <div className="flex items-center gap-2 h-full">
                  <img src={item.avatar} width={30} height={30} className="rounded-full" />
                  {item.name}
                </div>
              </td>
              <td className="p-2 border">
                <div className="flex flex-col inline-flex gap-2">
                  {item.categories.map((category) => (
                    <span 
                      className="bg-purple-600 text-white p-1 text-sm rounded-md" 
                      key={category.id}
                    >{category.name}</span>
                  ))}
                </div>
              </td>
              <td className="p-2 border">{item.type}</td>
              <td className="p-2 border">${item.price}</td>
              <td className="p-2 border">{item.description}</td>
              <td className="p-2 border">{item.user?.username}</td>
              <td className="p-2 border h-full">
                <div className="flex gap-2 justify-center h-full items-center">
                  <button 
                    className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded cursor-pointer"
                    onClick={() => {
                      if(!user) return setOpenModal(prev => ({ ...prev, authModal: true }))

                      setOpenModal(prev => ({ ...prev, sideModal: !openSideModal }))
                      setFormData({
                        type: 'update',
                        data: {
                          id: item.id,
                          name: item.name,
                          avatar: item.avatar,
                          type: item.type,
                          price: item.price,
                          description: item.description,
                          categoryIds: item.categories.map(c => c.id!)
                        }
                      })
                    }}
                  >Edit</button>
                  <button 
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer"
                    onClick={() => user ? 
                      handleDeleteItem(item.id) : 
                      setOpenModal(prev => ({ ...prev, authModal: true }))
                    }
                  >Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:text-black hover:bg-blue-600 hover:cursor-pointer"
          onClick={() => handleChangePagination({ page: Math.max(page - 1, 1) })}
          disabled={page === 1}
        >
          Previous
        </button>

        <div className="flex items-center gap-4">
          <span className="text-white">
            Page {page} of {totalPages}
          </span>

          <label className="text-white text-sm">Items per page:</label>
          <select
            className="border rounded px-2 py-1 text-white"
            value={limit}
            onChange={(e) => handleChangePagination({ page: 1, limit: Number(e.target.value) })}
          >
            {[10, 20, 50, 100].map((num) => (
              <option className="text-black" key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:text-black hover:bg-blue-600 hover:cursor-pointer"
          onClick={() => handleChangePagination({ page: Math.min(page + 1, totalPages) })}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
