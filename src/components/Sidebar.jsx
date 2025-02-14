import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, setSelectedCategory } from '../store/slices/productsSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.products.categories);
  const selectedCategory = useSelector((state) => state.products.selectedCategory);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="sidebar">
      <h2>Categories</h2>
      <ul className="category-list">
        <li
          className={`category-item ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => dispatch(setSelectedCategory(null))}
        >
          All Products
        </li>
        {categories.map((category) => (
          <li
            key={category}
            className={`category-item ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => dispatch(setSelectedCategory(category))}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;