import React, { useState, useEffect } from 'react';
import ErrorMessage from '../Common/ErrorMessage';
import Loading from '../Common/Loading';

const NoteForm = ({ 
  note, 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  error = null,
  categories = [] 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    isImportant: false
  });

  const [formErrors, setFormErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        content: note.content || '',
        category: note.category || 'General',
        isImportant: note.isImportant || false
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'General',
        isImportant: false
      });
    }
  }, [note]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    } else if (formData.content.length > 5000) {
      errors.content = 'Content cannot exceed 5000 characters';
    }

    if (formData.category.length > 50) {
      errors.category = 'Category cannot exceed 50 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const isEditing = !!note;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Edit Note' : 'Create New Note'}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {isEditing ? 'Update your note details below.' : 'Fill in the details for your new note.'}
        </p>
      </div>

      {error && (
        <ErrorMessage 
          message={error} 
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              formErrors.title ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            placeholder="Enter note title"
          />
          {formErrors.title && (
            <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
            list="categories"
            className={`mt-1 block w-full px-3 py-2 border ${
              formErrors.category ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            placeholder="Enter category"
          />
          <datalist id="categories">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
          {formErrors.category && (
            <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            rows={8}
            value={formData.content}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              formErrors.content ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            placeholder="Write your note content here..."
          />
          {formErrors.content && (
            <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.content.length}/5000 characters
          </p>
        </div>

        {/* Important checkbox */}
        <div className="flex items-center">
          <input
            id="isImportant"
            name="isImportant"
            type="checkbox"
            checked={formData.isImportant}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isImportant" className="ml-2 block text-sm text-gray-700">
            Mark as important
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <Loading size="small" text="" />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              <span>{isEditing ? 'Update Note' : 'Create Note'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;