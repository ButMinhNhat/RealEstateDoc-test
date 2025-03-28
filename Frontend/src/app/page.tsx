"use client"
import { useState } from "react";

export default function Home() {
  const [items, setItems] = useState([
    { code: "A001", name: "Item 1", category: "Cat 1", type: "Type A", price: 100, description: "Desc 1" },
    { code: "A002", name: "Item 2", category: "Cat 2", type: "Type B", price: 200, description: "Desc 2" },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    code: "", name: "", category: "", type: "", price: 0, description: ""
  });

  const handleChange = (e: any) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setItems([...items, newItem]);
    setNewItem({ code: "", name: "", category: "", type: "", price: 0, description: "" });
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between space-x-4">
          <span className="text-2xl font-bold mb-4">Item management</span>

          <button 
            className="mb-4 px-4 py-2 bg-purple-700 hover:bg-purple-800 font-bold text-white rounded cursor-pointer" 
            onClick={() => setIsOpen(true)}
          >
            Add
          </button>
        </div>

        {/* Table */}
        <table className="w-full bg-gray rounded-lg shadow">
          <thead>
            <tr className="bg-gray-700">
              {["Avatar", "Code", "Name", "Category", "Type", "Price", "Description"].map((col) => (
                <th key={col} className="p-2 border">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="p-2 border"></td>
                <td className="p-2 border">{item.code}</td>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.category}</td>
                <td className="p-2 border">{item.type}</td>
                <td className="p-2 border">${item.price}</td>
                <td className="p-2 border">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Thêm Item</h2>
              {["code", "name", "category", "type", "price", "description"].map((field) => (
                <input
                  key={field}
                  type={field === "price" ? "number" : "text"}
                  name={field}
                  value={''}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full p-2 mb-2 border rounded"
                />
              ))}
              <div className="flex justify-end gap-2">
                <button 
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Hủy
                </button>
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded"
                  onClick={handleSubmit}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
