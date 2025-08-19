"use client";
import React, { useState, useEffect } from 'react';
import { CreateCategory, validateCategoryData } from '@/lib/api/CreateCategoryAPI';
import { GetAllCategories, organizeCategoriesHierarchy, flattenCategories, getRootCategories } from '@/lib/api/GetAllCategoriesAPI';
import { UploadImage, validateImageFile, generateSafeFilename } from '@/lib/api/UploadImageAPI';
import { CategoryResponse } from '@/types/category';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  imageUrl: string;
  imageType: 'url' | 'upload' | 'static';
  imageFile: File | null;
  staticImagePath: string;
  categoryType: 'main' | 'sub';
  parentId: string;
  heroType: 'static' | 'component';
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroImageType: 'url' | 'upload' | 'static';
  heroImageFile: File | null;
  heroStaticImagePath: string;
  heroComponentName: string;
  heroComponentProps: string;
  displayOrder: number;
  isActive: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const CategoryManagement: React.FC = () => {
  // State management
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    imageUrl: '',
    imageType: 'url',
    imageFile: null,
    staticImagePath: '',
    categoryType: 'main',
    parentId: '',
    heroType: 'static',
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    heroImageType: 'url',
    heroImageFile: null,
    heroStaticImagePath: '',
    heroComponentName: '',
    heroComponentProps: '{}',
    displayOrder: 0,
    isActive: true
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    setCategoriesError(null);

    try {
      const response = await GetAllCategories();
      setCategories(response);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setCategoriesError(error.message || 'An error occurred while loading categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof CategoryFormData, value: string | number | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Auto-generate slug from name
    if (field === 'name' && typeof value === 'string') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  // Handle file upload for category image
  const handleImageUpload = async (file: File) => {
    try {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const uploadResponse = await UploadImage({ file, folder: 'categories' });
      
      if (uploadResponse.success && uploadResponse.data) {
        setFormData(prev => ({
          ...prev,
          imageUrl: uploadResponse.data!.imageUrl,
          imageFile: file,
          imageType: 'upload'
        }));
      } else {
        throw new Error(uploadResponse.error || 'Failed to upload image');
      }
    } catch (error: any) {
      setFormErrors(prev => ({ ...prev, image: error.message }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFormErrors({});
    setSubmitError(null);

    // Validate form data
    const validation = validateCategoryData({
      Name: formData.name,
      Description: formData.description,
      ImageUrl: formData.imageUrl,
      ...(formData.categoryType === 'main' && {
        Hero: {
          title: formData.heroTitle,
          subtitle: formData.heroSubtitle,
          image: formData.heroImage,
        },
        MetaTitle: formData.metaTitle,
        MetaDescription: formData.metaDescription,
      }),
      ...(formData.categoryType === 'sub' && {
        ParentId: formData.parentId,
      }),
    }, formData.categoryType === 'main');

    if (!validation.isValid) {
      const fieldErrors: FormErrors = {};
      validation.errors.forEach(error => {
        // Map validation errors to form fields
        if (error.includes('name')) fieldErrors.name = error;
        if (error.includes('description')) fieldErrors.description = error;
        if (error.includes('image')) fieldErrors.imageUrl = error;
        if (error.includes('Hero title')) fieldErrors.heroTitle = error;
        if (error.includes('Hero subtitle')) fieldErrors.heroSubtitle = error;
        if (error.includes('Hero image')) fieldErrors.heroImage = error;
        if (error.includes('Meta title')) fieldErrors.metaTitle = error;
        if (error.includes('Meta description')) fieldErrors.metaDescription = error;
        if (error.includes('Parent')) fieldErrors.parentId = error;
      });
      setFormErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare API request data
      const requestData = {
        Name: formData.name,
        Description: formData.description,
        Slug: formData.slug,
        ParentId: formData.categoryType === 'sub' ? formData.parentId : null,
        DisplayOrder: formData.displayOrder,
        ImageUrl: formData.imageUrl,
        // Hero object (only for main categories)
        ...(formData.categoryType === 'main' && {
          Hero: {
            title: formData.heroTitle,
            subtitle: formData.heroSubtitle,
            image: formData.heroImage,
          },
          MetaTitle: formData.metaTitle,
          MetaDescription: formData.metaDescription,
        }),
      };

      const response = await CreateCategory(requestData);

      if (response.Code === "0") {
        setSubmitSuccess(true);
        setShowForm(false);
        
        // Refresh categories list
        fetchCategories();
        
        // Reset form
        setFormData({
          name: '',
          slug: '',
          description: '',
          metaTitle: '',
          metaDescription: '',
          imageUrl: '',
          imageType: 'url',
          imageFile: null,
          staticImagePath: '',
          categoryType: 'main',
          parentId: '',
          heroType: 'static',
          heroTitle: '',
          heroSubtitle: '',
          heroImage: '',
          heroImageType: 'url',
          heroImageFile: null,
          heroStaticImagePath: '',
          heroComponentName: '',
          heroComponentProps: '{}',
          displayOrder: 0,
          isActive: true
        });

        // Hide success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        throw new Error(response.Message || 'Failed to create category');
      }
    } catch (error: any) {
      console.error('Error creating category:', error);
      setSubmitError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get parent category options for subcategories
  const getParentCategoryOptions = () => {
    return categories
      .filter(cat => !cat.ParentId) // Only root-level categories
      .map(cat => ({
        id: cat.Id,
        name: cat.Name
      }));
  };

  // Static image options
  const staticImageOptions = [
    { value: '/assets/images/home_2.png', label: 'Home & Kitchen' },
    { value: '/assets/images/electronics.png', label: 'Electronics' },
    { value: '/assets/images/auto_1.png', label: 'Automotive' },
    { value: '/assets/images/fashion_1.png', label: 'Fashion' },
  ];

  return (
    <div className="category-management">
      <div className="category-management-header">
        <h1>Category Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Category'}
        </button>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="alert alert-success">
          Category created successfully!
        </div>
      )}

      {/* Add Category Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="category-form">
          <h2>Add New Category</h2>

          {/* Category Type Selection */}
          <div className="form-group">
            <label>Category Type:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="main"
                  checked={formData.categoryType === 'main'}
                  onChange={(e) => handleInputChange('categoryType', e.target.value as 'main' | 'sub')}
                />
                Main Category (with Hero Section)
              </label>
              <label>
                <input
                  type="radio"
                  value="sub"
                  checked={formData.categoryType === 'sub'}
                  onChange={(e) => handleInputChange('categoryType', e.target.value as 'main' | 'sub')}
                />
                Subcategory
              </label>
            </div>
          </div>

          {/* Parent Category (for subcategories) */}
          {formData.categoryType === 'sub' && (
            <div className="form-group">
              <label>Parent Category:</label>
              <select
                value={formData.parentId}
                onChange={(e) => handleInputChange('parentId', e.target.value)}
                required
              >
                <option value="">Select Parent Category</option>
                {getParentCategoryOptions().map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              {formErrors.parentId && <span className="error">{formErrors.parentId}</span>}
            </div>
          )}

          {/* Basic Category Info */}
          <div className="form-group">
            <label>Category Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            {formErrors.name && <span className="error">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label>Slug:</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
            />
            {formErrors.description && <span className="error">{formErrors.description}</span>}
          </div>

          {/* Category Image */}
          <div className="form-group">
            <label>Category Image:</label>
            <div className="image-input-options">
              <label>
                <input
                  type="radio"
                  value="url"
                  checked={formData.imageType === 'url'}
                  onChange={(e) => handleInputChange('imageType', e.target.value as 'url' | 'upload' | 'static')}
                />
                Image URL
              </label>
              <label>
                <input
                  type="radio"
                  value="upload"
                  checked={formData.imageType === 'upload'}
                  onChange={(e) => handleInputChange('imageType', e.target.value as 'url' | 'upload' | 'static')}
                />
                Upload File
              </label>
              <label>
                <input
                  type="radio"
                  value="static"
                  checked={formData.imageType === 'static'}
                  onChange={(e) => handleInputChange('imageType', e.target.value as 'url' | 'upload' | 'static')}
                />
                Static Image
              </label>
            </div>

            {formData.imageType === 'url' && (
              <input
                type="url"
                placeholder="Enter image URL"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                required
              />
            )}

            {formData.imageType === 'upload' && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                required
              />
            )}

            {formData.imageType === 'static' && (
              <select
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                required
              >
                <option value="">Select static image</option>
                {staticImageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {formErrors.imageUrl && <span className="error">{formErrors.imageUrl}</span>}
          </div>

          {/* Hero Section (only for main categories) */}
          {formData.categoryType === 'main' && (
            <>
              <h3>Hero Section</h3>
              
              <div className="form-group">
                <label>Hero Title:</label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                  required
                />
                {formErrors.heroTitle && <span className="error">{formErrors.heroTitle}</span>}
              </div>

              <div className="form-group">
                <label>Hero Subtitle:</label>
                <input
                  type="text"
                  value={formData.heroSubtitle}
                  onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                  required
                />
                {formErrors.heroSubtitle && <span className="error">{formErrors.heroSubtitle}</span>}
              </div>

              <div className="form-group">
                <label>Hero Image URL:</label>
                <input
                  type="url"
                  value={formData.heroImage}
                  onChange={(e) => handleInputChange('heroImage', e.target.value)}
                  required
                />
                {formErrors.heroImage && <span className="error">{formErrors.heroImage}</span>}
              </div>

              <h3>SEO Metadata</h3>
              
              <div className="form-group">
                <label>Meta Title:</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  required
                />
                {formErrors.metaTitle && <span className="error">{formErrors.metaTitle}</span>}
              </div>

              <div className="form-group">
                <label>Meta Description:</label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  required
                />
                {formErrors.metaDescription && <span className="error">{formErrors.metaDescription}</span>}
              </div>
            </>
          )}

          {/* Submit Error */}
          {submitError && (
            <div className="alert alert-error">
              {submitError}
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="categories-section">
        <div className="categories-header">
          <h2>Existing Categories</h2>
          <button onClick={fetchCategories} className="btn-secondary">
            Refresh
          </button>
        </div>

        {isLoadingCategories && <div className="loading">Loading categories...</div>}
        
        {categoriesError && (
          <div className="alert alert-error">
            {categoriesError}
          </div>
        )}

        {!isLoadingCategories && !categoriesError && categories.length === 0 && (
          <div className="empty-state">
            No categories found. Create your first category!
          </div>
        )}

        {!isLoadingCategories && !categoriesError && categories.length > 0 && (
          <div className="categories-tree">
            {categories.map(category => (
              <CategoryTreeItem key={category.Id} category={category} level={0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Component to display category tree
const CategoryTreeItem: React.FC<{
  category: CategoryResponse;
  level: number;
}> = ({ category, level }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`category-tree-item level-${level}`}>
      <div className="category-item-header" onClick={() => setIsExpanded(!isExpanded)}>
        {category.Children && category.Children.length > 0 && (
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        <div className="category-info">
          <span className="category-name">{category.Name}</span>
          <span className="category-id">ID: {category.Id}</span>
          {category.Slug && <span className="category-slug">Slug: {category.Slug}</span>}
        </div>
      </div>
      
      {isExpanded && category.Children && (
        <div className="category-children">
          {category.Children.map((child: CategoryResponse) => (
            <CategoryTreeItem key={child.Id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
