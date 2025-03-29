"use client"
import { useEffect, useState } from "react";

import { FormDataDto, ItemPaginationDto, OpenModal, UserDto } from "@/common/entity";
import TableWithPagination from "@/components/table";
import { getPaginationItems, createItem, updateItem, deleteItems } from "@/common/apis";
import SideModal from "@/components/sideModal";
import AuthModal from "@/components/authModal";

const defaultPagination = {
  data: [],
  page: 1,
  limit: 10,
  total: 0,
  sort: 'DESC',
  search: ''
}

const defaultFormData = {
  id: "",
  name: "",
  avatar: "https://pbs.twimg.com/profile_images/1110148780991623201/vlqCsAVP_400x400.png",
  type: "NEW",
  price: 0,
  description: "",
  categoryIds: [],
}

export default function Home() {
  // States
  const [user, setUser] = useState<UserDto | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [openModal , setOpenModal] = useState<OpenModal>({ authModal: false, sideModal: false })

  const [paginationData, setPaginationData] = useState<ItemPaginationDto>(defaultPagination)
  const [formData, setFormData] = useState<FormDataDto>({ type: 'create', data: defaultFormData })
  
  // Functions
  const handleChangePagination = (newData: Partial<ItemPaginationDto>) => {
    setPaginationData({ ...paginationData, ...newData })
    setLoading(true)
  }

  const handleSubmit = async () => {
    if(formData.type === 'create') 
      return createItem(formData.data)
        .then(() => resetForm())
        .catch(error => console.error(error))

    if(formData.type === 'update' && formData.data?.id) {
      const { id, ...reqData } = formData.data
      return updateItem(id, reqData)
        .then(() => resetForm())
        .catch(error => console.error(error))
    }
  }

  const handleDeleteItem = async (itemId: string) => 
    deleteItems([itemId])
      .then(() => setLoading(true))
      .catch(error => console.error(error))

  const resetForm = () => {
    setFormData({ type: 'create', data: defaultFormData })
    setOpenModal(prev => ({ ...prev, sideModal: false }))
    setLoading(true)
  }

  // Use effect
  useEffect(() => {
    const userLocalStorage = localStorage.getItem('user')
    if(userLocalStorage) setUser(JSON.parse(userLocalStorage))
  }, [])

  useEffect(() => {
    if(loading) {
      let queryString = `page=${paginationData.page}&limit=${paginationData.limit}&sort=${paginationData.sort}`
      if(paginationData.search) queryString += `&search=${paginationData.search}`

      getPaginationItems(queryString)
        .then(data => {
          setPaginationData({ ...paginationData, ...data })
          setLoading(false)
        })
        .catch(error => console.error(error));
    }
  }, [loading]);

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between space-x-4 mb-6">
          <span className="text-4xl font-bold">Item management</span>
          {user ? (
            <span>
              Hi, <span className="font-bold underline">{user.username}</span>
            </span>
          ) : (
            <span>
              <span 
                className="font-bold underline cursor-pointer"
                onClick={() => setOpenModal(prev => ({ ...prev, authModal: true }))}
              >Sign In</span> 
              {" "}or{" "} 
              <span 
                className="font-bold underline cursor-pointer"
                onClick={() => setOpenModal(prev => ({ ...prev, authModal: true }))}
              >Sign up</span>
            </span>
          )}
        </div>

        {/* Table */}
        <TableWithPagination 
          user={user}
          paginationData={paginationData} 
          openSideModal={openModal.sideModal}
          setFormData={setFormData} 
          setOpenModal={setOpenModal} 
          handleDeleteItem={handleDeleteItem}
          handleChangePagination={handleChangePagination}
        />

        {/* Side Modal */}
        {openModal.sideModal && (
          <SideModal 
            handleSubmit={handleSubmit}
            formData={formData} 
            setFormData={setFormData} 
            setOpenModal={setOpenModal} 
          />
        )}

        {/* Auth Modal */}
        {openModal.authModal && (
          <AuthModal 
            setUser={setUser}
            setOpenModal={setOpenModal}
          />
        )}
      </div>
    </div>
  );
}
