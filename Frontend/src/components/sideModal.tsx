import React, { useEffect, useState } from "react";

import { CategoryDto, FormDataDto, OpenModal } from "@/common/entity";
import { batchUpdateCategories, getCategories } from "@/common/apis";

const typeOptions = ["NEW", "USED", "REFURBISHED", "LIMITED", "DIGITAL"];

type SideModalProps = {
  handleSubmit: () => Promise<void>
  formData: FormDataDto
  setFormData: React.Dispatch<React.SetStateAction<FormDataDto>>
  setOpenModal: React.Dispatch<React.SetStateAction<OpenModal>>
};

export default function SideModal(props: SideModalProps) {
  const { formData, setFormData, setOpenModal, handleSubmit } = props;
  const { type, data } = formData

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      //   setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  return (
    <form 
      className="fixed top-0 right-0 h-full w-1/4 bg-white text-black shadow-lg px-10 py-6 overflow-y-auto"
      onSubmit={(e) => { 
        e.preventDefault()
        handleSubmit()
      }}
    >
      {/* Header */}
      <button
        className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-gray-700"
        onClick={() => setOpenModal(prev => ({ ...prev, sideModal: false }))}
      >
        ✖
      </button>
      <h1 className="text-3xl font-bold mb-10">{type === 'create' ? 'Add New Item' : 'Update Item'}</h1>

      {/* Upload */}
      <label className="block mb-2 font-semibold">Upload Image</label>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload} 
        className="p-2 bg-gray-400 rounded cursor-pointer hover:bg-gray-500"
      />
      {data.avatar && (<img className="mt-2 max-w-[200px] max-h-[200px]" src={data.avatar} />)}

      {/* Name */}
      <label className="block mt-4 font-semibold">Name</label>
      <input
        type="text"
        required
        autoFocus
        className="w-full p-2 border rounded"
        value={data.name}
        onChange={(e) => setFormData(prev => ({ ...prev, data: { ...prev.data, name: e.target.value }}))}
      />

      {/* Categories */}
      <CategoryComponent formData={formData} setFormData={setFormData} />

      {/* Type */}
      <label className="block mt-4 font-semibold">Type</label>
      <select
        className="w-full p-2 border rounded"
        required
        value={data.type}
        onChange={(e) => setFormData(prev => ({ ...prev, data: { ...prev.data, type: e.target.value }}))}
      >
        {typeOptions.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* Price */}
      <label className="block mt-4 font-semibold">Price</label>
      <input
        type="number"
        required
        min={0}
        className="w-full p-2 border rounded"
        value={data.price}
        onChange={(e) => setFormData(prev => ({ ...prev, data: { ...prev.data, price: Number(e.target.value) }}))}
      />

      {/* Description */}
      <label className="block mt-4 font-semibold">Description</label>
      <textarea
        className="w-full p-2 border rounded"
        value={data.description}
        onChange={(e) => setFormData(prev => ({ ...prev, data: { ...prev.data, description: e.target.value }}))}
      />

      {/* Submit */}
      <input
        type="submit"
        value="Save"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded w-full cursor-pointer hover:bg-blue-600"
      />
    </form>
  );
}

function CategoryComponent(props: Pick<SideModalProps, "formData" | "setFormData">) {
  const { formData, setFormData } = props
  const { data } = formData

  // States
  const [categoryOptions, setCategoryOptions] = useState<CategoryDto[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const applyCategories = () => {
    setFormData(prev => ({ ...prev, data: { ...prev.data, categoryIds: selectedCategories }}))
    setShowDropdown(false);
  }

  const addNewCategory = () => {
    if (newCategory) {
      const newCategoryList = [...categoryOptions, { name: newCategory }]
      batchUpdateCategories(newCategoryList)
        .then(data => {
          setCategoryOptions(data);
          setNewCategory("");
        })
        .catch(error => console.error(error));
    }
  }

  useEffect(() => {
      getCategories()
        .then(data => setCategoryOptions(data))
        .catch(error => console.error(error));
    }, []);

  return (
    <React.Fragment>
      <label className="block mt-4 font-semibold">Categories</label>
      <div className="relative">
        <button
          className="w-full p-2 border rounded flex justify-between items-center"
          type="button"
          onClick={() => {
            setShowDropdown(!showDropdown);
            setSelectedCategories([...data.categoryIds]);
          }}
        >
          {/* Selected categories */}
          <div className="flex flex-wrap gap-2">
            {data.categoryIds.map((categoryId) => (
              <span
                key={categoryId}
                className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm flex items-center gap-1"
              >
                {categoryOptions.find(item => item.id === categoryId)?.name || ''}
              </span>
            ))}
          </div>
          <span>▼</span>
        </button>

        {showDropdown && (
          <div className="absolute w-full bg-white border rounded mt-1 shadow-lg z-10 p-2">
            {/* Input */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                className="w-full p-1 border rounded"
                placeholder="Add new category..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNewCategory()}
              />
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm cursor-pointer hover:bg-blue-600"
                onClick={addNewCategory}
              >
                Add
              </button>
            </div>

            {/* List categories */}
            {categoryOptions.map((category) => (
              <label key={category.id} className="flex items-center p-2 hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id!)}
                  onChange={() => handleCategoryChange(category.id!)}
                  className="mr-2"
                />
                {category.name}
              </label>
            ))}

            <div className="p-2 flex justify-between">
              <button
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                onClick={() => setShowDropdown(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                onClick={applyCategories}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
