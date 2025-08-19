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
  displayOrder: number;
  isActive: boolean;
  parentId: string;
  categoryType: 'main' | 'sub'; // New field to distinguish between main and subcategories
  heroType: 'static' | 'component';
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroImageType: 'url' | 'upload' | 'static';
  heroImageFile: File | null;
  heroStaticImagePath: string;
  heroComponentName: string;
  heroComponentProps: string;
}

interface FormErrors {
  [key: string]: string;
}

const CategoryManagement = () => {
  // Form state
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    parentId: '',
    imageUrl: '',
    imageType: 'url',
    imageFile: null,
    staticImagePath: '',
    categoryType: 'main', // Default to main category
    heroType: 'static', // Default to static hero
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    heroImageType: 'url',
    heroImageFile: null,
    heroStaticImagePath: '',
    heroComponentName: '',
    heroComponentProps: '{}',
    metaTitle: '',
    metaDescription: '',
    displayOrder: 0,
    isActive: true
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isUploading, setIsUploading] = useState(false);
  
  // Categories state
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Component selection state
  const [showCustomComponent, setShowCustomComponent] = useState(false);
  const [customComponentName, setCustomComponentName] = useState('');

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

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    // Image validation based on type
    if (formData.imageType === 'url' && !formData.imageUrl.trim()) {
      errors.imageUrl = 'Image URL is required';
    } else if (formData.imageType === 'upload' && !formData.imageFile) {
      errors.imageUrl = 'Please upload an image file';
    } else if (formData.imageType === 'static' && !formData.staticImagePath.trim()) {
      errors.imageUrl = 'Please select a static image';
    }

    // Ensure we have a final image URL for submission
    if (!formData.imageUrl.trim()) {
      errors.imageUrl = 'Category image is required';
    }

    // Validation for main categories
    if (formData.categoryType === 'main') {
      if (!formData.metaTitle.trim()) {
        errors.metaTitle = 'Meta title is required for main categories';
      }

      if (!formData.metaDescription.trim()) {
        errors.metaDescription = 'Meta description is required for main categories';
      }

      // Hero validation for static hero type
      if (formData.heroType === 'static') {
        if (formData.heroImageType === 'url' && formData.heroImage && !formData.heroImage.trim()) {
          errors.heroImage = 'Hero image URL cannot be empty';
        } else if (formData.heroImageType === 'upload' && !formData.heroImageFile && !formData.heroImage) {
          errors.heroImage = 'Please upload a hero image or leave empty';
        } else if (formData.heroImageType === 'static' && formData.heroStaticImagePath && !formData.heroImage) {
          errors.heroImage = 'Please select a static hero image';
        }
      }

      // Component hero validation
      if (formData.heroType === 'component') {
        if (!formData.heroComponentName) {
          errors.heroComponentName = 'Component name is required for component hero';
        }
        
        // Validate JSON format for component props
        try {
          JSON.parse(formData.heroComponentProps || '{}');
        } catch (error) {
          errors.heroComponentProps = 'Invalid JSON format';
        }
      }
    }

    // Validation for subcategories
    if (formData.categoryType === 'sub') {
      if (!formData.parentId.trim()) {
        errors.parentId = 'Parent category is required for subcategories';
      }
    }

    if (formData.displayOrder < 0) {
      errors.displayOrder = 'Display order must be 0 or greater';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle component name selection
    if (name === 'heroComponentName') {
      if (value === 'custom') {
        setShowCustomComponent(true);
        setFormData(prev => ({
          ...prev,
          [name]: customComponentName
        }));
      } else {
        setShowCustomComponent(false);
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else if (name === 'categoryType') {
      // Handle category type change
      setFormData(prev => ({
        ...prev,
        categoryType: value as 'main' | 'sub',
        // Clear parent ID if switching to main category
        parentId: value === 'main' ? '' : prev.parentId
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'displayOrder' ? parseInt(value) || 0 : value
      }));
    }

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle custom component name change
  const handleCustomComponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomComponentName(value);
    setFormData(prev => ({
      ...prev,
      heroComponentName: value
    }));
    
    // Clear error when typing
    if (formErrors.heroComponentName) {
      setFormErrors(prev => ({
        ...prev,
        heroComponentName: ''
      }));
    }
  };

  // Handle image file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isHero: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    // Show loading state
    setIsUploading(true);
    const fieldName = isHero ? 'heroImage' : 'imageUrl';
    setFormErrors(prev => ({
      ...prev,
      [fieldName]: 'Uploading...'
    }));

    try {
      // Upload the file
      const uploadResponse = await UploadImage({
        file,
        folder: isHero ? 'heroes' : 'categories'
      });

      if (uploadResponse.success && uploadResponse.data) {
        // Update form data with the uploaded image URL
        if (isHero) {
          setFormData(prev => ({
            ...prev,
            heroImageFile: file,
            heroImage: uploadResponse.data!.imageUrl
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            imageFile: file,
            imageUrl: uploadResponse.data!.imageUrl
          }));
        }

        // Clear loading state
        setFormErrors(prev => ({
          ...prev,
          [fieldName]: ''
        }));
      } else {
        // Show error
        setFormErrors(prev => ({
          ...prev,
          [fieldName]: uploadResponse.message || 'Upload failed'
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setFormErrors(prev => ({
        ...prev,
        [fieldName]: 'Upload failed. Please try again.'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image type change
  const handleImageTypeChange = (type: 'url' | 'upload' | 'static', isHero: boolean = false) => {
    if (isHero) {
      setFormData(prev => ({
        ...prev,
        heroImageType: type,
        heroImage: type === 'static' ? prev.heroStaticImagePath : (type === 'url' ? '' : prev.heroImage),
        heroImageFile: type === 'upload' ? prev.heroImageFile : null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        imageType: type,
        imageUrl: type === 'static' ? prev.staticImagePath : (type === 'url' ? '' : prev.imageUrl),
        imageFile: type === 'upload' ? prev.imageFile : null
      }));
    }
  };

  // Available static images
  const staticImages = [
    { value: '/assets/images/home_2.png', label: 'Home 2' },
    { value: '/assets/images/home.jpg', label: 'Home' },
    { value: '/assets/images/electronics.png', label: 'Electronics' },
    { value: '/assets/images/auto_hero.jpg', label: 'Auto Hero' },
    { value: '/assets/images/electroic_hero.jpg', label: 'Electronic Hero' },
    { value: '/assets/images/fashion_hero.png', label: 'Fashion Hero' },
    { value: '/assets/images/hp_hero.jpeg', label: 'HP Hero' },
    { value: '/assets/images/hp_hero2.jpeg', label: 'HP Hero 2' },
    { value: '/assets/images/hp_hero3.png', label: 'HP Hero 3' },
    { value: '/assets/images/laptop.jpg', label: 'Laptop' },
    { value: '/assets/images/led-speaker.jpg', label: 'LED Speaker' },
    { value: '/assets/images/lenovo.jpg', label: 'Lenovo' },
    { value: '/assets/images/beats.jpg', label: 'Beats' },
    { value: '/assets/images/auto_1.png', label: 'Auto 1' },
    { value: '/assets/images/auto_2.png', label: 'Auto 2' },
    { value: '/assets/images/fashion_1.png', label: 'Fashion 1' },
    { value: '/assets/images/home_1.png', label: 'Home 1' },
    { value: '/assets/images/home_20.jpg', label: 'Home 20' }
  ];

  // Handle static image selection
  const handleStaticImageSelect = (imagePath: string, isHero: boolean = false) => {
    if (isHero) {
      setFormData(prev => ({
        ...prev,
        heroStaticImagePath: imagePath,
        heroImage: imagePath
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        staticImagePath: imagePath,
        imageUrl: imagePath
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Prepare API request data based on category type
      const requestData = {
        Name: formData.name,
        Description: formData.description,
        Slug: formData.slug,
        ParentId: formData.categoryType === 'sub' ? formData.parentId : null,
        DisplayOrder: 0,
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
          parentId: '',
          imageUrl: '',
          imageType: 'url',
          imageFile: null,
          staticImagePath: '',
          categoryType: 'main',
          heroType: 'static',
          heroTitle: '',
          heroSubtitle: '',
          heroImage: '',
          heroImageType: 'url',
          heroImageFile: null,
          heroStaticImagePath: '',
          metaTitle: '',
          metaDescription: '',
          heroComponentName: '',
          heroComponentProps: '',
          displayOrder: 0
        });
      } else {
        throw new Error(response.Message || 'Failed to create category');
      }
          heroComponentName: '',
          heroComponentProps: '{}',
          metaTitle: '',
          metaDescription: '',
          displayOrder: 0,
          isActive: true
        });

        // Reset component selection state
        setShowCustomComponent(false);
        setCustomComponentName('');

        // Show success message for 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);

      } else {
        setSubmitError(response.message || 'Failed to create category');
        
        // Handle field-specific errors
        if (response.errors) {
          const fieldErrors: FormErrors = {};
          Object.entries(response.errors).forEach(([field, messages]) => {
            fieldErrors[field.toLowerCase()] = messages[0]; // Show first error message
          });
          setFormErrors(fieldErrors);
        }
      }

    } catch (error) {
      console.error('Error creating category:', error);
      setSubmitError('An unexpected error occurred while creating the category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      parentId: '',
      imageUrl: '',
      imageType: 'url',
      imageFile: null,
      staticImagePath: '',
      categoryType: 'main',
      heroType: 'static',
      heroTitle: '',
      heroSubtitle: '',
      heroImage: '',
      heroImageType: 'url',
      heroImageFile: null,
      heroStaticImagePath: '',
      heroComponentName: '',
      heroComponentProps: '{}',
      metaTitle: '',
      metaDescription: '',
      displayOrder: 0,
      isActive: true
    });
    setFormErrors({});
    setSubmitError(null);
    setShowCustomComponent(false);
    setCustomComponentName('');
  };

  // Flatten categories for parent selection (only main categories can be parents)
  const getMainCategoriesForParentSelect = (): Array<{id: string, name: string}> => {
    return categories
      .filter(cat => !cat.parentId) // Only root-level categories
      .map(cat => ({
        id: cat.id,
        name: cat.name
      }));
  };

  const mainCategories = getMainCategoriesForParentSelect();

  return (
    <div className="category-management">
      <div className="category-management-header">
        <h1>Category Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create New Category'}
        </button>
      </div>

      {/* Success Notification */}
      {submitSuccess && (
        <div className="notification success">
          <span className="success-icon">✅</span>
          <span>Category created successfully!</span>
        </div>
      )}

      {/* Error Notification */}
      {submitError && (
        <div className="notification error">
          <span className="error-icon">⚠️</span>
          <span>{submitError}</span>
          <button 
            className="close-btn"
            onClick={() => setSubmitError(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Category Creation Form */}
      {showForm && (
        <div className="category-form-container">
          <form onSubmit={handleSubmit} className="category-form">
            <h2>Create New Category</h2>
            
            <div className="form-grid">
              {/* Basic Information */}
              <div className="form-section">
                <h3>Basic Information</h3>
                
                <div className="form-field">
                  <label htmlFor="name">Category Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={formErrors.name ? 'error' : ''}
                    placeholder="e.g., Electronics, Fashion, Automotive"
                  />
                  {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                </div>

                <div className="form-field">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={formErrors.description ? 'error' : ''}
                    placeholder="Brief description of the category"
                    rows={3}
                  />
                  {formErrors.description && <span className="field-error">{formErrors.description}</span>}
                </div>

                <div className="form-field">
                  <label htmlFor="categoryType">Category Type *</label>
                  <select
                    id="categoryType"
                    name="categoryType"
                    value={formData.categoryType}
                    onChange={handleInputChange}
                    className={formErrors.categoryType ? 'error' : ''}
                  >
                    <option value="main">Main Category (with Hero section)</option>
                    <option value="sub">Subcategory (no Hero section)</option>
                  </select>
                  {formErrors.categoryType && <span className="field-error">{formErrors.categoryType}</span>}
                </div>

                <div className="form-field">
                  <label htmlFor="parentId">Parent Category</label>
                  <select
                    id="parentId"
                    name="parentId"
                    value={formData.parentId}
                    onChange={handleInputChange}
                    disabled={formData.categoryType === 'main'}
                  >
                    <option value="">None (Root Category)</option>
                    {mainCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {formData.categoryType === 'sub' && formErrors.parentId && (
                    <span className="field-error">{formErrors.parentId}</span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="displayOrder">Display Order *</label>
                  <input
                    type="number"
                    id="displayOrder"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    className={formErrors.displayOrder ? 'error' : ''}
                    min="0"
                    placeholder="0"
                  />
                  {formErrors.displayOrder && <span className="field-error">{formErrors.displayOrder}</span>}
                </div>
              </div>

              {/* Visual Content */}
              <div className="form-section">
                <h3>Visual Content</h3>
                
                <div className="form-field">
                  <label>Category Image *</label>
                  
                  {/* Image Type Selection */}
                  <div className="image-type-selector">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="imageType"
                        value="url"
                        checked={formData.imageType === 'url'}
                        onChange={() => handleImageTypeChange('url', false)}
                      />
                      URL
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="imageType"
                        value="upload"
                        checked={formData.imageType === 'upload'}
                        onChange={() => handleImageTypeChange('upload', false)}
                      />
                      Upload File
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="imageType"
                        value="static"
                        checked={formData.imageType === 'static'}
                        onChange={() => handleImageTypeChange('static', false)}
                      />
                      Static Image
                    </label>
                  </div>

                  {/* URL Input */}
                  {formData.imageType === 'url' && (
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className={formErrors.imageUrl ? 'error' : ''}
                      placeholder="https://example.com/category-image.jpg"
                    />
                  )}

                  {/* File Upload */}
                  {formData.imageType === 'upload' && (
                    <div className="file-upload-section">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, false)}
                        className="file-input"
                        disabled={isUploading}
                      />
                      {isUploading && (
                        <div className="upload-loading">
                          <span>🔄 Uploading image...</span>
                        </div>
                      )}
                      {formData.imageFile && !isUploading && (
                        <div className="upload-preview">
                          <span>📁 {formData.imageFile.name}</span>
                          <span className="upload-path">Uploaded to: {formData.imageUrl}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Static Image Selection */}
                  {formData.imageType === 'static' && (
                    <select
                      value={formData.staticImagePath}
                      onChange={(e) => handleStaticImageSelect(e.target.value, false)}
                      className="static-image-select"
                    >
                      <option value="">Select a static image...</option>
                      {staticImages.map(img => (
                        <option key={img.value} value={img.value}>
                          {img.label} ({img.value})
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Image Preview */}
                  {formData.imageUrl && (
                    <div className="image-preview">
                      <label>Preview:</label>
                      <img
                        src={formData.imageUrl}
                        alt="Category preview"
                        style={{ maxWidth: '200px', maxHeight: '120px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="image-path">{formData.imageUrl}</span>
                    </div>
                  )}

                  {formErrors.imageUrl && <span className="field-error">{formErrors.imageUrl}</span>}
                </div>

                {/* Hero Configuration - Only for main categories */}
                {formData.categoryType === 'main' && (
                  <>
                    <div className="form-field">
                      <label htmlFor="heroType">Hero Type *</label>
                      <select
                        id="heroType"
                        name="heroType"
                        value={formData.heroType}
                        onChange={handleInputChange}
                      >
                        <option value="static">Static Hero (Title, Subtitle, Image)</option>
                        <option value="component">Component Hero (Dynamic Component)</option>
                      </select>
                    </div>

                {/* Static Hero Fields */}
                {formData.heroType === 'static' && (
                  <>
                    <div className="form-field">
                      <label htmlFor="heroTitle">Hero Title</label>
                      <input
                        type="text"
                        id="heroTitle"
                        name="heroTitle"
                        value={formData.heroTitle}
                        onChange={handleInputChange}
                        placeholder="Hero section title"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="heroSubtitle">Hero Subtitle</label>
                      <input
                        type="text"
                        id="heroSubtitle"
                        name="heroSubtitle"
                        value={formData.heroSubtitle}
                        onChange={handleInputChange}
                        placeholder="Hero section subtitle"
                      />
                    </div>

                    <div className="form-field">
                      <label>Hero Background Image</label>
                      
                      {/* Hero Image Type Selection */}
                      <div className="image-type-selector">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="heroImageType"
                            value="url"
                            checked={formData.heroImageType === 'url'}
                            onChange={() => handleImageTypeChange('url', true)}
                          />
                          URL
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="heroImageType"
                            value="upload"
                            checked={formData.heroImageType === 'upload'}
                            onChange={() => handleImageTypeChange('upload', true)}
                          />
                          Upload File
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="heroImageType"
                            value="static"
                            checked={formData.heroImageType === 'static'}
                            onChange={() => handleImageTypeChange('static', true)}
                          />
                          Static Image
                        </label>
                      </div>

                      {/* Hero URL Input */}
                      {formData.heroImageType === 'url' && (
                        <input
                          type="url"
                          name="heroImage"
                          value={formData.heroImage}
                          onChange={handleInputChange}
                          placeholder="https://example.com/hero-image.jpg"
                        />
                      )}

                      {/* Hero File Upload */}
                      {formData.heroImageType === 'upload' && (
                        <div className="file-upload-section">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, true)}
                            className="file-input"
                            disabled={isUploading}
                          />
                          {isUploading && (
                            <div className="upload-loading">
                              <span>🔄 Uploading hero image...</span>
                            </div>
                          )}
                          {formData.heroImageFile && !isUploading && (
                            <div className="upload-preview">
                              <span>📁 {formData.heroImageFile.name}</span>
                              <span className="upload-path">Uploaded to: {formData.heroImage}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Hero Static Image Selection */}
                      {formData.heroImageType === 'static' && (
                        <select
                          value={formData.heroStaticImagePath}
                          onChange={(e) => handleStaticImageSelect(e.target.value, true)}
                          className="static-image-select"
                        >
                          <option value="">Select a static image...</option>
                          {staticImages.map(img => (
                            <option key={img.value} value={img.value}>
                              {img.label} ({img.value})
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Hero Image Preview */}
                      {formData.heroImage && (
                        <div className="image-preview">
                          <label>Preview:</label>
                          <img
                            src={formData.heroImage}
                            alt="Hero preview"
                            style={{ maxWidth: '300px', maxHeight: '180px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <span className="image-path">{formData.heroImage}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Component Hero Fields */}
                {formData.heroType === 'component' && (
                  <>
                    <div className="form-field">
                      <label htmlFor="heroComponentName">Component Name *</label>
                      <select
                        id="heroComponentName"
                        name="heroComponentName"
                        value={showCustomComponent ? 'custom' : formData.heroComponentName}
                        onChange={handleInputChange}
                        className={formErrors.heroComponentName ? 'error' : ''}
                      >
                        <option value="">Select a component</option>
                        <option value="HomepageInteractiveHero">Homepage Interactive Hero</option>
                        <option value="ElectronicsDynamicHero">Electronics Dynamic Hero</option>
                        <option value="AutoPromotionHero">Auto Promotion Hero</option>
                        <option value="PersonalizedHomepageHero">Personalized Homepage Hero</option>
                        <option value="CarouselHero">Carousel Hero</option>
                        <option value="custom">🎯 Enter Custom Component Name</option>
                      </select>
                      {formErrors.heroComponentName && <span className="field-error">{formErrors.heroComponentName}</span>}
                    </div>

                    {/* Custom Component Name Input */}
                    {showCustomComponent && (
                      <div className="form-field custom-component-field">
                        <label htmlFor="customComponentName">Custom Component Name *</label>
                        <input
                          type="text"
                          id="customComponentName"
                          name="customComponentName"
                          value={customComponentName}
                          onChange={handleCustomComponentChange}
                          className={formErrors.heroComponentName ? 'error' : ''}
                          placeholder="e.g., MyCustomHero, SpecialPromoHero"
                        />
                        <small>Enter the exact name of your custom React component</small>
                        {formErrors.heroComponentName && <span className="field-error">{formErrors.heroComponentName}</span>}
                      </div>
                    )}

                    <div className="form-field">
                      <label htmlFor="heroComponentProps">Component Props (JSON)</label>
                      <textarea
                        id="heroComponentProps"
                        name="heroComponentProps"
                        value={formData.heroComponentProps}
                        onChange={handleInputChange}
                        className={formErrors.heroComponentProps ? 'error' : ''}
                        placeholder='{"promoCode": "SALE2025", "campaignId": "summer-campaign"}'
                        rows={4}
                      />
                      <small>Enter valid JSON for component props. Leave as {} if no props needed.</small>
                      {formErrors.heroComponentProps && <span className="field-error">{formErrors.heroComponentProps}</span>}
                    </div>
                  </>
                )}
                  </>
                )}
              </div>

              {/* SEO Information - Only for main categories */}
              {formData.categoryType === 'main' && (
                <div className="form-section">
                  <h3>SEO Information</h3>
                  
                  <div className="form-field">
                    <label htmlFor="metaTitle">Meta Title *</label>
                    <input
                      type="text"
                      id="metaTitle"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      className={formErrors.metaTitle ? 'error' : ''}
                      placeholder="SEO title for this category"
                      maxLength={60}
                    />
                    <small>Recommended: 50-60 characters</small>
                    {formErrors.metaTitle && <span className="field-error">{formErrors.metaTitle}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="metaDescription">Meta Description *</label>
                    <textarea
                      id="metaDescription"
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      className={formErrors.metaDescription ? 'error' : ''}
                    placeholder="SEO description for this category"
                    maxLength={160}
                    rows={3}
                  />
                  <small>Recommended: 150-160 characters</small>
                  {formErrors.metaDescription && <span className="field-error">{formErrors.metaDescription}</span>}
                </div>
              </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset
              </button>
              <button 
                type="submit" 
                className={`btn-primary ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating...
                  </>
                ) : (
                  'Create Category'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Categories Display */}
      <div className="existing-categories">
        <h2>Existing Categories</h2>
        
        {/* Loading State */}
        {isLoadingCategories && (
          <div className="loading-state">
            <span>🔄 Loading categories...</span>
          </div>
        )}

        {/* Error State */}
        {categoriesError && (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <span>{categoriesError}</span>
            <button 
              className="btn-secondary"
              onClick={fetchCategories}
            >
              Retry
            </button>
          </div>
        )}

        {/* Categories Tree */}
        {!isLoadingCategories && !categoriesError && (
          <div className="categories-tree">
            {categories.length > 0 ? (
              categories.map(category => (
                <CategoryTreeItem key={category.id} category={category} level={0} />
              ))
            ) : (
              <div className="empty-state">
                <span>📝 No categories found</span>
                <p>Create your first category to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Component to display category tree
const CategoryTreeItem: React.FC<{category: CategoryResponse, level: number}> = ({ category, level }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="category-tree-item" style={{ marginLeft: `${level * 20}px` }}>
      <div className="category-item-header">
        {category.children && category.children.length > 0 && (
          <button 
            className="expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '−' : '+'}
          </button>
        )}
        <div className="category-info">
          <span className="category-name">{category.name}</span>
          <span className="category-id">ID: {category.id}</span>
          {category.slug && <span className="category-slug">Slug: {category.slug}</span>}
        </div>
      </div>
      
      {isExpanded && category.children && (
        <div className="category-children">
          {category.children.map(child => (
            <CategoryTreeItem key={child.id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
